const createError  = require('http-errors');
const express      = require('express');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const CORS         = require('./lib/cors.middleware');
const CONFIG       = require('./config.json');

const passport     = require('passport');
const User         = require('./model/User');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const multer       = require('multer');

mongoose
  .connect(CONFIG.mongoConnectUrl, {
    useNewUrlParser    : true,
    useUnifiedTopology : true
  })
  .then(() => console.log('Successfully connect to MongoDB'))
  .catch(() => {
    console.log('There was an error connecting to MongoDB');
    console.log(err.message);
    process.exit(1);
  });

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Import routers
const artRouter      = require('./routes/art');
const userRouter     = require('./routes/user');
const floorRouter    = require('./routes/floor');
const centuryRouter  = require('./routes/century');


const app = express();

//Sessions
app.use(session({
  secret            : CONFIG.sessionSecret,
  saveUninitialized : false,
  resave            : false,
  store             : new MongoStore({
    mongooseConnection : mongoose.connection
  })
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(CORS.setCors);

// app.use(multer({ dest: './uploads/',
//   rename: function (fieldname, filename) {
//     return filename;
//   },
//  }));

app.use('/art', artRouter);
app.use('/user', userRouter);
app.use('/floor', floorRouter);
app.use('/century', centuryRouter);

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
  res
    .send(err.message)
    .end();
});

module.exports = app;