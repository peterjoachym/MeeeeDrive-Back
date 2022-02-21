const filesRouter = require("express").Router();
const { fileControllers } = require("../controllers");

filesRouter.get("/:id", fileControllers.getOneFileById);
filesRouter.post(
  "/",
  fileControllers.uploadDocumentFile,
  fileControllers.createFile,
  fileControllers.getOneFileById
);

filesRouter.put("/:id", fileControllers.updateOneById);

filesRouter.delete(
  "/:id",
  fileControllers.deleteDocumentFile,
  fileControllers.deleteOneById
);

module.exports = filesRouter;
