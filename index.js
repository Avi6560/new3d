const express = require("express");
const app = express();
const route = require("./routes/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json())
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://Avi9984:JM6hnTiQIRViVdA3@cluster0.qfc4n.mongodb.net/dewood3D",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.get("/image/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = __dirname + "/uploads/" + fileName;
  res.sendFile(filePath);
});
app.use("/", route);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
