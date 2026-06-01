const Business = require("../model/businessmodel");
const Company = require("../model/company");
const mongoose = require("mongoose");

// -----------------------------------------
// HELPER: Calculate Age
// -----------------------------------------
const calculateAge = (dob) => {
  const birthDate = new Date(dob);

  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// -----------------------------------------
// HELPER: Check Business Loan Type
// -----------------------------------------
const isBusinessLoanCompany = (company) => {
  if (!Array.isArray(company.loan_types) || company.loan_types.length === 0) {
    return true;
  }

  return company.loan_types.some((loanType) => {
    const value = String(loanType || "").toLowerCase();
    return (
      value.includes("business") ||
      value.includes("msme") ||
      value.includes("sme") ||
      value.includes("working capital")
    );
  });
};

// -----------------------------------------
// HELPER: Check Business Type
// -----------------------------------------
const isBusinessTypeAllowed = (business, company) => {
  if (!Array.isArray(company.allowed_business_types) || company.allowed_business_types.length === 0) {
    return true;
  }

  return company.allowed_business_types.some(
    (businessType) => String(businessType || "").toLowerCase() === String(business.business_type || "").toLowerCase()
  );
};

// -----------------------------------------
// HELPER: Check Business Owner Eligibility
// -----------------------------------------
const getBusinessEligibilityForCompany = (business, company) => {
  const ownerAge = calculateAge(business.business_ower_dob);

  const checks = {
    loan_type: isBusinessLoanCompany(company),
    owner_age: !company.min_age || !company.max_age || (ownerAge >= company.min_age && ownerAge <= company.max_age),
    business_type: isBusinessTypeAllowed(business, company),
    business_age: !company.min_business_age || !company.max_business_age ||
      (Number(business.business_age) >= Number(company.min_business_age) &&
        Number(business.business_age) <= Number(company.max_business_age)),
    annual_revenue: !company.min_income || Number(business.annual_revenue) >= Number(company.min_income),
    loan_amount: !company.max_loan || Number(business.business_loan_amount) <= Number(company.max_loan)
  };

  const failedReasons = [];

  if (!checks.loan_type) {
    failedReasons.push("LENDER DOES NOT OFFER BUSINESS LOANS");
  }

  if (!checks.owner_age) {
    failedReasons.push(`BUSINESS OWNER AGE MUST BE BETWEEN ${company.min_age} AND ${company.max_age}`);
  }

  if (!checks.business_type) {
    failedReasons.push(`BUSINESS TYPE MUST BE ONE OF: ${company.allowed_business_types.join(", ")}`);
  }

  if (!checks.business_age) {
    failedReasons.push(`BUSINESS AGE MUST BE BETWEEN ${company.min_business_age} AND ${company.max_business_age} YEARS`);
  }

  if (!checks.annual_revenue) {
    failedReasons.push(`ANNUAL REVENUE MUST BE AT LEAST ${company.min_income}`);
  }

  if (!checks.loan_amount) {
    failedReasons.push(`REQUESTED LOAN AMOUNT MUST BE ${company.max_loan} OR LESS`);
  }

  return {
    eligible: failedReasons.length === 0,
    failed_reasons: failedReasons,
    checks,
    business_owner_age: ownerAge,
    company_id: company._id,
    company_name: company.company_name,
    interest_rate: company.interest_rate,
    min_owner_age: company.min_age,
    max_owner_age: company.max_age,
    min_annual_revenue: company.min_income,
    max_loan_amount: company.max_loan,
    loan_types: company.loan_types,
    allowed_business_types: company.allowed_business_types,
    min_business_age: company.min_business_age,
    max_business_age: company.max_business_age
  };
};

// -----------------------------------------
// HELPER: Normalize Business Payload
// -----------------------------------------
const normalizeBusinessPayload = (body) => ({
  business_owner_name: body.business_owner_name,
  business_owner_email: body.business_owner_email,
  business_owner_phone: body.business_owner_phone,
  business_owner_pan: body.business_owner_pan,
  business_ower_dob: body.business_ower_dob,
  business_pan: body.business_pan,
  business_name: body.business_name,
  business_type: body.business_type,
  business_age: body.business_age,
  business_loan_purpose: body.business_loan_purpose,
  annual_revenue: body.annual_revenue,
  business_location: body.business_location,
  business_loan_amount: body.business_loan_amount,
  Udyam_Registration_Number: body.Udyam_Registration_Number,
  gst_number: body.gst_number,
  msme_registration_number: body.msme_registration_number
});

// -----------------------------------------
// HELPER: Validate Business Loan Payload
// -----------------------------------------
const validateBusinessPayload = (payload, partial = false) => {
  const requiredFields = [
    "business_owner_name",
    "business_owner_email",
    "business_owner_phone",
    "business_owner_pan",
    "business_ower_dob",
    "business_pan",
    "business_name",
    "business_type",
    "business_age",
    "business_loan_purpose",
    "annual_revenue",
    "business_location",
    "business_loan_amount"
  ];

  const numberFields = [
    "business_owner_phone",
    "business_age",
    "annual_revenue",
    "business_loan_amount"
  ];

  if (!partial) {
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
        return `${field.toUpperCase()} IS REQUIRED`;
      }
    }
  }

  for (const field of numberFields) {
    if (payload[field] !== undefined && payload[field] !== "" && isNaN(payload[field])) {
      return `${field.toUpperCase()} MUST BE A NUMBER`;
    }
  }

  if (payload.business_owner_phone && String(payload.business_owner_phone).length !== 10) {
    return "BUSINESS OWNER PHONE MUST BE 10 DIGITS";
  }

  if (payload.business_ower_dob && isNaN(new Date(payload.business_ower_dob).getTime())) {
    return "BUSINESS OWNER DOB IS INVALID";
  }

  return null;
};

