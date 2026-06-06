const WorkReport = require("../model/workmodel");

const createWorkReport = async (req, res) => {
    try {
        const {
            employee_name,
            employee_email,
            employee_phone,
            department,
            work_description
        } = req.body;

        // Check all required fields
        if (!employee_name || !employee_email || !employee_phone || !department || !work_description) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER ALL THE REQUIRED DETAILS"
            });
        }

        // Phone validation
        if (String(employee_phone).length !== 10 || isNaN(employee_phone)) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER MUST BE 10 DIGITS"
            });
        }

        // Email validation
        if (!employee_email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER A VALID EMAIL ADDRESS"
            });
        }

        // Create work report
        const workReport = new WorkReport({
            employee_name,
            employee_email,
            employee_phone: String(employee_phone), // Ensure string
            department,
            work_description,
            report_date: new Date()
        });

        const savedReport = await workReport.save();

        return res.status(201).json({
            success: true,
            message: "WORK REPORT SUBMITTED SUCCESSFULLY",
            data: {
                id: savedReport._id,
                employee_name: savedReport.employee_name,
                department: savedReport.department,
                report_date: savedReport.report_date || savedReport.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getWorkReportByPhone = async (req, res) => {
    try {
        const { employee_phone } = req.body;

        if (!employee_phone) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS REQUIRED"
            });
        }

        const reports = await WorkReport.find({ employee_phone: String(employee_phone) })
                                        .sort({ createdAt: -1 }); // Added sorting

        if (!reports || reports.length === 0) {
            return res.status(404).json({
                success: false,
                message: "NO WORK REPORTS FOUND FOR THIS PHONE NUMBER"
            });
        }

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
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
    createWorkReport,
    getWorkReportByPhone,
};