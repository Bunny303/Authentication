var _ = require('underscore')
    , User = require('../models/User.js')
    

module.exports = {
    index: function (req, res) {
        var users = User.findAll();
        _.each(users, function (user) {
            delete user.password;
            delete user.facebook;
        });
        res.json(users);
    }
};