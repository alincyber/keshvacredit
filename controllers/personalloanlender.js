const Person = require("../model/personalmodel");
const PersonalLender = require("../model/personallendermodel");
const mongoose = require("mongoose");


const isPersonEligibleForLender = (person, lender) => {
    const ageOk = lender.min_customer_age 
        ? Number(person.person_age) >= Number(lender.min_customer_age) 
        : true;

    const monthlyIncome = person.annual_income / 12;
    const incomeOk = lender.min_monthly_income 
        ? Number(monthlyIncome) >= Number(lender.min_monthly_income) 
        : true;

    const loanOk = lender.max_loan_amount 
        ? Number(person.personal_loan_amount) <= Number(lender.max_loan_amount) &&
          Number(person.personal_loan_amount) >= Number(lender.min_loan_amount)
        : true;


    const purposeOk = !lender.allowed_loan_purposes || lender.allowed_loan_purposes.length === 0 ||
        lender.allowed_loan_purposes.some(purpose => 
            String(purpose).toLowerCase() === String(person.loan_purpose || "").toLowerCase()
        );

    return ageOk && incomeOk && loanOk && purposeOk;
};

const addPersonalUser = async (req, res) => {
    try {
        const {
            lender_name,
            min_loan_amount,
            max_loan_amount,
            min_customer_age,
            max_customer_age,
            min_monthly_income,
            interest_rate,
            allowed_loan_purposes,
        } = req.body;

        const existingLender = await PersonalLender.findOne({ lender_name });

if (existingLender) {
    return res.status(409).json({
        success: false,
        message: "PERSONAL LENDER PROFILE ALREADY EXISTS"
    });
}

        if (!lender_name) {
            return res.status(400).json({
                success: false,
                message: "LENDER NAME IS REQUIRED"
            });
        }

        if (min_loan_amount == null) {
            return res.status(400).json({
                success: false,
                message: "MINIMUM LOAN AMOUNT IS REQUIRED"
            });
        }

        if (max_loan_amount == null) {
            return res.status(400).json({
                success: false,
                message: "MAXIMUM LOAN AMOUNT IS REQUIRED"
            });
        }

        if (min_customer_age == null) {
            return res.status(400).json({
                success: false,
                message: "MINIMUM CUSTOMER AGE IS REQUIRED"
            });
        }

        if (max_customer_age == null) {
            return res.status(400).json({
                success: false,
                message: "MAXIMUM CUSTOMER AGE IS REQUIRED"
            });
        }

        if (min_monthly_income == null) {
            return res.status(400).json({
                success: false,
                message: "MINIMUM MONTHLY INCOME IS REQUIRED"
            });
        }

        if (interest_rate == null) {
            return res.status(400).json({
                success: false,
                message: "INTEREST RATE IS REQUIRED"
            });
        }

        if (
            !Array.isArray(allowed_loan_purposes) ||
            allowed_loan_purposes.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "LOAN PURPOSES ARE REQUIRED"
            });
        }

        const lender = new PersonalLender({
            lender_name,
            min_loan_amount,
            max_loan_amount,
            min_customer_age,
            max_customer_age,
            min_monthly_income,
            interest_rate,
            allowed_loan_purposes,
        });

        await lender.save();

        return res.status(201).json({
            success: true,
            message: "LENDER ADDED SUCCESSFULLY",
            data: lender.toObject(),
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message,
        });
    }
};


const getPersonById = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ message: "PERSON NOT FOUND" });
        }
        return res.status(200).json({ success: true, data: person });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


