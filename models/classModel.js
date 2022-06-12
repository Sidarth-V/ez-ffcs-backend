const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  courseCode: {
    type: String,
  },
  courseTitle: {
    type: String,
  },
  empId: {
    type: String,
  },
  empName: {
    type: String,
  },
  theorySlot: {
    type: String,
  },
  theoryVenue: {
    type: String,
  },
  labSlot: {
    type: String,
  },
  labVenue: {
    type: String,
  },
  rating: {
    type: Number,
  },
});

const classes = mongoose.model("class", classSchema);

module.exports = classes;
