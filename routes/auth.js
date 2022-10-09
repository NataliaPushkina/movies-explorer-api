const express = require('express');
const { celebrate, Joi } = require('celebrate');

const authRoutes = express.Router();
const { createUser, login } = require('../controllers/users');

authRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

authRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = {
  authRoutes,
};
