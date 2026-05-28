const redirectToCompanyCompare = (req, res) => {
    return res.redirect(307, "/api/company/compare-live");
};

const redirectToCompany = (req, res) => {
    return res.redirect(307, `/api/company/${req.params.id}`);
};

module.exports = {
    compareLoans: redirectToCompany,
    compareLiveLoans: redirectToCompanyCompare
};
