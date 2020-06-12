/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
const express=require('express');
const authRouter=express.Router();

const bodyParser=require('body-parser');
var passport = require('passport');

authRouter.use(bodyParser.json());
var authenticate = require('../authenticate');
var ROLES =require ("../roles");
var User = require('../models/user');


//Signup for volunteer/user
authRouter.post("/signup",(req,res,next)=>{
    var location={
        type: "Point",
        coordinates: [req.body.lon,req.body.lat]

    }
    User.register(
    new User({
        username: req.body.username,
        name:req.body.name,
        email:req.body.email,
        adress:req.body.adress,
        location:location,
        phone:req.body.phone,
        role:req.body.role,
        status:"Non verified"
    
    
    
    }), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'SignUp Unsuccessful!', err: err});
    }
    else {
      
        

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'SignUp Unsuccessful!', err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'SignUp Successful!'});
        });
      });
    }

})
});
//Login for all
authRouter.post('/login',  (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token,user:req.user});
    }); 
  }) (req, res, next);
});

//get users list(for admin)
authRouter.get("/users",
authenticate.verifyUser,
authenticate.verifyRole(ROLES.Admin),
(req,res,next)=>{
    User.find({role:ROLES.User})
    .then((requests)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(requests);
    }, (err) => next(err))
    .catch((err) => next(err));

});

//get volunteers list(for admin)
authRouter.get("/volunteers",
authenticate.verifyUser,
authenticate.verifyRole(ROLES.Admin),
(req,res,next)=>{
    User.find({role:ROLES.Volunteer})
    .then((requests)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(requests);
    }, (err) => next(err))
    .catch((err) => next(err));
});
//change status of User/Volunteer
authRouter.put(":usrId",
authenticate.verifyUser,
authenticate.verifyRole(ROLES.Admin),
(req,res,next)=>{
    User.findByIdAndUpdate(req.params.usrId, {
        $set: req.body
    }, { new: true })
    .then((usr) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(usr);
    }, (err) => next(err))
    .catch((err) => next(err));

})

module.exports=authRouter;
