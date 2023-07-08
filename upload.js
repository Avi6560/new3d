const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // specify the destination folder for the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // specify a unique filename for the uploaded files
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
