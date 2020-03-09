const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    let user = await User.findById(id).select('username followers following').lean();
    if(!user.following)
        user.following = [];
    if(!user.followers)
        user.followers = [];
    done(null, user);
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'No user found.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Wrong password.' });
            }
            if( !(user.verified)){
                return done(null, false, { message: 'Not verified.' });
            }
            return done(null, user);
        });
    })
);