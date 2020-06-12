/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
const express=require('express');
const chatRouter=express.Router();

const bodyParser=require('body-parser');
var passport = require('passport');

chatRouter.use(bodyParser.json());
var authenticate = require('../authenticate');
var ROLES =require ("../roles");
const User=require("../models/user");

chatRouter.route("/")
//Get my messages
.get(authenticate.verifyUser,(req,res,next)=>{
   User.findById(req.user.id).then(user=>{
    if (user)
   {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user.messages);

   }

   }, (err) => next(err))
.catch((err) => next(err));
 
  

    
})        


.post((req,res,next)=>{
    
    res.statusCode = 403;
    res.end('POST operation not supported on /chat');
}
)

//Not allowed
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /chat');

})
//Not allowed
.delete((req,res,next)=>{
    res.statusCode = 403;
    res.end('DELETE operation not supported on /chat');
});
    


module.exports=chatRouter;