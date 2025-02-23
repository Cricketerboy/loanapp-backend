const LoanApplication = require("../models/loanApplicationModel");

// Loan Application Submission
exports.applyForLoan = async (req, res) => {
  try {
    const { applicantName, email, phone, loanAmount, creditScore, income } = req.body;

    if (!applicantName || !email || !phone || !loanAmount || !creditScore || !income) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newApplication = new LoanApplication({
      applicantName,
      email,
      phone,
      loanAmount,
      creditScore,
      income,
    });

    await newApplication.save();
    res.status(201).json({ message: "Loan application submitted.", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get Loan Application Status
exports.getLoanStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const application = await LoanApplication.findOne({ email });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ status: application.status, application });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Loan Approval Logic
exports.approveLoan = async (req, res) => {
  try {
    const { email } = req.params;
    const application = await LoanApplication.findOne({ email });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Basic Eligibility Criteria
    if (application.creditScore < 650 || application.income < application.loanAmount * 0.3) {
      application.status = "Rejected";
      await application.save();
      return res.status(400).json({ message: "Loan application rejected.", application });
    }

    application.status = "Approved";
    await application.save();
    res.status(200).json({ message: "Loan approved!", application });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Disbursement of Loan
exports.disburseLoan = async (req, res) => {
  try {
    const { email } = req.params;
    const application = await LoanApplication.findOne({ email });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.status !== "Approved") {
      return res.status(400).json({ message: "Loan is not yet approved." });
    }

    application.status = "Disbursed";
    await application.save();
    res.status(200).json({ message: "Loan has been disbursed.", application });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
