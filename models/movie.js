const mongoose = require('mongoose');

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
        const valid = /^(http|https):\/\/(W{3}\.)?[^]+#?$/.test(v);
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
        const valid = /^(http|https):\/\/(W{3}\.)?[^]+#?$/.test(v);
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
        const valid = /^(http|https):\/\/(W{3}\.)?[^]+#?$/.test(v);
        return valid;
      },
      message: 'Неправильный формат ссылки',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    validate: {
      validator: (v) => /^[a-fA-F0-9]{24}$/.test(v),
      message: 'Неправильный id пользователя!',
    },
  },

  movieId : {
    // type: String,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  }
}, { versionKey: false });

module.exports = mongoose.model('card', movieSchema);