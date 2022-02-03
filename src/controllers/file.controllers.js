const { File } = require("../models");

const getFilesByUserId = async (req, res) => {
  const { id } = req.params;
  const user_id = id;

  try {
    const [results] = await File.findManyByUserId(user_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getFilesByFolderId = async (req, res) => {
  const { id } = req.params;
  const folder_id = id;

  try {
    const [results] = await File.findManyByFolderId(folder_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneFileById = async (req, res) => {
  const { id } = req.id ? req : req.params;
  const statusCode = req.id ? 201 : 200;
  try {
    const [results] = await File.findOneById(id);
    res.status(statusCode).json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createFile = async (req, res, next) => {
  const { file_name, file_display_name, folder_id, user_id } = req.body;
  try {
    await Folder.createOneFolder({
      file_name,
      file_display_name,
      folder_id,
      user_id,
    });
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateOneById = async (req, res) => {
  const { file_name, file_display_name, folder_id, user_id } = req.body;
  const { id } = req.params;

  if (!file_name && !file_display_name && !folder_id && !user_id) {
    res.status(400).send("You need to give all mandatory datas!");
  } else {
    const file = {};
    if (file_name) {
      user.file_name = file_name;
    }
    if (file_display_name) {
        user.file_display_name = file_name;
      }
    if (folder_id) {
      user.folder_id = folder_id;
    }
    if (user_id) {
      user.user_id = user_id;
    }
    try {
      await Folder.updateOneById(file, id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

const deleteOneById = async (req, res) => {
  const { id } = req.params;
  try {
    await Folder.deleteOneById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
    getFilesByUserId,
    getFilesByFolderId,
    getOneFileById,
    createFile,
    updateOneById,
    deleteOneById,
};
