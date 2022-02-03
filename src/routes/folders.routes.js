const foldersRouter = require("express").Router();
const { folderControllers,fileControllers } = require("../controllers");

foldersRouter.get("/:id", folderControllers.getOneFolderById);
foldersRouter.get("/:id/files", fileControllers.getFilesByFolderId);
foldersRouter.post("/", folderControllers.createFolder);
foldersRouter.put("/:id", folderControllers.updateOneById);
foldersRouter.delete("/:id", folderControllers.deleteOneById)


module.exports = foldersRouter;