// -----------------------------------------
// ADD BUSINESS LOAN
// -----------------------------------------
const addBusinessLoan = async (req, res) => {
  try {
    const payload = normalizeBusinessPayload(req.body);
    const validationError = validateBusinessPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingBusinessLoan = await Business.findOne({
      business_owner_phone: payload.business_owner_phone,
      business_pan: payload.business_pan
    });

    if (existingBusinessLoan) {
      return res.status(409).json({ message: "BUSINESS LOAN APPLICATION ALREADY EXISTS" });
    }

    const businessLoan = await Business.create(payload);

    return res.status(201).json({
      message: "BUSINESS LOAN APPLICATION ADDED SUCCESSFULLY",
      data: businessLoan
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

// -----------------------------------------
// GET ALL BUSINESS LOANS
// -----------------------------------------
const getBusinessLoans = async (req, res) => {
  try {
    const businessLoans = await Business.find().sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      total: businessLoans.length,
      data: businessLoans
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

// -----------------------------------------
// GET BUSINESS LOAN BY ID
// -----------------------------------------
const getBusinessLoanById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "INVALID BUSINESS LOAN ID" });
    }

    const businessLoan = await Business.findById(req.params.id);

    if (!businessLoan) {
      return res.status(404).json({ message: "BUSINESS LOAN APPLICATION NOT FOUND" });
    }

    return res.status(200).json({ success: true, data: businessLoan });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

// -----------------------------------------
// COMPARE BUSINESS LOANS (Find saved business by phone, PAN, or ID)
// -----------------------------------------
const compareLiveBusinessLoans = async (req, res) => {
  try {
    const { business_owner_phone, business_pan, business_id } = req.body;

    if (!business_owner_phone && !business_pan && !business_id) {
      return res.status(400).json({
        message: "BUSINESS OWNER PHONE, BUSINESS PAN, OR BUSINESS ID IS REQUIRED"
      });
    }

    const query = {};

    if (business_id) {
      if (!mongoose.Types.ObjectId.isValid(business_id)) {
        return res.status(400).json({ message: "INVALID BUSINESS LOAN ID" });
      }
      query._id = business_id;
    } else if (business_owner_phone) {
      if (String(business_owner_phone).length !== 10 || isNaN(business_owner_phone)) {
        return res.status(400).json({ message: "BUSINESS OWNER PHONE MUST BE 10 DIGITS" });
      }
      query.business_owner_phone = business_owner_phone;
    } else {
      query.business_pan = business_pan;
    }

    const businessLoan = await Business.findOne(query);
    if (!businessLoan) {
      return res.status(404).json({
        message: "NO BUSINESS LOAN APPLICATION FOUND. PLEASE COMPLETE THE BUSINESS LOAN FORM FIRST."
      });
    }

    if (!businessLoan.annual_revenue || !businessLoan.business_loan_amount || !businessLoan.business_ower_dob) {
      return res.status(400).json({
        message: "BUSINESS PROFILE IS INCOMPLETE FOR ELIGIBILITY CHECK"
      });
    }

    const companies = await Company.find();
    const lenderEligibility = companies.map((company) => getBusinessEligibilityForCompany(businessLoan, company));
    const businessLoanCompanies = lenderEligibility.filter((result) => result.checks.loan_type);
    const eligibleLenders = lenderEligibility.filter((result) => result.eligible);
    const rejectedLenders = businessLoanCompanies.filter((result) => !result.eligible);

    return res.status(200).json({
      success: true,
      eligible: eligibleLenders.length > 0,
      message: eligibleLenders.length > 0
        ? `BUSINESS OWNER IS ELIGIBLE FOR LOAN WITH: ${eligibleLenders.map((lender) => lender.company_name).join(", ")}`
        : "BUSINESS OWNER IS NOT ELIGIBLE FOR ANY BUSINESS LOAN LENDER",
      business_owner: {
        name: businessLoan.business_owner_name,
        phone: businessLoan.business_owner_phone,
        pan: businessLoan.business_owner_pan,
        age: calculateAge(businessLoan.business_ower_dob)
      },
      business: {
        id: businessLoan._id,
        name: businessLoan.business_name,
        pan: businessLoan.business_pan,
        type: businessLoan.business_type,
        age: businessLoan.business_age,
        annual_revenue: businessLoan.annual_revenue,
        requested_loan_amount: businessLoan.business_loan_amount,
        loan_purpose: businessLoan.business_loan_purpose
      },
      companiesChecked: businessLoanCompanies.length,
      totalCompanies: companies.length,
      totalEligible: eligibleLenders.length,
      eligible_company_names: eligibleLenders.map((lender) => lender.company_name),
      eligible_lenders: eligibleLenders,
      rejected_lenders: rejectedLenders
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

// -----------------------------------------
// APPLY BUSINESS LOAN WITH COMPANY
// -----------------------------------------
const applyBusinessWithCompany = async (req, res) => {
  try {
    const { business_owner_phone, business_pan, business_id, company_id } = req.body;

    if (!company_id) return res.status(400).json({ message: "COMPANY ID IS REQUIRED" });
    if (!business_owner_phone && !business_pan && !business_id) {
      return res.status(400).json({
        message: "BUSINESS OWNER PHONE, BUSINESS PAN, OR BUSINESS ID IS REQUIRED"
      });
    }

    const query = {};

    if (business_id) {
      if (!mongoose.Types.ObjectId.isValid(business_id)) {
        return res.status(400).json({ message: "INVALID BUSINESS LOAN ID" });
      }
      query._id = business_id;
    } else if (business_owner_phone) {
      query.business_owner_phone = business_owner_phone;
    } else {
      query.business_pan = business_pan;
    }

    const businessLoan = await Business.findOne(query);
    if (!businessLoan) {
      return res.status(404).json({
        message: "NO BUSINESS LOAN APPLICATION FOUND. PLEASE COMPLETE THE BUSINESS LOAN FORM FIRST."
      });
    }

    const company = await Company.findById(company_id);
    if (!company) {
      return res.status(404).json({ message: "SELECTED LENDER PROFILE NOT FOUND" });
    }

    const eligibility = getBusinessEligibilityForCompany(businessLoan, company);

    if (!eligibility.eligible) {
      return res.status(200).json({
        success: false,
        message: `APPLICATION DECLINED: BUSINESS PROFILE DOES NOT MATCH ${company.company_name.toUpperCase()} REQUIREMENT POLICIES.`,
        failed_reasons: eligibility.failed_reasons,
        eligibility
      });
    }

    return res.status(200).json({
      success: true,
      message: `ELIGIBILITY CONFIRMED! BUSINESS OWNER QUALIFIES FOR ${company.company_name.toUpperCase()}.`,
      business_summary: {
        business_name: businessLoan.business_name,
        owner_name: businessLoan.business_owner_name,
        owner_phone: businessLoan.business_owner_phone,
        requested_loan: businessLoan.business_loan_amount
      },
      lender_summary: {
        company_id: company._id,
        company_name: company.company_name,
        interest_rate: company.interest_rate,
        max_loan_amount: company.max_loan
      },
      eligibility
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

// -----------------------------------------
// UPDATE BUSINESS LOAN
// -----------------------------------------
const updateBusinessLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "INVALID BUSINESS LOAN ID" });
    }

    const payload = normalizeBusinessPayload(req.body);
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    const validationError = validateBusinessPayload(payload, true);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const businessLoan = await Business.findByIdAndUpdate(
      req.params.id,
      payload,
      { returnDocument: "after", runValidators: true }
    );

    if (!businessLoan) {
      return res.status(404).json({ message: "BUSINESS LOAN APPLICATION NOT FOUND" });
    }

    return res.status(200).json({
      message: "BUSINESS LOAN APPLICATION UPDATED SUCCESSFULLY",
      data: businessLoan
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

// -----------------------------------------
// DELETE BUSINESS LOAN
// -----------------------------------------
const removeBusinessLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "INVALID BUSINESS LOAN ID" });
    }

    const businessLoan = await Business.findByIdAndDelete(req.params.id);

    if (!businessLoan) {
      return res.status(404).json({ message: "BUSINESS LOAN APPLICATION NOT FOUND" });
    }

    return res.status(200).json({
      message: "BUSINESS LOAN APPLICATION DELETED SUCCESSFULLY",
      data: businessLoan
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
  }
};

module.exports = {
  addBusinessLoan,
  getBusinessLoans,
  getBusinessLoanById,
  compareLiveBusinessLoans,
  applyBusinessWithCompany,
  updateBusinessLoan,
  removeBusinessLoan
};
