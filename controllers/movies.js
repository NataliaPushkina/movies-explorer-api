const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BedReqError = require('../errors/bed-req-error');
const ForbiddenError = require('../errors/forbidden-error');
const ServerError = require('../errors/server-error');

const {
  SERVER_ERR_TEXT,
  NO_MOVIES_TEXT,
  VALIDAT_ERR_TEXT,
  NO_MOVIE_ID_TEXT,
  FOREIGN_MOVIE_TEXT,
  DEL_MOVIE_TEXT,
  INCOR_MOVIE_ID_TEXT,
} = require('../utils/constants');

const getMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner });
    if (!movies) {
      return next(new NotFoundError(NO_MOVIES_TEXT));
    }
    return res.send(movies);
  } catch (err) {
    return next(new ServerError(SERVER_ERR_TEXT));
  }
};

const createMovie = async (req, res, next) => {
  try {
    const id = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: id,
    });
    return res.send(movie);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      return next(new BedReqError(VALIDAT_ERR_TEXT));
    }
    return next(new ServerError(SERVER_ERR_TEXT));
  }
};

const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const movie = await Movie.findById(_id);
    if (!movie) {
      return next(new NotFoundError(NO_MOVIE_ID_TEXT));
    }
    if (req.user._id !== movie.owner.toString()) {
      return next(new ForbiddenError(FOREIGN_MOVIE_TEXT));
    }
    await movie.remove();
    return res.send({ message: DEL_MOVIE_TEXT });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BedReqError(INCOR_MOVIE_ID_TEXT));
    }
    return next(new ServerError(SERVER_ERR_TEXT));
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
