const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const { User} = require('../models/User');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtPrivateKey;

module.exports = function(app) {
    app.use(passport.initialize());

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload._id)
            .then(user => {
                if(user){
                    return done(null, user);
                }
                return done(null, false);
            })
    }));
}