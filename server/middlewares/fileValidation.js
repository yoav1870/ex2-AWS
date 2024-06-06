const multer = require("multer");
const mammoth = require("mammoth");
const { filesController } = require("../controllers/filesController");

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
  upload(req, res, async (err) => {
    if (err) {
      console.log("Error in upload:", err);
      await filesController.uploadBadFile(req, res);
      return;
    }
    if (!req.file) {
      console.log("No file uploaded");
      await filesController.uploadBadFile(req, res);
      return;
    }

    const patientIdPattern = /\b\d{9}\b/;

    if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Use mammoth to extract text from .docx file
      mammoth
        .extractRawText({ buffer: req.file.buffer })
        .then(async (result) => {
          const fileContent = result.value;
          console.log("Extracted text content:", fileContent); // Log the extracted text content

          if (patientIdPattern.test(fileContent)) {
            console.log("Patient ID found");
            next();
          } else {
            console.log(
              "Invalid file: Patient ID not found or incorrect format"
            ); // Log the error
            await filesController.uploadBadFile(req, res);
          }
        })
        .catch(async (error) => {
          console.log("Error extracting text from .docx file:", error);
          await filesController.uploadBadFile(req, res);
        });
    } else {
      // Read plain text file content
      const fileContent = req.file.buffer.toString("utf-8");
      console.log("File content:", fileContent); // Log the file content

      if (patientIdPattern.test(fileContent)) {
        console.log("Patient ID found");
        next();
      } else {
        console.log("Invalid file: Patient ID not found or incorrect format"); // Log the error
        await filesController.uploadBadFile(req, res);
      }
    }
  });
};

module.exports = validateFile;
