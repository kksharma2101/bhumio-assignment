require("dotenv").config();
const { configDotenv } = require("dotenv");
const express = require("express");
const multer = require("multer");
const path = require("path");
// const { config } = require("process");
var { createWorker } = require("tesseract.js");

const app = express();

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname + "/uploads")));

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, res.fieldname + "-" + Date.now() + path.extname(res.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index", { data: "" });
});

app.post("/imagetotext", upload.single("file"), (req, res) => {
  (async () => {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(req.file.path);
    // console.log(ret.data.text);
    res.render("index", { data: ret.data.text });
    await worker.terminate();
  })();
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
