/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
const express=require('express');
const adminRouter=express.Router();

const bodyParser=require('body-parser');
var passport = require('passport');

adminRouter.use(bodyParser.json());
var authenticate = require('../authenticate');
var ROLES =require ("../roles");
var User = require('../models/user');
var Request=require("../models/request");




//get users list(for admin)
adminRouter.get("/users",
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
adminRouter.get("/volunteers",
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
adminRouter.put("/:usrId",
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

//get requests list(for admin)
adminRouter.get("/requests",
authenticate.verifyUser,
authenticate.verifyRole(ROLES.Admin),
(req,res,next)=>{
    Request.find({})
    .then((requests)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(requests);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports=adminRouter;
