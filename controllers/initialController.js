const InitialModel = require("../models/initialModel");
const FeedbackModel = require("../models/feedbackModel");
const ClassModel = require("../models/classModel");
const CourseModel = require("../models/coursesModel");
const data = require("../data.json");
const { response } = require("../config/responseSchema");

const createClasses = async (req, res) => {
  try {
    const courses = await InitialModel.distinct("courseCode");
    let uniqTeachers = [];

    for (let i = 0; i < courses.length; i++) {
      let courseCode = courses[i];
      let teacherForCourse = await InitialModel.find({
        courseCode,
      }).distinct("empId");
      uniqTeachers.push({ courseCode: courseCode, teachers: teacherForCourse });
    }

    for (let i = 0; i < uniqTeachers.length; i++) {
      let courseCode = uniqTeachers[i].courseCode;
      for (let j = 0; j < uniqTeachers[i].teachers.length; j++) {
        let empId = uniqTeachers[i].teachers[j];
        let theoryClassesForTeacher = await InitialModel.find(
          {
            $or: [
              {
                courseCode: courseCode,
                empId: empId,
                courseType: "ETH",
              },
              {
                courseCode: courseCode,
                empId: empId,
                courseType: "TH",
              },
              {
                courseCode: courseCode,
                empId: empId,
                courseType: "SS",
              },
            ],
          },
          {
            courseType: 0,
            empId: 0,
            courseCode: 0,
            _id: 0,
          }
        );
        let labClassesForTeacher = await InitialModel.find(
          {
            $or: [
              {
                courseCode: courseCode,
                empId: empId,
                courseType: "LO",
              },
              {
                courseCode: courseCode,
                empId: empId,
                courseType: "ELA",
              },
            ],
          },
          {
            courseCode: 0,
            empId: 0,
            courseType: 0,
            _id: 0,
          }
        );

        theoryClassesForTeacher.forEach((theoryClass) => {
          if (labClassesForTeacher.length > 0) {
            labClassesForTeacher.forEach((labClass) => {
              new ClassModel({
                courseCode,
                courseTitle: theoryClass.courseTitle,
                empId,
                empName: theoryClass.empName,
                theorySlot: theoryClass.slot,
                theoryVenue: theoryClass.roomNumber,
                labSlot: labClass.slot,
                labVenue: labClass.roomNumber,
              }).save();
            });
          } else {
            new ClassModel({
              courseCode,
              courseTitle: theoryClass.courseTitle,
              empId,
              empName: theoryClass.empName,
              theorySlot: theoryClass.slot,
              theoryVenue: theoryClass.roomNumber,
              labSlot: null,
              labVenue: null,
            }).save();
          }
        });
      }
    }
    response(res, { message: "classes created" });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

const createFeedback = async (req, res) => {
  try {
    for (let i = 0; i < data.length; i++) {
      const feedbackExists = await FeedbackModel.findOne({
        courseCode: data[i].courseCode,
        empId: data[i].empId,
      });
      if (!feedbackExists) {
        await new FeedbackModel({
          courseCode: data[i].courseCode,
          empId: data[i].empId,
          empName: data[i].empName,
          rating: 1,
          feedback: "placeholder text",
        }).save();
      }
    }

    response(res, { message: "feedback created" });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

const createCourses = async (req, res) => {
  try {
    for (let i = 0; i < data.length; i++) {
      const courseExists = await CourseModel.findOne({
        courseCode: data[i].courseCode,
      });
      if (!courseExists) {
        await new CourseModel({
          courseCode: data[i].courseCode,
          courseTitle: data[i].courseTitle,
          creditCount: 0,
          hasLab: false,
          hasProject: false,
        }).save();
      }
    }

    response(res, { message: "courses created" });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

module.exports = { createClasses, createFeedback, createCourses };
