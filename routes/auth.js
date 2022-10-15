const express = require('express');
const { signupValidation, signinValidation } = require('../utils/validation');

const authRoutes = express.Router();
const { createUser, login } = require('../controllers/users');

authRoutes.post('/signup', signupValidation, createUser);

authRoutes.post('/signin', signinValidation, login);

module.exports = {
  authRoutes,
};
