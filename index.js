const express = require('express')
const cors = require("cors");
const path = require("path");
const db = require("./model/db.js");
const dotenv = require("dotenv");
const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();
// { path: "./config/config.env" }
console.log(process.env.AZURE_COSMOSDB_URL);

const solution = require("./routes/solutionRouter.js");
const discussion = require("./routes/discussionRouter.js");

// testing purpose.
app.use("/test", (req, res) => {
  console.log(req);
  res.send("Hello World!!! Testing success");
});
app.use("/", (req, res) => {
  console.log(req);
  res.send("Hello World!");
});

//routers.
app.use("/api/v1/account", require("./routes/personRouter"));
app.use("/api/v1/assignment", require("./routes/assignmentRouter"));

app.use("/api/v1/classroom", require("./routes/classroomRouter"));
app.use("/api/v1/mail", require("./routes/mailRouter"));

app.use("/api/v1/solution", solution);
app.use("/api/v1/discussion", discussion);

app.use("/api/v1/auth",require("./routes/authRouter"))

const PORT = process.env.PORT || 5000;

const dBConnectionString = process.env.AZURE_COSMOSDB_URL || "";
// console.log(dBConnectionString)
db.connect(dBConnectionString)
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  );

// app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
