const authRouter = require("express").Router();
const { usersControllers, authControllers, globalControllers } = require("../controllers");

authRouter.post("/login", authControllers.login, authControllers.createAccessAndRefreshToken);
authRouter.post("/refresh_token", authControllers.verifyRefreshToken, usersControllers.getOneById, authControllers.createAccessToken);
authRouter.post("/logout", authControllers.verifyAccessToken, authControllers.deleteRefreshToken);

authRouter.post(
  "/activate/:token",
  authControllers.verifyActivationToken,
  globalControllers.validateInputPassword,
  usersControllers.createNewPassword,
  usersControllers.getOneById,
);
authRouter.post(
  "/new-password/:token",
  authControllers.verifyResetToken,
  globalControllers.validateInputPassword,
  usersControllers.createNewPassword,
  usersControllers.getOneById,
);

module.exports = authRouter;
