/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');
var User = require('./models/user');
var Request=require('./models/request');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};



var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyRole=(...roles)=>(req,res,next)=>{
    const hasRole=roles.find(role=>req.user.role===role);
    if (!hasRole){
        res.statusCode = 403;
        

        
        res.end('Unauthorized for'+req.user.role);
    }
    else next();
};

exports.verifyRequest=(req,res,next)=>{
    Request.findById(req.params.requestId).then((request)=>{
        if (!request){
            res.statusCode = 500;
            res.end('Request not found');
        };

        if ((request.user &&!request.user.equals(req.user._id)) && (request.volunteer && !request.volunteer.equals(req.user._id)))
        { 
             res.statusCode = 403;
            res.end(request.user + ' Unauthorized for' + req.user._id);

        }
        else next();
    })
        
};
exports.verifyDeleteRequest=(req,res,next)=>{

        let uid;
        Request.findById(req.params.requestId).then((request)=>{
            if (!request){
                res.statusCode = 500;
                res.end('Request not found');
            };

            if (!request.user._id.equals(req.user._id))
            { 
                 res.statusCode = 403;
                res.end(request.user + ' Unauthorized for' + req.user._id);

            }
            else next();
        })
    
};



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());