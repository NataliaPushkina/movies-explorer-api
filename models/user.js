const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    unique: true,
    required: [true, 'Поле email обязательное'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    select: false,
    required: [true, 'Поле email обязательное'],
  },

  name: {
    type: String,
    minlength: [2, 'Поле name должно содерджать больше 2 символов'],
    maxlength: [30, 'Поле name должно содерджать не больше 30 символов'],
  },
}, { versionKey: false });

userSchema.methods.hidePassword = function hidePassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);