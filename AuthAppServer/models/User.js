var User
    , _ = require('underscore')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , check = require('validator').check
    , Db = require('mongodb').Db
    , Server = require('mongodb').Server
    , BSON = require('mongodb').pure().BSON;

process.env.FACEBOOK_APP_ID = "640142566053741"
process.env.FACEBOOK_APP_SECRET = "3eff9bb45ec5f18d807ede0b4482e676";

var db = new Db('AuthApp', new Server('dharma.mongohq.com', 10097, { auto_reconnect: true }), { safe: false });
db.open(function (err, db) {
    if (!err) {
        db.authenticate('Bunny', 'qwerty', function (err) {
            if (!err) {
                con = db;
            }
        });
    }
}); //Where to close the DB???

module.exports = {
    addUser: function (username, password, callback) {
        if (this.findByUsername(username) !== undefined) {
            return callback("UserAlreadyExists");
        }

        var user = {
            username: username,
            password: password
        };
        db.collection('Users', function (err, collection) {
            collection.insert(user, function (err, result) {
                if (err) {
                    console.log('error: An error has occurred');
                }
                else {
                    callback(null, user);
                }
            });
        });
    },
    
    findByUsername: function (username) {
        db.collection('Users', function (err, collection) {
            collection.findOne({ username: username }, function (err, result) {
                if (err) {
                    console.log('error: An error has occurred');
                }
                else {
                    return result;
                }
            })
        });
    },
    //check
    //findByProviderId: function (provider, id) {
    //    return _.find(users, function (user) { return user[provider] === id; });
    //},

    validate: function (user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
    },

    localStrategy: new LocalStrategy(
        function (username, password, done) {
            db.collection('Users', function (err, collection) {
                collection.findOne({ username: username }, function (err, user) {
                    if (err) {
                        console.log('error: An error has occurred');
                    }
                    else {
                        if (!user) {
                            done(null, false, { message: 'Incorrect username.' });
                        }
                        else if (user.password != password) {
                            done(null, false, { message: 'Incorrect password.' });
                        }
                        else {
                            return done(null, user);
                        }
                    }
                })
            });
            
        }
    ),

    facebookStrategy: function () {
        if (!process.env.FACEBOOK_APP_ID) {
            throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
        }
        if (!process.env.FACEBOOK_APP_SECRET) {
            throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');
        }

        return new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            var user = {
                provider: profile.provider,
                userid: profile.id,
                username: profile.displayName
            };
            console.log(JSON.stringify(user));
            db.collection('FbUsers', function (err, collection) {
                collection.insert(user, function (err, result) {
                    if (err) {
                        console.log('error: An error has occurred');
                    }
                    else {
                        done(null, user);
                    }
                });
            });
        });
    },

    serializeUser: function (user, done) {
        done(null, user._id);
    },

    deserializeUser: function (id, done) {
        console.log("ID: " + id);

        db.collection('FbUsers', function (err, collection) {
            collection.findOne({ _id: new BSON.ObjectID(id) }, function (err, user) {
                if (err) {
                    console.log('error: An error has occurred');
                }
                else {
                    done(null, user);
                }
            })
        });

        

        
    }
};