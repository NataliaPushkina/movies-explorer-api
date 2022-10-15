const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { NOT_FOUND_PAGE_TEXT } = require('../utils/constants');

const router = express.Router();
const { authRoutes } = require('./auth');
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');
const auth = require('../middlewares/auth');

router.use(authRoutes);

router.use(auth);

router.use(userRoutes);
router.use(movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_TEXT));
});

module.exports = {
  router,
};
