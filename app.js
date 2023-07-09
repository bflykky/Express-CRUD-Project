var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var authConfig = require('./app/config/auth.config');

var indexRouter = require('./app/routes/index');
var questionsRouter = require('./app/routes/question.routes');
var usersRouter = require('./app/routes/user.routes');
var authRouter = require('./app/routes/auth.routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// JWT 웹 토큰 검증에 사용되는 비밀 키 set
app.set('jwt-secret', authConfig.secretKey);
app.set('jwt-validTime', authConfig.validTime);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/question', questionsRouter);
app.use('/member', usersRouter)
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
