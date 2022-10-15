const mongoose = require('mongoose');
const { REG_EXP } = require('../utils/constants');

const movieSchema = new mongoose.Schema({

  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const valid = REG_EXP.test(v);
        return valid;
      },
      message: 'Неправильный формат ссылки',
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const valid = REG_EXP.test(v);
        return valid;
      },
      message: 'Неправильный формат ссылки',
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const valid = REG_EXP.test(v);
        return valid;
      },
      message: 'Неправильный формат ссылки',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  movieId: {
    type: Number,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
