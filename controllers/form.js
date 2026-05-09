const User = require("../model/userdata");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "this_is_secret_key";

const createuser = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      pan,
      dob,
      income,
      loan_amount,
      employment_type,
      pincode,
      city,
      state
    } = req.body;

    if (
      !name || !phone || !email || !pan || !dob ||
      !income || !loan_amount || !employment_type ||
      !pincode || !city || !state
    ) {
      return res.status(400).json({
        message: "Please enter all details"
      });
    }
    if(!phone===10){
        ret
    }
    const existuser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existuser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const token = jwt.sign(
      { name, email },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const newuser = new User({
      name,
      phone,
      email,
      pan,
      dob,
      income,
      loan_amount,
      employment_type,
      pincode,
      city,
      state
    });

    await newuser.save();

    res.status(201).json({
      message: "User created successfully",
      token,
      data: newuser
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { createuser };