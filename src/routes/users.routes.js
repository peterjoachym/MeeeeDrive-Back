const usersRouter = require("express").Router();
const { usersControllers, globalControllers,folderControllers,fileControllers} = require("../controllers");

usersRouter.get("/", usersControllers.getMany);

usersRouter.get("/:id", globalControllers.verifyInputId, usersControllers.verifyIfIdExist, usersControllers.getOneById);

usersRouter.get("/:id/folders", folderControllers.getFoldersByUserId);
usersRouter.get("/:id/files", fileControllers.getFilesByUserId);



// usersRouter.get("/:id/avatars", globalController.verifyInputId, userController.verifyIfIdExist, pictureController.getAvatarByUserId);

usersRouter.post(
  "/",
  globalControllers.validateInputData,
  usersControllers.verifyIfEmailAvailable,
  usersControllers.createNewUser,
  usersControllers.sendActivationEmail,
  usersControllers.getOneById,
);

usersRouter.post("/reset-password", usersControllers.verifyEmailUser, usersControllers.sendResetPasswordEmail);

usersRouter.put(
  "/:id",
  globalControllers.verifyInputId,
  usersControllers.verifyIfIdExist,
  globalControllers.validateUpdateInputData,
  usersControllers.updateOneById,
);

usersRouter.delete(
  "/:id",
  globalControllers.verifyInputId,
  usersControllers.verifyIfIdExist,
  // pictureController.deleteUserAvatarFile,
  usersControllers.deleteOneById,
);

module.exports = usersRouter;
