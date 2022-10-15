const express = require('express');

const userRoutes = express.Router();
const { userValidation } = require('../utils/validation');

const {
  getUserInfo,
  updateUserProfile,
  logout,
} = require('../controllers/users');

userRoutes.get('/users/me', getUserInfo);

userRoutes.patch('/users/me', userValidation, updateUserProfile);

userRoutes.post('/signout', logout);

module.exports = {
  userRoutes,
};
