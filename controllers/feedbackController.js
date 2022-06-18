const FeedbackModel = require("../models/feedbackModel");
const ClassModel = require("../models/classModel");
const { response } = require("../config/responseSchema");
const {
  updateFeedbackSchema,
  viewTeachersForCourseSchema,
} = require("../config/requestSchema");

const viewTeachers = async (req, res) => {
  try {
    const teachers = await FeedbackModel.find({});
    response(res, { teachers });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

const viewTeachersForCourse = async (req, res) => {
  try {
    const { courseCode } = await viewTeachersForCourseSchema.validateAsync(
      req.body
    );
    const teacherList = await FeedbackModel.find(
      { courseCode: courseCode },
      {
        empName: 1,
        _id: 0,
      }
    );
    const teachersList = teacherList.map((teacher) => {
      return {
        value: teacher.empName,
        label: teacher.empName,
      };
    });
    response(res, { teachers: teachersList });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { id, rating, feedback } = await updateFeedbackSchema.validateAsync(
      req.body
    );
    let updated = await FeedbackModel.findOneAndUpdate(
      { _id: id },
      { rating: rating, feedback: feedback },
      { new: true }
    );
    await ClassModel.updateMany(
      { courseCode: updated.courseCode, empId: updated.empId },
      { $set: { rating: rating } }
    );
    response(res, updated);
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

module.exports = { updateFeedback, viewTeachers, viewTeachersForCourse };
