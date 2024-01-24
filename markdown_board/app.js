import createError from "http-errors"
import express from "express";
import session from "express-session";
import path from "node:path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import passportConfig from "./util/auth.js";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

const app = express();

// view engine setup
app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Bootstrap bypass
app.use("/bootstrap", express.static(path.join(
    import.meta.dirname, "node_modules", "bootstrap", "dist"
)));
// axios bypass
app.use("/axios", express.static(path.join(
    import.meta.dirname, "node_modules", "axios", "dist"
)));
// session
app.use(session({
  secret: "4jGPp9u2r1wqg/WQv7Y1SOW++RwqR1BSjrH1Idn8EiBlmjWK",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60  * 1000}
}));
// passport
app.use(passport.authenticate("session"));
app.use(passportConfig(passport));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
