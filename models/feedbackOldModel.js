const mongoose = require("mongoose");

const feedbackOldSchema = mongoose.Schema({
  empId: {
    type: String,
  },
  empName: {
    type: String,
  },
  courseCode: {
    type: String,
  },
  rating: {
    type: Number,
  },
  feedback: {
    type: String,
  },
});

const feedbackOld = mongoose.model("feedbackOld", feedbackOldSchema);

module.exports = feedbackOld;
