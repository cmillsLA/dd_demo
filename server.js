var express    = require('express');
var app        = express();
var router = express.Router();
var hbs = require('hbs');
var http = require('http');

// Twitter, Facebook, Session.
var fb = require('fb');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var twitterAPI = require('node-twitter-api');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy;
var twitter_key = '12345';
var twitter_secret = '12345';
var twitter = new twitterAPI({
  consumerKey: twitter_key,
  consumerSecret: twitter_secret,
  callbackURL: "/#/dashboard"
});

app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true
}));
app.use(router);
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/lib", express.static(__dirname + '/public/lib'));
app.use("/views", express.static(__dirname + '/public/views'));

app.engine('hbs', hbs.__express);
app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/public');
//app.set('trust proxy', 1);

hbs.localsAsTemplateData(app);

/***** Views *****/
// Homepage.
app.get('/', function(req, res) {

  var d = req.session && req.session.flash ? req.session.flash : null;

  res.render('index.html', {
    data: d
  });

  req.session.flash = null;

});

/***** APIs *****/
// Logout.
app.get('/logout', function(req, res) {
  req.session = null;
  res.end();
});

// Twitter.
passport.use(new TwitterStrategy({
    consumerKey: twitter_key,
    consumerSecret: twitter_secret,
    callbackURL: "/auth/twitter/callback",
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {

    // Save new user.
    req.session.twitterToken = token;
    req.session.twitterSecret = tokenSecret;
    req.session.flash = 'Your Twitter account has been authorized.';

    var postData = profile;
    postData.twitterToken = token;
    postData.twitterSecret = tokenSecret;

    console.log(postData);

    var options = {
      hostname: 'demo only',
      port: 80,
      path: '/api/twitter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(postData.toString());
    req.end();

    done(null, profile);
  }
));

app.get('/api/twitter', function(req, res, next) {

  console.log('/api/twitter');

  if(req.session.twitterToken && req.session.twitterSecret) {
    console.log('twitter tokens found in session');
    res.json({ 'success' : true });
  } else {
    console.log('no twitter tokens found');
    //TODO AJAX call to get twitter credentials.

    // Not found.
    console.log('User not found, create user.');

    res.json({ 'success': false, 'message': 'User is not authenticated.'});

  }

});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/#/dashboard',
    failureRedirect: '/#/dashboard' }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  /*User.findById(id, function(err, user) {
    done(err, user);
  });*/
});

app.get('/api/twitter/post/:str', function(req, res) {

  // TODO - verify tokens.

  var msg = req.params.str;
  var status = '<a href="#">Link</a> to a new test advertisement.';
  if(msg !== null) { status = status + ' ' + msg; }

  var twitterToken = req.session.twitterToken;
  var twitterSecret = req.session.twitterSecret;

  if(!req.session.twitterToken || !req.session.twitterSecret) {
    res.json({ 'success' : false, 'message': 'Invalid or blank Twitter access tokens.' });
  } else{
    twitter.statuses("update", {
        status: status
      },
      twitterToken,
      twitterSecret,
      function(error, data, response) {
        if(error) {
          res.json({ 'success': false, 'message': error });
        } else {
          res.json({ 'success': true, 'message': data });
        }
      }
    );
  }

  // TODO post flag disabling Twitter posting for 24 hours.

});

// Heroku.
app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
