const ClassModel = require("../models/classModel");
const Initial = require("../models/initialModel");
const Feedback = require("../models/feedbackModel");
const data = require("../data.json");
const res = require("express/lib/response");

const allTeachers = async (req, res) => {
  const teachers = await Feedback.find({});
  res.send(teachers);
};

const setupFeedback = async (req, res) => {
  for (let i = 0; i < data.length; i++) {
    const feedbackExists = await Feedback.findOne({
      courseCode: data[i].courseCode,
      empId: data[i].empId,
    });
    if (!feedbackExists) {
      console.log(feedbackExists);
      await new Feedback({
        courseCode: data[i].courseCode,
        empId: data[i].empId,
        empName: data[i].empName,
        rating: 0,
        feedback: "nothing to see here",
      }).save();
    }
  }

  const allFeedback = await Feedback.find({});
  res.send(allFeedback);
};

const allCourses = async (req, res) => {
  const courseList = await ClassModel.distinct("courseCode");
  let courses = [];
  courseList.forEach((course) => {
    courses.push({
      value: course,
      label: course,
    });
  });
  res.send(courses);
};

module.exports = { allTeachers, setupFeedback, allCourses };
