const { Router } = require("express");
const filesController = require("../controllers/filesController");
const validateFile = require("../middlewares/fileValidation");
const { NotFoundCRUD } = require("../errors/fileErrors");
const filesRouter = new Router();

filesRouter.post("/upload", validateFile, function (req, res) {
  filesController.uploadFile;
});
filesRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});
module.exports = filesRouter;
