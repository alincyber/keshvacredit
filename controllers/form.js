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
        message: "PLEASE ENTER ALL THE DETAILS"
      });
    }

if (!phone) {
  return res.status(400).json({
    message: "PHONE NUMBER IS REQUIRED"
  });
}

if (phone.length !== 10) {
  return res.status(400).json({
    message: "PHOEN NUMBER MUST BE 10 DIGITS"
  });
}

if (isNaN(phone)) {
  return res.status(400).json({
    message: "PHONE NUMBER ONLY MUST CONTAIN"
  });
}
    // Existing user check
    const existuser = await User.findOne({
      $or: [{ pan }, { phone }]
    });

    if (existuser) {
      return res.status(409).json({
        message: "USER ALREADY EXIST"
      });
    }
if (!email || !email.includes("@gmail") || !email.includes(".com")) {
  return res.status(400).json({
    message: "PLEASE ENTER THE '@gamil.com'"
  });
}

// PAN Card Validation

if (!pan) {
  return res.status(400).json({
    message: "PAN CARD IS REQUIRED"
  });
}

if (pan.length !== 10) {
  return res.status(400).json({
    message: "PAN CARD MUST BE 10 CHARACTERS"
  });
}

// First 5 must be letters
for (let i = 0; i < 5; i++) {
  if (
    pan[i] < "A" || pan[i] > "Z"
  ) {
    return res.status(400).json({
      message: "FIRST 5 CHARACTERS MUST BE CAPITAL LETTERS"
    });
  }
}

// Next 4 must be numbers
for (let i = 5; i < 9; i++) {
  if (isNaN(pan[i])) {
    return res.status(400).json({
      message: "MIDDLE 4 CHARACTERS MUST BE NUMBERS"
    });
  }
}

// Last must be capital letter
if (pan[9] < "A" || pan[9] > "Z") {
  return res.status(400).json({
    message: "LAST CHARACTER MUST BE CAPITAL LETTER"
  });
}
    // const token = jwt.sign(
    //   { name, email },
    //   SECRET_KEY,
    //   { expiresIn: "1d" }
    // );


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

    return res.status(201).json({
      message: "USER CREATED SUCCESSFULLY",
      // token,
      data: newuser.phone,
    });

  } catch (error) {
    throw error
  }
};

const updateuser=async(req,res)=>{
  try {
    const{name,...update}=req.body;
    if(!pan){
      return res.status(400).json({
        message:"THE PAN IS REQUIRED"
      })
    }
    if(!updateuser){
      return res.status(400).json({
        message:"THE USER NOT FOUND",
      })
    }
    return res.status(200).json({
      message:"THE USER SUCCESSSFULLY UPDATED"
    })
  } catch (error) {
    throw error
  }
}

module.exports = { createuser };