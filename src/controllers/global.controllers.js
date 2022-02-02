const Yup = require("yup");

const verifyInputId = (req, res, next) => {
  const { id } = req.params;
  if (Number.isNaN(parseInt(id, 10))) {
    res.status(400).send("Wrong id format !");
  } else {
    next();
  }
};

const validateInputData = async (req, res, next) => {
  const schema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Firstname need to have at least 2 characters!")
      .max(80, "Firstname can not exceed 80 characters!")
      .required("Firstame is mandatory"),
    email: Yup.string()
      .email("wrong email format!")
      .required("Email is mandatory!"),
    theme: Yup.string().min(4, "Theme need to have at least 4 characters"),
    is_admin: Yup.number().required().integer().min(0).max(1),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateUpdateInputData = async (req, res, next) => {
  const schema = Yup.object().shape({
    firstname: Yup.string().max(
      80,
      "Le Prénom doit contenir au moins 2 caractères!"
    ),
    email: Yup.string().email("Wrong email format!"),
    theme: Yup.string().min(4, "Theme must have at least 4 characters"),
    is_admin: Yup.number().integer().min(0).max(1),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateInputPassword = async (req, res, next) => {
  const schema = Yup.object().shape({
    password: Yup.string()
      .required("Password is mandatory !")
      .min(8, "Password must have at least 8 characters.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
        "A password have to include one uppercase letter, one special character and a number !"
      ),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  verifyInputId,
  validateInputData,
  validateInputPassword,
  validateUpdateInputData,
};
