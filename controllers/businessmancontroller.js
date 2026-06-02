const businessman = require("../model/businessmodel");
const createbusinessman = async (req, res) => {
    try {
        const {
            business_owner_name,
            business_owner_email,
            business_owner_phone,
            business_owner_pan,
            business_ower_dob, 
            business_pan,
            business_name,
            business_type,
            business_age,
            business_loan_purpose,
            annual_revenue,
            business_location,
            business_loan_amount,
            Udyam_Registration_Number,
            gst_number,
            msme_registration_number
        } = req.body;

        if (
            !business_owner_name ||
            !business_owner_email ||
            !business_owner_phone ||
            !business_owner_pan ||
            !business_ower_dob ||
            !business_pan ||
            !business_name ||
            !business_type ||
            !business_age ||
            !business_loan_purpose ||
            !annual_revenue ||
            !business_location ||
            !business_loan_amount ||
            !Udyam_Registration_Number ||
            !gst_number ||
            !msme_registration_number
        ) {
            return res.status(400).json({
                message: "PLEASE ENTER ALL THE DETAILS"
            });
        }


        const existingBusiness = await businessman.findOne({
            business_pan
        });

        if (existingBusiness) {
            return res.status(400).json({
                message: "BUSINESS WITH THIS PAN NUMBER ALREADY EXISTS"
            });
        }

        if (String(business_owner_phone).length !== 10) {
            return res.status(400).json({
                message: "PHONE NUMBER MUST BE 10 DIGITS"
            });
        }

        if (isNaN(business_owner_phone)) {
            return res.status(400).json({
                message: "PHONE NUMBER MUST CONTAIN NUMBERS ONLY"
            });
        }

        if (!business_owner_email.includes("@gmail.com")) {
            return res.status(400).json({
                message: "PLEASE ENTER A VALID GMAIL ADDRESS"
            });
        }

        const business = new businessman({
            business_owner_name,
            business_owner_email,
            business_owner_phone,
            business_owner_pan,
            business_ower_dob,
            business_pan,
            business_name,
            business_type,
            business_age,
            business_loan_purpose,
            annual_revenue,
            business_location,
            business_loan_amount,
            Udyam_Registration_Number,
            gst_number,
            msme_registration_number
        });

        const savedBusiness = await business.save();

        return res.status(201).json({
            message: "BUSINESS ADDED SUCCESSFULLY",
            data: savedBusiness
        });

    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getbusinessman = async (req, res) => {
    try {
        const businesses = await businessman.find();

        return res.status(200).json({
            message: "BUSINESS DATA FETCHED SUCCESSFULLY",
            data: businesses
        });

    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const updatebusinessman = async (req, res) => {
    try {
        const { business_pan } = req.body;

        if (!business_pan) {
            return res.status(400).json({
                message: "BUSINESS PAN IS REQUIRED"
            });
        }

        const updatedBusinessman = await businessman.findOneAndUpdate(
            { business_pan },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBusinessman) {
            return res.status(404).json({
                message: "BUSINESS NOT FOUND"
            });
        }

        return res.status(200).json({
            message: "BUSINESS UPDATED SUCCESSFULLY",
            data: updatedBusinessman
        });

    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

module.exports = {
    createbusinessman,
    getbusinessman,
    updatebusinessman
};