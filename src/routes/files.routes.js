const filesRouter = require("express").Router();
const { fileControllers } = require("../controllers");

filesRouter.get("/:id", fileControllers.getOneFileById);
filesRouter.post("/", fileControllers.createFile);
filesRouter.put("/:id", fileControllers.updateOneById);
filesRouter.delete("/:id", fileControllers.deleteOneById);

module.exports = filesRouter;
