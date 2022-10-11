const express = require('express');

const movieRoutes = express.Router();
const { movieValidation, userIdValidation } = require('../utils/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/movies', getMovies);

movieRoutes.post('/movies', movieValidation, createMovie);

movieRoutes.delete('/movies/:_id', userIdValidation, deleteMovie);

module.exports = {
  movieRoutes,
};
