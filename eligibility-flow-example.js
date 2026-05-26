/*
  This file is only for understanding the logic.
  It is NOT connected to Express, MongoDB, or your API.

  Real idea:
  User fills a form.
  Backend checks that user against every company.
  If all company rules match, user is eligible for that company.
*/

const user = {
  dob: "2000-05-20",
  income: 50000,
  loan_amount: 300000,
  employment_type: "Salaried"
};

const companies = [
  {
    company_name: "HDFC",
    min_age: 21,
    max_age: 60,
    min_income: 25000,
    max_loan: 500000,
    allowed_employment: ["Salaried", "Business"]
  },
  {
    company_name: "ICICI",
    min_age: 30,
    max_age: 55,
    min_income: 60000,
    max_loan: 400000,
    allowed_employment: ["Salaried"]
  }
];

const normalizeText = (value) => {
  return String(value).trim().toLowerCase();
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
};

const checkCompanyEligibility = (user, company) => {
  const userAge = calculateAge(user.dob);

  const ageCheck =
    userAge >= company.min_age &&
    userAge <= company.max_age;

  const incomeCheck = user.income >= company.min_income;

  const loanAmountCheck = user.loan_amount <= company.max_loan;

  const employmentCheck = company.allowed_employment
    .map(normalizeText)
    .includes(normalizeText(user.employment_type));

  const isEligible =
    ageCheck &&
    incomeCheck &&
    loanAmountCheck &&
    employmentCheck;

  return {
    company_name: company.company_name,
    isEligible,
    checks: {
      userAge,
      ageCheck,
      incomeCheck,
      loanAmountCheck,
      employmentCheck
    }
  };
};

const comparisonResult = companies.map((company) => {
  return checkCompanyEligibility(user, company);
});

const eligibleCompanies = comparisonResult.filter((result) => {
  return result.isEligible;
});

console.log("User Details:");
console.log(user);

console.log("\nCompany Wise Comparison:");
console.log(comparisonResult);

console.log("\nFinal Eligible Companies:");
console.log(eligibleCompanies);
