const { Router } = require("express");

                 
const createuser = async (req, res) => {
    try {
        const { name, phone, email } = req.body;


        if (!name || !phone || !email) {
            return res.status(400).json({
                message: "Please enter all details"
            });
        }

  
        const existusesr = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (exist) {
            return res.status(409).json({
                message: "User already exists in database",
                data: exist
            });
        }

        const newUser = new User({
            name,
            phone,
            email
        });

        await newUser.save();

        return res.status(201).json({
            message: "User inserted successfully",
            data: newUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const updateuser=async(req,res)=req.body;
try {
    const {name,...update};
    if(!email){
        return res.status(400).json({
            message:"email is require of make changes"
        })
    };
    const updateuser=await User.findOneAndupdate({name},update,{user:true});
    if(!updateuser)
} catch (error) {
    return res.status(400).json({message:"server internal error"});
}

module.exports ={
    createuser,
    updateuser
};