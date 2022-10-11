require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { router } = require('./routes/index');
const handleError = require('./errors/error');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimitMiddleware = require('./middlewares/rate-limiter');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const {
  PORT = 3000,
  BASE_PATH,
  MONGO_PATH,
  NODE_ENV,
} = process.env;
const { MONGO_PATH_DEV } = require('./config');

app.use(
  cors({
    origin: ['pushkina.nomoredomains.icu', 'http://localhost:3001'],
    credentials: true,
  }),
);

app.use(requestLogger);
app.use(rateLimitMiddleware);

app.use('/', router);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.use(express.static(path.join(__dirname, 'public')));

async function main() {
  try {
    console.log('Вызвана функция main');
    await mongoose.connect(NODE_ENV === 'production' ? MONGO_PATH : MONGO_PATH_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    console.log(`Произошла ошибка ${err.name} ${err.message}`);
  }
  try {
    await app.listen(PORT);
    console.log(`Сервер запущен на ${PORT} порту`);
    console.log(BASE_PATH);
  } catch (err) {
    console.log(`Произошла ошибка ${err.name} ${err.message}`);
  }
}

main();
