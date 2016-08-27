var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var express = require('express')
var session = require('express-session');
var config = require('./webpack.config')
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var OpenIDStrategy = require('passport-openid').Strategy;
var app = new(require('express'))()
var port = 3000
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'anythigsd',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))

passport.serializeUser(function(user, done) {
 done(null, user.identifier);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost:3000/auth/openid/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, done) {
     return done(null, {identifier: identifier});
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

app.get('/', ensureAuthenticated, function(req, res){
  res.render('index', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.post('/auth/openid',
  passport.authenticate('openid', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/openid/return',
  passport.authenticate('openid', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//called as soon as the user is logged in
app.get('/hello', function (req, res) {
  var data = [];
  data.push({
    message: "Updated message from server: Hello world from server"
  })
  //for effect too see the update of the state
  setTimeout(function () {
    res.send(data);
  }, 3000)

});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
