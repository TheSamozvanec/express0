import createError from "http-errors";
import https from "https";
import fs from "fs";
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from "morgan"; 
import debugLib from 'debug' 
import __dirname from './dirname.js'; // директория

import indexRouter from './routes/index.js'; // роуты
import usersRouter from './routes/user.js'; // роуты
import pageRouter from "./routes/page.js"; // роуты
import authRouter from "./routes/auth.js"; // роуты
import productRouter from "./routes/product.js";

import { handlebars, ConnetctTest, closeServer, PORT, secret } from './config/serverConfig.js';
import allInit from "./services/index.js";
import { authMiddleware } from "./middlewares/auth.js";
import whiteList from "./config/whiteList.js";



const debug = debugLib('express0:server'); // логер подключен можно использовать debug вместо консоли
await ConnetctTest(); // подключает postgress и mariadb через дрова 
await allInit(); // инициализация таблиц
closeServer(); //безопасная остановка (прослушивет событие остановки и закрывает соединение с db)
const app = express();

app.set('views', path.join(__dirname, 'views')); // жесткая привязка через __dirname, можно так app.set('views', './views')

app.use(logger('dev')); // морган в дев режиме (все в консоль)

// настройки шаблонизатора
app.engine('hbs',handlebars.engine); 
app.set('view engine','hbs');

//настройки парсеров данных
app.use(express.json());// json
app.use(express.urlencoded({ extended: false })); // 
app.use(cookieParser()); // куки 

app.use(express.static(path.join(__dirname, 'public'))); // жесткая привязка через __dirname, можно app.use(express.static('./public')))

app.use(authMiddleware(whiteList)); // мидлвар авторизации 
app.use('/user',usersRouter);
app.use('/page',pageRouter);
app.use('/auth',authRouter);
app.use('/product', productRouter);
app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 debug('Listening on ' + PORT);
// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// };

// const httpsServer = https.createServer(options, app);

// httpsServer.listen(PORT, () => {
//     console.log(`✅ HTTPS server running on https://localhost:${PORT}`);
//     console.log(`⚠️  HTTP server is NOT running (cookies with Secure flag require HTTPS)`);
// });

debug('Listening on ' + PORT);
app.listen(PORT,()=>{console.log(`http://localhost:${PORT}`)});