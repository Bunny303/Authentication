var _ = require('underscore')
    , path = require('path')
    , passport = require('passport')
    , AuthCtrl = require('./controllers/auth')
    , User = require('./models/User.js')
 

var routes = [
    // OAUTH
    {
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook')]
    },
    {
        path: '/auth/facebook/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook', {
            successRedirect: '/game',
            failureRedirect: '/login'
        })]
    },

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },

    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            if (req.user) {
                username = req.user.username;
            }
            res.cookie('user', JSON.stringify({
                'username': username
            }));
        }]
    }
];

module.exports = function (app) {

    _.each(routes, function (route) {
        var args = _.flatten([route.path, route.middleware]);

        switch (route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
};

