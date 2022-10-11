require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../config');
const NotFoundError = require('../errors/not-found-error');
const BedReqError = require('../errors/bed-req-error');
const ConflictError = require('../errors/conflict-error');
const ServerError = require('../errors/server-error');
const AuthError = require('../errors/auth-error');

const {
  INCOR_USERDATA_TEXT,
  SERVER_ERR_TEXT,
  NO_USER_ID_TEXT,
  INCOR_USER_ID_TEXT,
  FOREIGN_EMAIL_TEXT,
  NO_USER_EMAIL_TEXT,
  WRONG_DATA_TEXT,
} = require('../utils/constants');

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    return res.send(user.hidePassword());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BedReqError(INCOR_USERDATA_TEXT));
    }
    if (err.code === 11000) {
      return next(new ConflictError(FOREIGN_EMAIL_TEXT));
    }
    return next(new ServerError(SERVER_ERR_TEXT));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError(NO_USER_ID_TEXT));
    }
    return res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BedReqError(INCOR_USER_ID_TEXT));
    }
    return next(new ServerError(SERVER_ERR_TEXT));
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    const userInfo = await User.findById(userId);
    if (email !== userInfo.email) {
      return next(new ConflictError(FOREIGN_EMAIL_TEXT));
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BedReqError(WRONG_DATA_TEXT));
    }
    return next(new ServerError(SERVER_ERR_TEXT));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthError(NO_USER_EMAIL_TEXT));
    }
    const matchedPas = await bcrypt.compare(password, user.password);
    if (!matchedPas) {
      return next(new AuthError(WRONG_DATA_TEXT));
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
    );
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    });
    return res.send(user.hidePassword());
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await res.clearCookie('jwt').send({ message: 'Bye!' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserInfo,
  updateUserProfile,
  login,
  logout,
};
