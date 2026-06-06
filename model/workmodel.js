const mongoose = require('mongoose');

const workReportSchema = new mongoose.Schema({
    employee_name: { type: String, required: true },
    employee_email: { type: String, required: true },
    employee_phone: { type: String, required: true }, // Changed from Number to String
    department: { type: String, required: true },
    work_description: { type: String, required: true },
    report_date: { type: Date, default: Date.now }
}, {
    versionKey: false, 
    timestamps: true
});

module.exports = mongoose.model('WorkReport', workReportSchema, "workReports");