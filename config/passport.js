const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const { User } = require('../models/User')

const { secretOrKey } = require('./keys')


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;
module.exports = {
    userPassport: function (passport) {
        passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
            // console.log(jwt_payload)
            User.findOne({
                where: {
                    id: jwt_payload.id
                }
            }).then(user => {
                if (user) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            }).catch(err => {
                console.log(err)
            })
        }));
    }
}