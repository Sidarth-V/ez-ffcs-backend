const ClassModel = require("../models/classModel");
const { createTimeTableSchema } = require("../config/requestSchema");
const { response } = require("../config/responseSchema");
const TimetableModel = require("../models/timetableModel");

const allTimetables = async (req, res) => {
  try {
    let slotsData = {
      A1: ["m1", "w2"],
      L1: ["m1"],
      F1: ["m2", "w3"],
      L2: ["m2"],
      D1: ["m3", "th1"],
      L3: ["m3"],
      TB1: ["m4"],
      L4: ["m4"],
      TG1: ["m5"],
      L5: ["m4", "m5"],
      L6: ["m7"],
      A2: ["m7", "w8"],
      L31: ["m7"],
      F2: ["m8", "w9"],
      L32: ["m8"],
      D2: ["m9", "th7"],
      L33: ["m9"],
      TB2: ["m10"],
      L34: ["m10"],
      TG2: ["m11"],
      L35: ["m10","m11"],
      L36: ["m12"],
      V3: ["m12","m13"],
      B1: ["tu1", "th2"],
      L7: ["tu1"],
      G1: ["tu2", "th3"],
      L8: ["tu2"],
      E1: ["tu3", "f1"],
      L9: ["tu3"],
      TC1: ["tu4"],
      L10: ["tu4"],
      TAA1: ["tu5"],
      L11: ["tu4","tu5"],
      L12: ["tu6"],
      B2: ["tu7", "th8"],
      L37: ["tu7"],
      G2: ["tu8", "th9"],
      L38: ["tu8"],
      E2: ["tu9", "f7"],
      L39: ["tu9"],
      TC2: ["tu10"],
      L40: ["tu10"],
      TAA2: ["tu11"],
      L41: ["tu10","tu11"],
      L42: ["tu12"],
      V4: ["tu12","tu13"],
      C1: ["w1", "f2"],
      L13: ["w1"],
      L14: ["w2"],
      L15: ["w3"],
      V1: ["w4"],
      L16: ["w4"],
      V2: ["w5"],
      L17: ["w4","w5"],
      L18: ["w6"],
      C2: ["w7", "f8"],
      L43: ["w7"],
      L44: ["w8"],
      L45: ["w9"],
      TD2: ["w10"],
      L46: ["w10"],
      TBB2: ["w11"],
      L47: ["w10", "w11"],
      L48: ["w12"],
      V5: ["w12","w13"],
      L19: ["th1"],
      L20: ["th2"],
      L21: ["th3"],
      TE1: ["th4"],
      L22: ["th4"],
      TCC1: ["th5"],
      L23: ["th4","th5"],
      L24: ["th6"],
      L49: ["th7"],
      L50: ["th8"],
      L51: ["th9"],
      TE2: ["th10"],
      L52: ["th10"],
      TCC2: ["th11"],
      L53: ["th10","th11"],
      L54: ["th12"],
      V6: ["th12","th13"],
      L25: ["f1"],
      L26: ["f2"],
      TA1: ["f3"],
      L27: ["f3"],
      TF1: ["f4"],
      L28: ["f4"],
      TD1: ["f5"],
      L29: ["f4","f5"],
      L30: ["f6"],
      L55: ["f7"],
      L56: ["f8"],
      TA2: ["f9"],
      L57: ["f9"],
      TF2: ["f10"],
      L58: ["f10"],
      TDD2: ["f10", "f11"],
      L59: ["f11"],
      L60: ["f12"],
      V7: ["f12","f13"],
    };
    const { courses } = await createTimeTableSchema.validateAsync(req.body);
    if (courses.length >= 1) {
      let allClasses = [];
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].teacher) {
          if(courses[i].slot) {
            const classesForCourse = await ClassModel.find({
              courseCode: courses[i].courseCode,
              empName: courses[i].teacher,
              theorySlot: courses[i].slot
            });
            allClasses.push(classesForCourse);
          }
          else {
            const classesForCourse = await ClassModel.find({
              courseCode: courses[i].courseCode,
              empName: courses[i].teacher,
            });
            allClasses.push(classesForCourse);
          }
        } else {
          const classesForCourse = await ClassModel.find({
            courseCode: courses[i].courseCode,
            rating: { $gte: 3 },
          });
          allClasses.push(classesForCourse);
        }
      }

      let allConfigs = [];
      allClasses[0].forEach((element) => {
        allConfigs.push([element]);
      });

      let allConfigsOfCurrentSize = [];

      for (let j = 1; j < allClasses.length; j++) {
        allConfigsOfCurrentSize = [];
        for (let i = 0; i < allConfigs.length; i++) {
          allClasses[j].forEach((element) => {
            let tempConfig = [...allConfigs[i]];
            tempConfig.push(element);
            allConfigsOfCurrentSize.push(tempConfig);
            tempConfig = [];
          });
        }
        allConfigs = allConfigsOfCurrentSize;
      }
      let clashesRemoved = allConfigs.filter((config) => {
        if (config.length !== courses.length) return false;
        let slotsTaken = config.flatMap((item) => {
          theorySplit = item.theorySlot
            .split("+")
            .flatMap((slot) => slotsData[slot]);
          if (item.labSlot) {
            labSplit = item.labSlot
              .split("+")
              .flatMap((slot) => slotsData[slot]);
            return theorySplit.concat(labSplit);
          } else {
            return theorySplit;
          }
        });
        return new Set(slotsTaken).size === slotsTaken.length;
      });
      // res.send(
      //   clashesRemoved.length +
      //     " with no clashes vs. " +
      //     allConfigs.length +
      //     " all possible(includes clashing timetables) for " +
      //     courses.length +
      //     " courses"
      // );
      response(res, { timetables: clashesRemoved });
    } else {
      response(res, { timetables: [] });
    }
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

const saveTimetable = async (req, res) => {
  try {
    const timetableExists = await TimetableModel.findOne({
      timeTable: req.body.timeTable,
    });
    const nameExist = await TimetableModel.findOne({
      name: req.body.timeTableName,
    });
    if (timetableExists) {
      throw new Error("timetable already exists");
    }
    if (nameExist) {
      throw new Error("name already in use");
    }
    await new TimetableModel({
      timeTable: req.body.timeTable,
      name: req.body.timeTableName,
    }).save();
    response(res, { message: "saved" });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
};

const viewSaved = async (req, res) => {
  try {
    const allSaved = await TimetableModel.find({});
    response(res, { timeTables: allSaved });
  } catch (error) {
    response(res, {}, 400, err.message, false);
  }
};

const slotsForTeacher = async (req, res) => {
  try {
    const { courseCode, empName } = req.body;
    const slotsForEmp = await ClassModel.find({
      courseCode: courseCode,
      empName: empName
    }).distinct("theorySlot");
    console.log(slotsForEmp);
    response(res, { slots: slotsForEmp });
  } catch (err) {
    response(res, {}, 400, err.message, false);
  }
}
module.exports = { allTimetables, saveTimetable, viewSaved, slotsForTeacher };
