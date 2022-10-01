// require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/not-found-error');
const BedReqError = require('../errors/bed-req-error');
const ConflictError = require('../errors/conflict-error');
const ServerError = require('../errors/server-error');
const AuthError = require('../errors/auth-error');

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });
    return res.send(user.hidePassword());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BedReqError({ message: 'Переданы некорректные данные пользователя' }));
    }
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с указанным email уже существует'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Передан несуществующий _id пользователя'));
    }
    return res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BedReqError('Передан некорректный _id пользователя'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BedReqError('Переданы некорректные данные пользователя'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthError('Пользователь c указанным email не найден'));
    }
    const matchedPas = await bcrypt.compare(password, user.password);
    if (!matchedPas) {
      return next(new AuthError('Неправильные почта или пароль'));
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
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
  logout
};

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

// POST /signout