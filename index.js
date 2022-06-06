require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const DB_URL = process.env.DB_URI;
const PORT = process.env.PORT || 8000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log("🚀 Server Ready! at port:", PORT);
  console.log("Goto http://localhost:" + PORT);
});
