/*
  This file is only for understanding the logic.
  It is NOT connected to Express, MongoDB, or your API.

  Real idea:
  User fills a form.
  Backend checks that user against every company.
  If all company rules match, user is eligible for that company.
*/

const user = {
  income: 50000,
  loan_amount: 300000,
  employment_type: "Salaried",
  state: "Punjab"
};

const companies = [
  {
    company_name: "HDFC",
    min_income: 25000,
    max_loan: 500000,
    allowed_employment: ["Salaried", "Business"],
    serviceable_states: ["Punjab", "Delhi"]
  },
  {
    company_name: "ICICI",
    min_income: 60000,
    max_loan: 400000,
    allowed_employment: ["Salaried"],
    serviceable_states: ["Mumbai", "Delhi"]
  }
];

const normalizeText = (value) => {
  return String(value).trim().toLowerCase();
};

const checkCompanyEligibility = (user, company) => {
  const incomeCheck = user.income >= company.min_income;

  const loanAmountCheck = user.loan_amount <= company.max_loan;

  const employmentCheck = company.allowed_employment
    .map(normalizeText)
    .includes(normalizeText(user.employment_type));

  const stateCheck = company.serviceable_states
    .map(normalizeText)
    .includes(normalizeText(user.state));

  const isEligible =
    incomeCheck &&
    loanAmountCheck &&
    employmentCheck &&
    stateCheck;

  return {
    company_name: company.company_name,
    isEligible,
    checks: {
      incomeCheck,
      loanAmountCheck,
      employmentCheck,
      stateCheck
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