const getPersonByPhone = async (req, res) => {
    try {
        const { person_phone } = req.body;
        
        if (!person_phone) {
            return res.status(400).json({ message: "PERSON PHONE NUMBER IS REQUIRED" });
        }
        
        const person = await Person.findOne({ person_phone: String(person_phone) });
        if (!person) {
            return res.status(404).json({ message: "PERSON NOT FOUND" });
        }
        return res.status(200).json({ success: true, data: person });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const comparePersonalLoans = async (req, res) => {
    try {
        const { person_phone } = req.body;

        if (!person_phone) {
            return res.status(400).json({ message: "PERSON PHONE NUMBER IS REQUIRED" });
        }

        if (String(person_phone).length !== 10 || isNaN(person_phone)) {
            return res.status(400).json({ message: "PHONE NUMBER MUST BE A VALID 10-DIGIT NUMBER" });
        }

        const personProfile = await Person.findOne({ person_phone: String(person_phone) });
        if (!personProfile) {
            return res.status(404).json({
                message: "NO PERSON FOUND WITH THIS PHONE NUMBER. PLEASE REGISTER THE PERSON PROFILE FIRST."
            });
        }

        if (!personProfile.person_age || !personProfile.annual_income || !personProfile.personal_loan_amount) {
            return res.status(400).json({
                message: "PERSON PROFILE CONTENT IS INCOMPLETE FOR GENERATING LENDER MATCHES"
            });
        }

        const personData = {
            person_age: Number(personProfile.person_age),
            annual_income: Number(personProfile.annual_income),
            personal_loan_amount: Number(personProfile.personal_loan_amount),
            loan_purpose: personProfile.loan_purpose
        };

        const lenders = await PersonalLender.find();
        const eligibleLenders = lenders.filter(lender => isPersonEligibleForLender(personData, lender));

        const lendersWithEMI = eligibleLenders.map(lender => {
            const monthlyRate = lender.interest_rate / 100 / 12;
            const emi = personData.personal_loan_amount * monthlyRate * Math.pow(1 + monthlyRate, 12) / 
                        (Math.pow(1 + monthlyRate, 12) - 1);
            return {
                ...lender.toObject(),
                estimated_emi: Math.round(emi),
                total_payable: Math.round(emi * 12),
                total_interest: Math.round((emi * 12) - personData.personal_loan_amount)
            };
        });

        return res.status(200).json({
            success: true,
            message: eligibleLenders.length > 0 ? "ELIGIBLE PERSONAL LENDERS FOUND" : "NO ELIGIBLE LENDERS FOUND FOR THIS PERSON PROFILE",
            person_profile: personProfile,
            lendersChecked: lenders.length,
            total_matches: eligibleLenders.length,
            eligible_lenders: lendersWithEMI
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const updatePersonByPan = async (req, res) => {
    try {
        const { person_pan, ...updateData } = req.body;

        if (!person_pan) {
            return res.status(400).json({ message: "PERSON PAN IS REQUIRED FOR UPDATE" });
        }

        if (updateData.person_age !== undefined && isNaN(updateData.person_age)) {
            return res.status(400).json({ message: "PERSON AGE MUST BE A NUMBER" });
        }
        if (updateData.annual_income !== undefined && isNaN(updateData.annual_income)) {
            return res.status(400).json({ message: "ANNUAL INCOME MUST BE A NUMBER" });
        }
        if (updateData.personal_loan_amount !== undefined && isNaN(updateData.personal_loan_amount)) {
            return res.status(400).json({ message: "PERSONAL LOAN AMOUNT MUST BE A NUMBER" });
        }

        const updatedPerson = await Person.findOneAndUpdate(
            { person_pan },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPerson) {
            return res.status(404).json({ message: "PERSON NOT FOUND" });
        }

        return res.status(200).json({
            success: true,
            message: "PERSON UPDATED SUCCESSFULLY",
            data: updatedPerson
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


const removePersonByPan = async (req, res) => {
    try {
        const { person_pan } = req.body;

        if (!person_pan) {
            return res.status(400).json({ message: "PERSON PAN IS REQUIRED FOR DELETION" });
        }

        const deletedPerson = await Person.findOneAndDelete({ person_pan });

        if (!deletedPerson) {
            return res.status(404).json({ message: "PERSON NOT FOUND" });
        }

        return res.status(200).json({
            success: true,
            message: "PERSON PROFILE DELETED SUCCESSFULLY",
            deleted_person: person_pan
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


const getAllPersonalUsers = async (req, res) => {
    try {
        const persons = await Person.find();
        return res.status(200).json({
            success: true,
            total: persons.length,
            data: persons
        });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

module.exports = {
    addPersonalUser,
    getPersonById,
    getPersonByPhone,
    comparePersonalLoans,
    updatePersonByPan,
    removePersonByPan,
    getAllPersonalUsers
};