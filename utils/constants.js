const REG_EXP = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/;

const AUTH_ERR_TEXT = 'Необходима авторизация';
const INCOR_USERDATA_TEXT = 'Переданы некорректные данные пользователя';
const SERVER_ERR_TEXT = 'Произошла ошибка на сервере';
const NO_USER_ID_TEXT = 'Передан несуществующий _id пользователя';
const INCOR_USER_ID_TEXT = 'Передан некорректный _id пользователя';
const FOREIGN_EMAIL_TEXT = 'Указанный email принадлежит другому пользователю';
const NO_USER_EMAIL_TEXT = 'Пользователь c указанным email не найден';
const WRONG_DATA_TEXT = 'Неправильные почта или пароль';

module.exports = {
  REG_EXP,
  AUTH_ERR_TEXT,
  INCOR_USERDATA_TEXT,
  SERVER_ERR_TEXT,
  NO_USER_ID_TEXT,
  INCOR_USER_ID_TEXT,
  FOREIGN_EMAIL_TEXT,
  NO_USER_EMAIL_TEXT,
  WRONG_DATA_TEXT,
};
