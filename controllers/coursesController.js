const CourseModel = require("../models/coursesModel");
const { response } = require("../config/responseSchema");

const viewCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    response(res, { courses });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

module.exports = { viewCourses };
