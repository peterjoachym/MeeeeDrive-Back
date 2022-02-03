require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const {
  ACCESS_JWT_SECRET,
  ACCESS_JWT_EXPIRESIN,
  ACCESS_JWT_COOKIE_MAXAGE,
  ACCESS_JWT_COOKIE_SECURE,
  REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRESIN,
  REFRESH_JWT_COOKIE_MAXAGE,
  REFRESH_JWT_COOKIE_SECURE,
} = process.env;

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const [result] = await User.findOneByEmail(email);
  if (result.length === 0) {
    res.status(400).send("Wrong email or password !");
  } else {
    const validPassword = await User.verifyPassword(
      password,
      result[0].hashed_password
    );
    if (validPassword) {
      delete result[0].hashed_password;
      const [user] = result;
      req.user = user;
      next();
    } else {
      res.status(400).send("Wrong email or password !");
    }
  }
};

const createAccessToken = (req, res) => {
  const token = jwt.sign(req.user, ACCESS_JWT_SECRET, {
    expiresIn: ACCESS_JWT_EXPIRESIN,
  });

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: parseInt(ACCESS_JWT_COOKIE_MAXAGE, 10),
      secure: ACCESS_JWT_COOKIE_SECURE === "true",
      sameSite: "lax",
    })
    .json({
      id: req.user.id,
      role: req.user.is_admin,
      firstname: req.user.firstname,
      expires_in: parseInt(ACCESS_JWT_COOKIE_MAXAGE, 10),
    });
};

const createAccessAndRefreshToken = (req, res) => {
  const token = jwt.sign(req.user, ACCESS_JWT_SECRET, {
    expiresIn: ACCESS_JWT_EXPIRESIN,
  });
  const refreshToken = jwt.sign({ id: req.user.id }, REFRESH_JWT_SECRET, {
    expiresIn: REFRESH_JWT_EXPIRESIN,
  });
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: parseInt(ACCESS_JWT_COOKIE_MAXAGE, 10),
      secure: ACCESS_JWT_COOKIE_SECURE === "true",
      sameSite: "lax",
    })
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: parseInt(REFRESH_JWT_COOKIE_MAXAGE, 10),
      secure: REFRESH_JWT_COOKIE_SECURE === "true",
      sameSite: "lax",
    })
    .json({
      id: req.user.id,
      role: req.user.is_admin,
      firstname: req.user.firstname,
      expires_in: 0.5 * 60,
    });
};

const verifyAccessToken = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, ACCESS_JWT_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("token");
        res.sendStatus(403);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res
      .status(403)
      .send("You are not authorized to access this hole, little rabbit!");
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const { refresh_token } = req.cookies;
  if (refresh_token) {
    jwt.verify(refresh_token, REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("refresh_token");
        res.sendStatus(403);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res
      .status(403)
      .send("You are not authorized to access this hole, little rabbit !");
  }
};

const validateAdminRole = (req, res, next) => {
  if (req.user.is_admin === 1) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const deleteRefreshToken = (req, res) => {
  res.clearCookie("refresh_token");
  res.clearCookie("token");
  return res.sendStatus(204);
};

//

const verifyActivationToken = async (req, res, next) => {
  const { token } = req.params;
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_ACTIVATION, (err, decoded) => {
      if (!err) {
        req.id = decoded.id;
        return next();
      }
      return res.status(403).send("You have a wrong link or it expired, little rabbit !");
    });
  }
};

const verifyResetToken = async (req, res, next) => {
  const { token } = req.params;
  if (token) {
    jwt.verify(token, process.env.JWT_RESET, (err, decoded) => {
      if (!err) {
        req.id = decoded.id;
        return next();
      }
      return res.status(403).send("You have a wrong link or it expired, little rabbit !");
    });
  }
};

module.exports = {
  login,
  createAccessToken,
  createAccessAndRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  validateAdminRole,
  deleteRefreshToken,
  verifyActivationToken,
  verifyResetToken,
};
