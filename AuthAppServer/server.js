var express = require('express')
    , http = require('http')
    , passport = require('passport')
    , path = require('path')
    , User = require('./models/User.js');

var app = module.exports = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(express.cookieParser());
    app.use(express.cookieSession(
        {
            secret: process.env.COOKIE_SECRET || "Superdupersecret"
        }));
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
passport.use(User.facebookStrategy()); 
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./routes.js')(app);

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});