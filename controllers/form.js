const User = require("../model/userdata");
const jwt = require("jsonwebtoken");

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

    // Required details check
    if (
      !name || !phone || !email || !pan || !dob ||
      !income || !loan_amount || !employment_type ||
      !pincode || !city || !state
    ) {
      return res.status(400).json({
        message: "PLEASE ENTER ALL THE DETAILS"
      });
    }

    // Phone validations
    if (phone.length !== 10) {
      return res.status(400).json({
        message: "PHONE NUMBER MUST BE 10 DIGITS"
      });
    }

    if (isNaN(phone)) {
      return res.status(400).json({
        message: "PHONE NUMBER MUST CONTAIN NUMBERS ONLY"
      });
    }

    // Email validations
    if (!email.includes("@gmail") || !email.includes(".com")) {
      return res.status(400).json({
        message: "PLEASE ENTER A VALID GMAIL ADDRESS"
      });
    }

    // PAN validations
    if (pan.length !== 10) {
      return res.status(400).json({
        message: "PAN CARD MUST BE 10 CHARACTERS"
      });
    }

    for (let i = 0; i < 5; i++) {
      if (pan[i] < "A" || pan[i] > "Z") {
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

    // DOB validations
    if (dob.length !== 10 || dob[4] !== "-" || dob[7] !== "-") {
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

    // Age tracking calculation
    const today = new Date();
    let age = today.getFullYear() - year;

    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
      age--;
    }

    if (age < 18) { // Changed message to match typical 18+ limit context
      return res.status(400).json({
        message: "AGE MUST BE 18 OR ABOVE"
      });
    }

    // Financial validations
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

    if (isNaN(loan_amount)) {
      return res.status(400).json({
        message: "LOAN AMOUNT MUST BE NUMBERS ONLY"
      });
    }

    if (Number(loan_amount) < 500) {
      return res.status(400).json({
        message: "MINIMUM LOAN AMOUNT MUST BE 500"
      });
    }

    if (Number(loan_amount) > 1000000) {
      return res.status(400).json({
        message: "LOAN AMOUNT TOO HIGH"
      });
    }

    if (Number(loan_amount) > Number(income) * 20) {
      return res.status(400).json({
        message: "LOAN AMOUNT TOO HIGH COMPARED TO INCOME"
      });
    }

    // Employment validations
    const jobType = employment_type.trim();

    if (jobType.length < 3) {
      return res.status(400).json({
        message: "EMPLOYMENT TYPE IS TOO SHORT"
      });
    }

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
      jobType !== "Private Job" &&
      jobType !== "other"
    ) {
      return res.status(400).json({
        message: "INVALID EMPLOYMENT TYPE"
      });
    }

    // Geography validations
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

    const userCity = city.trim();
    if (userCity.length < 2 || !isNaN(userCity)) {
      return res.status(400).json({
        message: "INVALID CITY NAME"
      });
    }

    const userState = state.trim();
    if (userState.length < 2 || !isNaN(userState)) {
      return res.status(400).json({
        message: "INVALID STATE NAME"
      });
    }

    // ────────────────────────────────────────────────────────
    // SMART UPSERT FEATURE (FIXED FOR SINGLE FORM SUBMISSION)
    // ────────────────────────────────────────────────────────
    // If a user with this phone or PAN exists, update them. If not, create them.
    const userData = {
      name,
      phone,
      email,
      pan,
      dob,
      age, // saving computed age directly
      income: Number(income),
      loan_amount: Number(loan_amount),
      employment_type: jobType,
      pincode,
      city: userCity,
      state: userState
    };

    const savedUser = await User.findOneAndUpdate(
      { $or: [{ phone }, { pan }] },
      userData,
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT SECRET IS NOT CONFIGURED"
      });
    }

    const token = jwt.sign(
      { userId: savedUser._id, phone: savedUser.phone },
      process.env.JWT_SECRET,
    );

    return res.status(201).json({
      message: "USER PROFILE SYNCHRONIZED SUCCESSFULLY",
      token,
      data: savedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error.message
    });
  }
};

const getusers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      total: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error.message
    });
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
      { returnDocument: "after", runValidators: true }
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
module.exports = { createuser, getusers, updateuser, removeuser };
