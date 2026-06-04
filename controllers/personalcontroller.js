const person = require("../model/personalmodel");
const PersonalLender = require("../model/personallendermodel");

const isPersonEligibleForLender = (person, lender) => {

    const ageOk = person.person_age >= lender.min_customer_age && 
                  (!lender.max_customer_age || person.person_age <= lender.max_customer_age);
    
    const monthlyIncome = person.annual_income / 12;
    const incomeOk = !lender.min_monthly_income || 
                     monthlyIncome >= lender.min_monthly_income;

    const loanOk = person.personal_loan_amount >= lender.min_loan_amount && 
                   person.personal_loan_amount <= lender.max_loan_amount;
    

    const purposeOk = lender.allowed_loan_purposes.length === 0 || 
                      lender.allowed_loan_purposes.includes(person.loan_purpose);
    
    return ageOk && incomeOk && loanOk && purposeOk;
};


const createPersonalUser = async (req, res) => {
    try {
        const {
            person_name,
            person_email,
            person_phone,
            person_pan,
            person_dob,
            person_aadhar,
            person_name_as_per_aadhar,
            employment_type,
            person_age,
            loan_purpose,
            annual_income,
            person_location,
            personal_loan_amount
        } = req.body;

        if (!person_name || !person_email || !person_phone || !person_pan || !person_dob || 
            !person_aadhar || !person_name_as_per_aadhar || !employment_type || !person_age || 
            !loan_purpose || !annual_income || !person_location || !personal_loan_amount) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER ALL THE REQUIRED DETAILS"
            });
        }


        const existingPerson = await person.findOne({ 
            $or: [{ person_pan: person_pan }, { person_phone: person_phone }] 
        });
        
        if (existingPerson) {
            return res.status(400).json({
                success: false,
                message: "PERSON WITH THIS PAN OR PHONE NUMBER ALREADY EXISTS"
            });
        }


        if (String(person_phone).length !== 10 || isNaN(person_phone)) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER MUST BE 10 DIGITS"
            });
        }

        if (!person_email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER A VALID EMAIL ADDRESS"
            });
        }

        if (String(person_aadhar).length !== 12 || isNaN(person_aadhar)) {
            return res.status(400).json({
                success: false,
                message: "AADHAR NUMBER MUST BE 12 DIGITS"
            });
        }

  
        const birthDate = new Date(person_dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        
        if (calculatedAge !== person_age) {
            return res.status(400).json({
                success: false,
                message: "AGE DOES NOT MATCH WITH DATE OF BIRTH"
            });
        }

        if (person_age < 18 || person_age > 80) {
            return res.status(400).json({
                success: false,
                message: "AGE MUST BE BETWEEN 18 AND 80 YEARS"
            });
        }


        const personObj = new person({
            person_name,
            person_email,
            person_phone,
            person_pan,
            person_dob,
            person_aadhar,
            person_name_as_per_aadhar,
            employment_type,
            person_age,
            loan_purpose,
            annual_income,
            person_location,
            personal_loan_amount
        });

        const savedPerson = await personObj.save();
        

        const lenders = await PersonalLender.find();
        
        const personData = {
            person_age: savedPerson.person_age,
            annual_income: savedPerson.annual_income,
            personal_loan_amount: savedPerson.personal_loan_amount,
            loan_purpose: savedPerson.loan_purpose
        };
        
        const eligibleLenders = lenders.filter(lender => isPersonEligibleForLender(personData, lender));
        
  
        const lendersWithDetails = eligibleLenders.map(lender => ({
            lender_name: lender.lender_name,
            interest_rate: lender.interest_rate,
            min_loan_amount: lender.min_loan_amount,
            max_loan_amount: lender.max_loan_amount,
            min_age_required: lender.min_customer_age,
            max_age_allowed: lender.max_customer_age || "No limit",
            min_monthly_income_required: lender.min_monthly_income || "Not specified"
        }));

        return res.status(201).json({
            success: true,
            message: "PERSONAL LOAN APPLICATION SUBMITTED SUCCESSFULLY",
            data: {
                id: savedPerson._id,
                person_name: savedPerson.person_name,
                person_phone: savedPerson.person_phone,
                person_email: savedPerson.person_email,
                loan_amount: savedPerson.personal_loan_amount,
                loan_purpose: savedPerson.loan_purpose
            },
            lenders_checked: lenders.length,
            eligible_lenders_count: eligibleLenders.length,
            eligible_lenders: lendersWithDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const compareUserByPhone = async (req, res) => {
    try {
        const { person_phone } = req.body;

        if (!person_phone) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS REQUIRED"
            });
        }

        if (String(person_phone).length !== 10 || isNaN(person_phone)) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER A VALID 10-DIGIT PHONE NUMBER"
            });
        }

        const user = await person.findOne({ person_phone: String(person_phone) });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "NO USER FOUND WITH THIS PHONE NUMBER. PLEASE REGISTER FIRST."
            });
        }

        const lenders = await PersonalLender.find();
        
        if (lenders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "NO LENDERS AVAILABLE FOR COMPARISON",
                user_details: {
                    name: user.person_name,
                    phone: user.person_phone,
                    email: user.person_email,
                    age: user.person_age,
                    loan_amount: user.personal_loan_amount,
                    loan_purpose: user.loan_purpose,
                    annual_income: user.annual_income
                },
                eligible_lenders: []
            });
        }
        
        const personData = {
            person_age: user.person_age,
            annual_income: user.annual_income,
            personal_loan_amount: user.personal_loan_amount,
            loan_purpose: user.loan_purpose
        };
        
        const eligibleLenders = lenders.filter(lender => isPersonEligibleForLender(personData, lender));
        
        const lendersWithDetails = eligibleLenders.map(lender => ({
            lender_name: lender.lender_name,
            interest_rate: `${lender.interest_rate}%`,
            min_loan_amount: lender.min_loan_amount,
            max_loan_amount: lender.max_loan_amount,
            min_age_required: lender.min_customer_age,
            max_age_allowed: lender.max_customer_age || "No limit",
            min_monthly_income_required: lender.min_monthly_income || "Not specified"
        }));

        return res.status(200).json({
            success: true,
            message: eligibleLenders.length > 0 ? "ELIGIBLE LENDERS FOUND" : "NO ELIGIBLE LENDERS FOUND",
            user_details: {
                id: user._id,
                name: user.person_name,
                phone: user.person_phone,
                email: user.person_email,
                age: user.person_age,
                employment_type: user.employment_type,
                annual_income: user.annual_income,
                loan_amount_requested: user.personal_loan_amount,
                loan_purpose: user.loan_purpose
            },
            lenders_checked: lenders.length,
            eligible_lenders_count: eligibleLenders.length,
            eligible_lenders: lendersWithDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getPersonByPhone = async (req, res) => {
    try {
        const { person_phone } = req.body;

        if (!person_phone) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS REQUIRED"
            });
        }

        const personData = await person.findOne({ person_phone: String(person_phone) });

        if (!personData) {
            return res.status(404).json({
                success: false,
                message: "PERSON NOT FOUND WITH THIS PHONE NUMBER"
            });
        }

        return res.status(200).json({
            success: true,
            data: personData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};


const updateUserByPan = async (req, res) => {
    try {
        const { person_pan } = req.body;

        if (!person_pan) {
            return res.status(400).json({
                success: false,
                message: "PERSON PAN IS REQUIRED"
            });
        }

        const updatedPerson = await person.findOneAndUpdate(
            { person_pan: person_pan },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPerson) {
            return res.status(404).json({
                success: false,
                message: "PERSON NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: "PERSON UPDATED SUCCESSFULLY",
            data: updatedPerson
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};


const deletePersonByPan = async (req, res) => {
    try {
        const { person_pan } = req.body;

        if (!person_pan) {
            return res.status(400).json({
                success: false,
                message: "PERSON PAN IS REQUIRED"
            });
        }

        const deletedPerson = await person.findOneAndDelete({ person_pan: person_pan });

        if (!deletedPerson) {
            return res.status(404).json({
                success: false,
                message: "PERSON NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: "PERSON DELETED SUCCESSFULLY",
            deleted_person: person_pan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};


const getPerson = async (req, res) => {
    try {
        const persons = await person.find();
        return res.status(200).json({
            success: true,
            count: persons.length,
            data: persons
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

module.exports = {
    createPersonalUser,
    compareUserByPhone,
    getPersonByPhone,
    updateUserByPan,
    deletePersonByPan,
    getPerson
};