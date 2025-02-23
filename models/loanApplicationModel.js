const mongoose = require("mongoose");

const LoanApplicationSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Submitted", "Under Review", "Approved", "Rejected", "Disbursed"],
    default: "Submitted",
  },
  creditScore: { type: Number, required: true }, // Used for eligibility
  income: { type: Number, required: true }, // Used for eligibility
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoanApplication", LoanApplicationSchema);
