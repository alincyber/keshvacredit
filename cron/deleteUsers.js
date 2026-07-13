const cron = require("node-cron");
const User = require("../model/userdata");
const logger = require("../config/logger");

cron.schedule("*/5 * * * *", async () => {
    try {

        const result = await User.deleteMany({
            deleteRequested: true,
            deleteAt: {
                $lte: new Date()
            }
        });

        if (result.deletedCount > 0) {
            logger.info(`${result.deletedCount} user(s) permanently deleted.`);
        }

    } catch (error) {
        logger.error(error.message);
    }
});