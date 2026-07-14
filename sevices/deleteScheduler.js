const cron = require('node-cron');
const User = require("../model/personalmodel");
const DeletedUser = require("../model/deleteusermodel");
const logger = require("../config/logger");

// Run every hour
const scheduleDeletionCheck = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            logger.info('Running scheduled deletion check...');
            
            const now = new Date();
            
            // Find users whose deletion time has passed and are not yet deleted
            const usersToDelete = await User.find({
                deleteRequested: true,
                deleteAt: { $lte: now },
                accountStatus: 'pending_deletion'
            });

            if (usersToDelete.length === 0) {
                logger.info('No users to delete at this time.');
                return;
            }

            logger.info(`Found ${usersToDelete.length} users to delete.`);

            for (const user of usersToDelete) {
                try {
                    // Move user data to deleted users collection
                    const deletedUser = new DeletedUser({
                        // Copy all user fields
                        person_name: user.person_name,
                        person_email: user.person_email,
                        person_phone: user.person_phone,
                        person_pan: user.person_pan,
                        person_dob: user.person_dob,
                        person_aadhar: user.person_aadhar,
                        person_name_as_per_aadhar: user.person_name_as_per_aadhar,
                        employment_type: user.employment_type,
                        person_age: user.person_age,
                        loan_purpose: user.loan_purpose,
                        annual_income: user.annual_income,
                        person_location: user.person_location,
                        personal_loan_amount: user.personal_loan_amount,
                        
                        // Deletion metadata
                        deleteReason: user.deleteReason,
                        deleteRequestedAt: user.deleteRequestedAt,
                        deletedAt: new Date(),
                        
                        // Store original data as a backup
                        originalUserData: user.toObject()
                    });

                    await deletedUser.save();

                    // Mark user as deleted in main collection
                    user.accountStatus = 'deleted';
                    user.isDeleted = true;
                    await user.save();

                    logger.info(`Successfully moved user ${user.person_email} to deleted users collection.`);

                } catch (error) {
                    logger.error(`Error moving user ${user.person_email} to deleted collection:`, error);
                }
            }

        } catch (error) {
            logger.error('Error in scheduled deletion check:', error);
        }
    });
};

module.exports = { scheduleDeletionCheck };