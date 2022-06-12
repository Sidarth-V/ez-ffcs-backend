const Initial = require("../models/initialModel");
const ClassModel = require("../models/classModel");
const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://admin:moJxaj-zexsa9-pamtuv@cautiousparakeet.ku64k.mongodb.net/ffcs?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Database Connected!");
  })
  .catch((err) => {
    console.log("DB connect error:", err);
  });

const populateClasses = async () => {
  const courses = await Initial.distinct("courseCode");
  let uniqTeachers = [];

  for (let i = 0; i < courses.length; i++) {
    let courseCode = courses[i];
    let teacherForCourse = await Initial.find({
      courseCode,
    }).distinct("empId");
    uniqTeachers.push({ courseCode: courseCode, teachers: teacherForCourse });
  }

  for (let i = 0; i < uniqTeachers.length; i++) {
    let courseCode = uniqTeachers[i].courseCode;
    for (let j = 0; j < uniqTeachers[i].teachers.length; j++) {
      let empId = uniqTeachers[i].teachers[j];
      let theoryClassesForTeacher = await Initial.find(
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
      let labClassesForTeacher = await Initial.find(
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
};

populateClasses();
