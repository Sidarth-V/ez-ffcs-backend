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

const readDataController = require("./controllers/readData");
const timetableController = require("./controllers/makeTimetable");
const FeedbackController = require("./controllers/feedback");

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

app.get("/allTeachers", readDataController.allTeachers);
app.get("/allCourses", readDataController.allCourses);
app.get("/allTimetables", timetableController.allTimetables);
app.post("/setFeedback", FeedbackController.setFeedBack);
// app.get("/setFeedback", readDataController.setupFeedback);

app.listen(PORT, () => {
  console.log("🚀 Server Ready! at port:", PORT);
  console.log("Goto http://localhost:" + PORT);
});
