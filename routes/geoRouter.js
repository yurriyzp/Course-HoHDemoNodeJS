/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
const express=require('express');
const geoRouter=express.Router();

const bodyParser=require('body-parser');
var passport = require('passport');

geoRouter.use(bodyParser.json());
var authenticate = require('../authenticate');
var ROLES =require ("../roles");
const Request=require("../models/request");
const User=require("../models/user");


geoRouter.post('/requests',
authenticate.verifyUser,
authenticate.verifyRole(ROLES.Volunteer),
(req,res,next)=>{
    Request.find(
        {
          location:
            { $near :
               {
                 $geometry: { type: "Point",  coordinates: req.user.location.coordinates},
                 
                 $maxDistance: 1000
               }
            }
        }
     ).populate("user")
     .then((requests)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(requests);
    }, (err) => next(err))
    .catch((err) => next(err));


});


geoRouter.post('/volunteers',
authenticate.verifyUser,
authenticate.verifyRole(ROLES.User),
(req,res,next)=>{
    User.find(
        {
          location:
            { $near :
               {
                $geometry: { type: "Point",  coordinates: req.user.location.coordinates},
                 
                 $maxDistance: 1000
               }
            },
            role: "Volunteer"
        }
     )
     .then((requests)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(requests);
    }, (err) => next(err))
    .catch((err) => next(err));


})





module.exports=geoRouter;