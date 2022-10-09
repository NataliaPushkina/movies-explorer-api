const express = require('express');

const router = express.Router();
const { authRoutes } = require('./auth');
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');
const auth = require('../middlewares/auth');

router.use(authRoutes);

router.use(auth);

router.use(userRoutes);
router.use(movieRoutes);

module.exports = {
  router,
};
