const Partnership = require("../model/partnermodel")

const createpartnership = async (req, res) => {
    try {
        const {
            full_name,
            contact_number,
            email,
            designation,
            partner_type,
            business_type,
            company_profile,
            website,
            products_to_refer,
            expected_business_volume,
            pincode,
            source_of_location
        } = req.body;

        if (!full_name || !contact_number || !email || !designation || 
            !partner_type || !business_type || !company_profile || 
            !expected_business_volume || !pincode || !source_of_location) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER ALL THE REQUIRED DETAILS"
            });
        }


        if (String(contact_number).length !== 10 || isNaN(contact_number)) {
            return res.status(400).json({
                success: false,
                message: "CONTACT NUMBER MUST BE 10 DIGITS"
            });
        }

   
        if (!email.includes("@gmail.com")) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER A VALID EMAIL ADDRESS"
            });
        }

 
        if (String(pincode).length !== 6 || isNaN(pincode)) {
            return res.status(400).json({
                success: false,
                message: "PINCODE MUST BE 6 DIGITS"
            });
        }
        const existingRequest = await Partnership.findOne({ 
            $or: [{ email: email }, { contact_number: contact_number }] 
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "PARTNERSHIP REQUEST ALREADY SUBMITTED WITH THIS EMAIL OR CONTACT NUMBER"
            });
        }

        const partnership = new Partnership({
            full_name,
            contact_number,
            email,
            designation,
            partner_type,
            business_type,
            company_profile,
            website: website ,
            products_to_refer: products_to_refer ,
            expected_business_volume,
            pincode,
            source_of_location,
            status: "Pending",
            submitted_at: new Date()
        });

        const savedPartnership = await partnership.save();

        return res.status(201).json({
            success: true,
            message: "PARTNERSHIP REQUEST SUBMITTED SUCCESSFULLY",
            data: {
                id: savedPartnership._id,
                full_name: savedPartnership.full_name,
                contact_number: savedPartnership.contact_number,
                email: savedPartnership.email,
                status: savedPartnership.status,
                company_profile:savedPartnership.company_profile,
                submitted_at: savedPartnership.submitted_at
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

const updatePartnership = async (req, res) => {
    try {
        const {contact_number } = req.params;
        const updateData = req.body;

        // Check if partnership exists
        const existingPartnership = await Partnership.findById(contact_number);
        
        if (!existingPartnership) {
            return res.status(404).json({
                success: false,
                message: "PARTNERSHIP REQUEST NOT FOUND"
            });
        }

        if (updateData.email || updateData.contact_number) {
            const duplicateCheck = await Partnership.findOne({
                _id: { $ne: id },
                $or: []
            });
            
            if (updateData.email) {
                duplicateCheck.$or.push({ email: updateData.email });
            }
            if (updateData.contact_number) {
                duplicateCheck.$or.push({ contact_number: updateData.contact_number });
            }
            
            if (duplicateCheck.$or.length > 0) {
                const duplicate = await Partnership.findOne(duplicateCheck);
                if (duplicate) {
                    return res.status(400).json({
                        success: false,
                        message: "EMAIL OR CONTACT NUMBER ALREADY EXISTS"
                    });
                }
            }
        }


        updateData.updated_at = new Date();

        const updatedPartnership = await Partnership.findByIdAndUpdate(
            contact_number,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "PARTNERSHIP REQUEST UPDATED SUCCESSFULLY",
            data: updatedPartnership
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const updatePartnershipStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_remarks } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "STATUS IS REQUIRED"
            });
        }

        const validStatuses = ["Pending", "Under Review", "Approved", "Rejected", "Contacted"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "INVALID STATUS. MUST BE: Pending, Under Review, Approved, Rejected, Contacted"
            });
        }

        const updatedPartnership = await Partnership.findByIdAndUpdate(
            id,
            { 
                status: status,
                admin_remarks: admin_remarks || "",
                updated_at: new Date()
            },
            { new: true }
        );

        if (!updatedPartnership) {
            return res.status(404).json({
                success: false,
                message: "PARTNERSHIP REQUEST NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: `PARTNERSHIP REQUEST ${status.toUpperCase()} SUCCESSFULLY`,
            data: updatedPartnership
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
    createpartnership,
    updatePartnership
};