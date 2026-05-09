const { convertProcessSignalToExitCode } = require("node:util");
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
    message: "PHONE NUMBER MUST BE 10 DIGITS"
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


for (let i = 0; i < 5; i++) {
  if (
    pan[i] < "A" || pan[i] > "Z"
  ) {
    return res.status(400).json({
      message: "FIRST 5 CHARACTERS MUST BE CAPITAL LETTERS"
    });
  }
}


for (let i = 5; i < 9; i++) {
  if (isNaN(pan[i])) {
    return res.status(400).json({
      message: "MIDDLE 4 CHARACTERS MUST BE NUMBERS"
    });
  }
}


if (pan[9] < "A" || pan[9] > "Z") {
  return res.status(400).json({
    message: "LAST CHARACTER MUST BE CAPITAL LETTER"
  });
}



if (!dob) {
  return res.status(400).json({
    message: "DATE OF BIRTH IS REQUIRED"
  });
}


if (dob.length !== 10) {
  return res.status(400).json({
    message: "DOB FORMAT MUST BE YYYY-MM-DD"
  });
}

if (dob[4] !== "-" || dob[7] !== "-") {
  return res.status(400).json({
    message: "DOB FORMAT MUST BE YYYY-MM-DD"
  });
}

const year = Number(dob.slice(0, 4));
const month = Number(dob.slice(5, 7));
const day = Number(dob.slice(8, 10));


if (isNaN(year) || isNaN(month) || isNaN(day)) {
  return res.status(400).json({
    message: "DOB MUST CONTAIN VALID NUMBERS"
  });
}


if (year < 1900 || year > new Date().getFullYear()) {
  return res.status(400).json({
    message: "INVALID YEAR IN DOB"
  });
}


if (month < 1 || month > 12) {
  return res.status(400).json({
    message: "INVALID MONTH IN DOB"
  });
}


if (day < 1 || day > 31) {
  return res.status(400).json({
    message: "INVALID DAY IN DOB"
  });
}


const today = new Date();
let age = today.getFullYear() - year;

if (
  today.getMonth() + 1 < month ||
  (today.getMonth() + 1 === month && today.getDate() < day)
) {
  age--;
}

if (age < 18) {
  return res.status(400).json({
    message: "AGE MUST BE 18 OR ABOVE"
  });
}





if (!income) {
  return res.status(400).json({
    message: "INCOME IS REQUIRED"
  });
}

if (isNaN(income)) {
  return res.status(400).json({
    message: "INCOME MUST BE NUMBERS ONLY"
  });
}

if (Number(income) < 10000) {
  return res.status(400).json({
    message: "MINIMUM INCOME MUST BE 10000"
  });
}

if (Number(income) > 100000) {
  return res.status(400).json({
    message: "INCOME VALUE TOO HIGH"
  });
}




if (!loan_amount) {
  return res.status(400).json({
    message: "LOAN AMOUNT IS REQUIRED"
  });
}

if (isNaN(loan_amount)) {
  return res.status(400).json({
    message: "LOAN AMOUNT MUST BE NUMBERS ONLY"
  });
}

if (Number(loan_amount) < 500) {
  return res.status(400).json({
    message: "MINIMUM LOAN AMOUNT MUST BE 1000"
  });
}

if (Number(loan_amount) > 5000) {
  return res.status(400).json({
    message: "LOAN AMOUNT TOO HIGH"
  });
}




if (Number(loan_amount) > Number(income) * 20) {
  return res.status(400).json({
    message: "LOAN AMOUNT TOO HIGH COMPARED TO INCOME"
  });
}




if (!employment_type) {
  return res.status(400).json({
    message: "EMPLOYMENT TYPE IS REQUIRED"
  });
}

// remove extra spaces
const jobType = employment_type.trim();

// minimum length
if (jobType.length < 3) {
  return res.status(400).json({
    message: "EMPLOYMENT TYPE IS TOO SHORT"
  });
}

// numbers not allowed
if (!isNaN(jobType)) {
  return res.status(400).json({
    message: "EMPLOYMENT TYPE CANNOT BE ONLY NUMBERS"
  });
}


if (
  jobType !== "Salaried" &&
  jobType !== "Self Employed" &&
  jobType !== "Business" &&
  jobType !== "Student" &&
  jobType !== "Freelancer" &&
  jobType !== "Government Job" &&
  jobType !== "Private Job"
) {
  return res.status(400).json({
    message: "INVALID EMPLOYMENT TYPE"
  });
}


if (!pincode) {
  return res.status(400).json({
    message: "PINCODE IS REQUIRED"
  });
}

if (isNaN(pincode)) {
  return res.status(400).json({
    message: "PINCODE MUST CONTAIN ONLY NUMBERS"
  });
}

if (pincode.length !== 6) {
  return res.status(400).json({
    message: "PINCODE MUST BE 6 DIGITS"
  });
}

if (pincode[0] === "0") {
  return res.status(400).json({
    message: "PINCODE CANNOT START WITH 0"
  });
}




if (!city) {
  return res.status(400).json({
    message: "CITY IS REQUIRED"
  });
}

const userCity = city.trim();

if (userCity.length < 2) {
  return res.status(400).json({
    message: "CITY NAME TOO SHORT"
  });
}

if (!isNaN(userCity)) {
  return res.status(400).json({
    message: "CITY CANNOT BE ONLY NUMBERS"
  });
}




if (!state) {
  return res.status(400).json({
    message: "STATE IS REQUIRED"
  });
}

const userState = state.trim();

if (userState.length < 2) {
  return res.status(400).json({
    message: "STATE NAME TOO SHORT"
  });
}

if (!isNaN(userState)) {
  return res.status(400).json({
    message: "STATE CANNOT BE ONLY NUMBERS"
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


const updateuser = async (req, res) => {
  try {
    const { pan, ...update } = req.body;


    if (!pan) {
      return res.status(400).json({
        message: "THE PAN IS REQUIRED"
      });
    }

   const updatedUser = await User.findOneAndUpdate(
  { pan: pan },
  update,
  { returnDocument: "after" }
);


    if (!updatedUser) {
      return res.status(404).json({
        message: "THE USER NOT FOUND"
      });
    }

    return res.status(200).json({
      message: "THE USER SUCCESSFULLY UPDATED",
      data: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error.message
    });
  }
};
const removeuser = async (req, res) => {
  try {
    const { pan } = req.body;


    if (!pan) {
      return res.status(400).json({
        message: "PAN IS REQUIRED"
      });
    }


    const deleteuser = await User.findOneAndDelete({ pan });


    if (!deleteuser) {
      return res.status(404).json({
        message: "USER NOT FOUND"
      });
    }


    return res.status(200).json({
      message: "USER DELETED SUCCESSFULLY",
      data: deleteuser
    });

  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error.message
    });
  }
};

module.exports = { createuser, updateuser, removeuser };