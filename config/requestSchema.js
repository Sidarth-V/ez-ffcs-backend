const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
exports.updateFeedbackSchema = Joi.object({
  id: Joi.objectId().required(),
  rating: Joi.number().min(1).max(5).required(),
  feedback: Joi.string().required(),
});
exports.viewTeachersForCourseSchema = Joi.object({
  courseCode: Joi.string()
    .regex(/^([a-zA-Z]{3}[0-9]{4})$/)
    .required(),
});
exports.createTimeTableSchema = Joi.object({
  courses: Joi.array()
    .items(
      Joi.object({
        courseCode: Joi.string()
          .regex(/^([a-zA-Z]{3}[0-9]{4})$/)
          .required(),
        teacher: Joi.string().allow(""),
      })
    )
    .required(),
});
