const multer = require("multer");

// Configure multer to store the file in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes =
    /text\/plain|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Error: File type not supported!");
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter,
}).single("file"); // 'file' should match the name attribute in your form

const validateFile = (req, res, next) => {
  console.log("Validating file");
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read file content
    const fileContent = req.file.buffer.toString("utf-8");
    console.log(fileContent);
    const patientIdPattern = /\b\d{9}\b/; // Pattern to match a 9-digit number

    if (patientIdPattern.test(fileContent)) {
      console.log("Patient ID found");
      next();
    } else {
      res.status(400).json({
        message: "Invalid file: Patient ID not found or incorrect format",
      });
    }
  });
};

module.exports = validateFile;
