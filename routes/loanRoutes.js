const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

// Loan Application Submission
router.post("/apply", loanController.applyForLoan);

// Get Loan Application Status
router.get("/status/:email", loanController.getLoanStatus);

// Approve Loan
router.put("/approve/:email", loanController.approveLoan);

// Disburse Loan
router.put("/disburse/:email", loanController.disburseLoan);

module.exports = router;
