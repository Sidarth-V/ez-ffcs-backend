const FeedbackModel = require("../models/feedbackModel");
const ClassModel = require("../models/classModel");
const { update } = require("../models/classModel");

const setFeedBack = async (req, res) => {
  let updated = await FeedbackModel.findOneAndUpdate(
    { _id: req.body.id },
    { rating: req.body.rating, feedback: req.body.feedback },
    { new: true }
  );
  console.log(updated);
  await ClassModel.updateMany(
    { courseCode: updated.courseCode, empId: updated.empId },
    { $set: { rating: req.body.rating } }
  );
  res.send(updated);
};

module.exports = { setFeedBack };
