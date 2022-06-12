const mongoose = require("mongoose");

const initialSchema = mongoose.Schema({
  courseCode: {
    type: String,
  },
  courseTitle: {
    type: String,
  },
  courseType: {
    type: String,
  },
  classId: {
    type: String,
  },
  roomNumber: {
    type: String,
  },
  slot: {
    type: String,
  },
  empId: {
    type: String,
  },
  empName: {
    type: String,
  },
});

const Initial = mongoose.model("ffcs-data", initialSchema);

module.exports = Initial;
