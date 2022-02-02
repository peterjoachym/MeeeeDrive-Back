const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// verifing controllers first

const verifyIfIdExist = async (req, res, next) => {
  const { id } = req.params;
  if (await User.idDoNotExists(id)) {
    res.status(404).send(`User with id: ${id} not found!`);
  } else {
    next();
  }
};

const verifyIfEmailAvailable = async (req, res, next) => {
  const { email } = req.body;
  if (await User.emailAlreadyExists(email)) {
    res.status(401).send("Email already used !");
  } else {
    next();
  }
};

const verifyEmailUser = async (req, res, next) => {
  const { email } = req.body;
  if (!(await User.emailAlreadyExists(email))) {
    res.status(401).send("User not found");
  } else {
    next();
  }
};

const verifyCredentials = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [results] = await User.findOneByEmail(email);
    if (results.length === 0) {
      res.status(401).send("Wrong Email or password !");
    } else {
      const { hashed_password } = results[0];
      const validPassword = await User.verifyPassword(
        password,
        hashed_password
      );
      if (validPassword) {
        delete results[0].hashed_password;
        const user = results[0];
        req.user = user;
        next();
      } else {
        res.status(401).send("Wrong Email or password !");
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// dependencies needed for nodemailer

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILING_SERVICE_USER,
    pass: process.env.MAILING_SERVICE_USER_PASSWORD,
  },
});

const sendActivationEmail = async (req, res, next) => {
  const { firstname, email } = req.body;
  const { id } = req.id ? req : req.params;
  const activationToken = jwt.sign({ id }, process.env.JWT_ACTIVATION, {
    expiresIn: "48h",
  });
  const activationEmail = {
    from: "account-activation-noreply@gmail.com",
    to: email,
    subject: "M(-_(-_-)_-)E Account Activation",
    html: `<h2>Hello my Dear ${firstname.toUpperCase()}</h2><br>
    <p>Welcome aboard the Wonderland,</br>
       Where your privacy count</br>
       Welcome in this private band</br>
       W(-_(-_-)_-)E are glad you have come</>
       Welcome, and activate your account.</br>
       Well, hit le link bellow and it's done:</p><br><br>
       <a href=${
         process.env.CLIENT_ORIGIN
       }/account-activate/${activationToken}>${
      process.env.CLIENT_ORIGIN
    }/account-activate/${activationToken}</a><p><br><br>
       <p>Rabbit hole  will collapse in 2 days, but do not wait so far !</p>`,
  };

  try {
    await transporter.sendMail(activationEmail);
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  const [results] = await User.findOneByEmail(email);
  const { id, firstname } = results[0];
  const activationToken = jwt.sign({ id }, process.env.JWT_RESET, {
    expiresIn: "15m",
  });
  const resetPasswordEmail = {
    from: "account-activation-noreply@gmail.com",
    to: email,
    subject: "M(-_(-_-)_-)E password reset",
    html: `<h2>Hello ${firstname} good to see you again</h2><br>
    <p>Even if you forget W(-_(-_-)_-)E are backing you.</br>
       Hit the link bellow and new memory will spawn:</p><br><br>
       <a href=${process.env.CLIENT_ORIGIN}/new-password-activate/${activationToken}>${process.env.CLIENT_ORIGIN}/new-password-activate/${activationToken}</a><p><br><br>
       <p>Ce lien est valable 15 minutes!</p>
       <p>If you do not know Why you are here just stay where you are !</br>
       Do not follow the rabbit down the hole !!!</p>`,
  };

  try {
    await transporter.sendMail(resetPasswordEmail);
    res.status(200).send("Email successfully send !");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createNewPassword = async (req, res, next) => {
  const { password } = req.body;
  const { id } = req.id ? req : req.params;
  const hashedPassword = await User.hashPassword(password);
  const user = { hashed_password: hashedPassword };
  try {
    await User.updateOneById(user, id);
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// classical CRUD controllers

async function createNewUser(req, res, next) {
  const { firstname, email, theme, is_admin } = req.body;
  try {
    const [results] = await User.createOne({
      firstname,
      email,
      theme,
      is_admin,
    });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const getMany = async (req, res) => {
  try {
    const [results] = await User.findMany();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneById = async (req, res, next) => {
  let { id } = req.id ? req : req.params;
  if (req.user) {
    id = req.user.id;
  }
  try {
    const [results] = await User.findOneById(id);
    if (results.length > 0 && !req.user && !req.id) {
      res.json(results[0]);
    } else if (results.length > 0 && (req.user || req.id)) {
      delete results[0].hashed_password;
      const [user] = results;
      if (req.user) {
        req.user = user;
        next();
      } else {
        res.json(user);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateOneById = async (req, res) => {
  const { firstname, email, theme, is_admin } = req.body;
  const { id } = req.params;

  if (!firstname && !email && !theme && !is_admin) {
    res.status(400).send("You need to give all mandatory datas!");
  } else {
    const user = {};
    if (firstname) {
      user.firstname = firstname;
    }
    if (email) {
      user.email = email;
    }
    if (theme) {
      user.theme = theme;
    }
    if (is_admin) {
      user.is_admin = is_admin;
    }
    try {
      await User.updateOneById(user, id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

const deleteOneById = async (req, res) => {
  const { id } = req.params;
  try {
    await User.deleteOneById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  verifyIfEmailAvailable,
  verifyEmailUser,
  createNewUser,
  getOneById,
  updateOneById,
  verifyIfIdExist,
  deleteOneById,
  getMany,
  verifyCredentials,
  createNewPassword,
  sendActivationEmail,
  sendResetPasswordEmail,
};
