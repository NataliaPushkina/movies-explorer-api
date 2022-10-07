const express = require('express');
const { celebrate, Joi } = require('celebrate');

const movieRoutes = express.Router();
const auth = require('../middlewares/auth');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.use(auth);

movieRoutes.get('/movies', getMovies);

movieRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^(http|https):\/\/(W{3}\.)?[^]+#?$/),
    trailerLink: Joi.string().required().regex(/^(http|https):\/\/(W{3}\.)?[^]+#?$/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(/^(http|https):\/\/(W{3}\.)?[^]+#?$/),
    movieId: Joi.string().required(),
  }),
}), createMovie);

movieRoutes.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = {
  movieRoutes,
};
