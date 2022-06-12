const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
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

const feedback = mongoose.model("feedback", feedbackSchema);

module.exports = feedback;
