const mainRouter = require("express").Router();
const usersRouter = require("./users.routes");
// const authRouter = require("./auth.routes");
// const foldersRouter = require("./folders.routes");
// const filesRouter = require("./filess.routes");

mainRouter.use("/users", usersRouter);
// mainRouter.use("/auth", authRouter);
// mainRouter.use("/folders", foldersRouter);
// mainRouter.use("/files", filesRouter);

module.exports = mainRouter;
