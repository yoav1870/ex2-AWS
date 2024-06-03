const { Router } = require("express");
const filesController = require("../controllers/filesController");
const validateFile = require("../middlewares/fileValidation");
const filesRouter = new Router();

filesRouter.post("/", validateFile, filesController.uploadFile);

module.exports = filesRouter;
