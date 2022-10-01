const express = require('express');
const { celebrate, Joi } = require('celebrate');
const userRoutes = express.Router();
const auth = require('../middlewares/auth');

const {
  getUserInfo,
  updateUserProfile,
  logout
} = require('../controllers/users');

userRoutes.use(auth);

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserProfile);

userRoutes.post('/signout', logout);

module.exports = {
  userRoutes,
};