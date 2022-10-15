require('dotenv').config();
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../config');

const AuthError = require('../errors/auth-error');
const { AUTH_ERR_TEXT } = require('../utils/constants');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return next(new AuthError(AUTH_ERR_TEXT));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
