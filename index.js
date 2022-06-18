require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const DB_URL = process.env.DB_URI;
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const FeedbackController = require("./controllers/feedbackController");
const TimetableController = require("./controllers/timetableController");
const CoursesControllers = require("./controllers/coursesController");

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Database Connected!");
  })
  .catch((err) => {
    console.log("DB connect error:", err);
  });

app.get("/", (req, res) => {
  res.send("The server is running!");
});

/*
Use the routes inside this block to populate the db in the beginning. Do not use this in production.

const InitialController = require("./controllers/initialController");
app.get("/createClasses", InitialController.createClasses);
app.get("/createFeedback", InitialController.createFeedback);
app.get("/createCourses", InitialController.createCourses);
*/

app.get("/view-teachers", FeedbackController.viewTeachers);
app.post("/view-teachers", FeedbackController.viewTeachersForCourse);
app.post("/update-feedback", FeedbackController.updateFeedback);

app.get("/view-courses", CoursesControllers.viewCourses);

app.post("/all-timetables", TimetableController.allTimetables);

app.listen(PORT, () => {
  console.log("🚀 Server Ready! at port:", PORT);
  console.log("Goto http://localhost:" + PORT);
});
