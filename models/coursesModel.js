const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  courseCode: {
    type: String,
  },
  courseTitle: {
    type: String,
  },
  creditCount: {
    type: Number,
  },
  hasLab: {
    type: Boolean,
  },
  hasProject: {
    type: Boolean,
  },
});

const course = mongoose.model("course", courseSchema);

module.exports = course;
