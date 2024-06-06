const multer = require("multer");
const { filesController } = require("../controllers/filesController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
}).single("file");

const validateFile = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      await filesController.uploadBadFile(req, res);
      return;
    }
    if (!req.file) {
      await filesController.uploadBadFile(req, res);
      return;
    }
    if (req.file.mimetype !== "text/plain") {
      await filesController.uploadBadFile(req, res);
      return;
    }
    const patientIdPattern = /\b\d{9}\b/;
    if (patientIdPattern.test(req.file.buffer.toString("utf-8"))) {
      next();
    } else {
      await filesController.uploadBadFile(req, res);
    }
  });
};

module.exports = validateFile;
