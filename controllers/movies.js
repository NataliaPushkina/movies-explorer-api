const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BedReqError = require('../errors/bed-req-error');
const ForbiddenError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    if (!movies) {
      return next(new NotFoundError('Не удалось найти фильмы'));
    }
    return res.send(movies);
  } catch (err) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const createMovie = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN,thumbnail, movieId } = req.body;
    const movie = await Movie.create({ country, director, duration, year, description, image, trailerLink, nameRU, nameEN,thumbnail, movieId, owner: id });
    return res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BedReqError('Ошибка в запросе'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const movie = await Movie.findById(_id);
    if (!movie) {
      return next(new NotFoundError('Передан несуществующий _id фильма'));
    }
    if (req.user._id !== movie.owner.toString()) {
      return next(new ForbiddenError('Удаление фильмов других пользователей запрещено'));
    }
    await movie.remove();
    return res.send({ message: 'Фильм удален из списка сохраненных' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BedReqError('Передан некорректный id фильма'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
};
