const Company = require("../model/company");
const mongoose = require("mongoose");

const normalizeCompanyData = (data) => ({
    company_name: data.company_name,
    min_income: Number(data.min_income),
    max_loan: Number(data.max_loan),
    interest_rate: Number(data.interest_rate),
    allowed_employment: data.allowed_employment,
    serviceable_states: data.serviceable_states
});

const validateCompanyData = (data) => {
    if (
        !data.company_name ||
        data.min_income === undefined ||
        data.max_loan === undefined ||
        data.interest_rate === undefined ||
        !data.allowed_employment ||
        !data.serviceable_states
    ) {
        return "PLEASE ENTER ALL COMPANY DETAILS";
    }

    if (isNaN(data.min_income)) {
        return "MIN INCOME MUST BE A NUMBER";
    }

    if (isNaN(data.max_loan)) {
        return "MAX LOAN MUST BE A NUMBER";
    }

    if (isNaN(data.interest_rate)) {
        return "INTEREST RATE MUST BE A NUMBER";
    }

    if (!Array.isArray(data.allowed_employment)) {
        return "ALLOWED EMPLOYMENT MUST BE AN ARRAY";
    }

    if (!Array.isArray(data.serviceable_states)) {
        return "SERVICEABLE STATES MUST BE AN ARRAY";
    }

    return null;
};

const addCompany = async (req, res) => {
    try {
        const error = validateCompanyData(req.body);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const existCompany = await Company.findOne({
            company_name: req.body.company_name
        });

        if (existCompany) {
            return res.status(409).json({
                message: "COMPANY ALREADY EXISTS"
            });
        }

        const company = new Company(normalizeCompanyData(req.body));
        await company.save();

        return res.status(201).json({
            message: "COMPANY ADDED SUCCESSFULLY",
            data: company
        });
    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        return res.status(200).json({
            success: true,
            total: companies.length,
            data: companies
        });
    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "INVALID COMPANY ID"
            });
        }

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "COMPANY NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            data: company
        });
    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const updateCompany = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "INVALID COMPANY ID"
            });
        }

        const update = { ...req.body };

        if (update.min_income !== undefined) {
            update.min_income = Number(update.min_income);
        }

        if (update.max_loan !== undefined) {
            update.max_loan = Number(update.max_loan);
        }

        if (update.interest_rate !== undefined) {
            update.interest_rate = Number(update.interest_rate);
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "COMPANY NOT FOUND"
            });
        }

        return res.status(200).json({
            message: "COMPANY UPDATED SUCCESSFULLY",
            data: company
        });
    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const removeCompany = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "INVALID COMPANY ID"
            });
        }

        const company = await Company.findByIdAndDelete(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "COMPANY NOT FOUND"
            });
        }

        return res.status(200).json({
            message: "COMPANY DELETED SUCCESSFULLY",
            data: company
        });
    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

module.exports = {
    addCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    removeCompany
};
