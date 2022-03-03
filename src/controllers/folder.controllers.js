const { Folder } = require("../models");

const getFoldersByUserId = async (req, res) => {
  const { id } = req.params;
  const user_id = id;

  try {
    const [results] = await Folder.findManyByUserId(user_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneFolderById = async (req, res) => {
  const { id } = req.id ? req : req.params;
  const statusCode = req.id ? 201 : 200;
  try {
    const [results] = await Folder.findOneById(id);
    res.status(statusCode).json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createFolder = async (req, res, next) => {
  const { folder_name, folder_parent_id, user_id, is_in_the_bin } = req.body;
  try {
    const [results]=await Folder.createOneFolder({ folder_name, folder_parent_id, user_id, is_in_the_bin });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateOneById = async (req, res) => {
  const { folder_name, folder_parent_id, user_id, is_in_the_bin } = req.body;
  const { id } = req.params;

  if (!folder_name&& !folder_parent_id && !user_id && !is_in_the_bin ) {
    res.status(400).send("You need to give all mandatory datas!");
  } else {
    const folder = {};
    if (folder_name) {
      user.folder_name = folder_name;
    }
    if (folder_parent_id) {
      user.folder_parent_id = folder_parent_id;
    }
    if (user_id) {
      user.user_id = user_id;
    }
    if (is_in_the_bin) {
      user.is_in_the_bin = is_in_the_bin;
    }
    try {
      await Folder.updateOneById(folder, id);
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
  getFoldersByUserId,
  getOneFolderById,
  createFolder,
  updateOneById,
  deleteOneById,

};
