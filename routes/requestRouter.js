/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
const express=require('express');
const requestRouter=express.Router();

const bodyParser=require('body-parser');
var passport = require('passport');

requestRouter.use(bodyParser.json());
var authenticate = require('../authenticate');
var ROLES =require ("../roles");
const Request=require("../models/request");
requestRouter.route('/')
//Get all Requests (for admin) or Volunteer requests or User requests
.get(authenticate.verifyUser,
    (req,res,next)=>{
    
    if (req.user.role===ROLES.Volunteer)
        {
            Request.find({volunteer:req.user._id})
            .populate("user volunteer")
            
            .then((requests)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                  
                let req=requests.map((val)=>{
                    return {
                        
                            id:val._id,
                            name:val.name,
                            type:val.type,
                            user:val.user?val.user.name:"",
                            volunteer:val.volunteer?val.volunteer.name:"",
                            status:val.status,
                            isGoods:val.isGoods,
                            isMoney:val.isMoney,
                            isDelivery:val.isDelivery,
                            isService:val.isService
                        
                    }
                })
                                    res.json(req);
            }, (err) => next(err))
            .catch((err) => next(err));

        }
    else if (req.user.role===ROLES.User)   
    {       Request.find({user:req.user._id})
            .populate("volunteer")
            .then((requests)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                
                
                let req=requests.map((val)=>{
                    return {
                        
                            id:val._id,
                            name:val.name,
                            type:val.type,
                            volunteer:val.volunteer?val.volunteer.name:"",
                            status:val.status,
                            isGoods:val.isGoods,
                            isMoney:val.isMoney,
                            isDelivery:val.isDelivery,
                            isService:val.isService
                        
                    }
                })
                res.json(req);
            }, (err) => next(err))
            .catch((err) => next(err));
    }
    else {
        res.statusCode = 500;
        res.json(req.user);
        res.end('Server error');

    }
})
//Post new Request(as user/admin)
.post(authenticate.verifyUser,
    authenticate.verifyRole(ROLES.Admin,ROLES.User),
    (req,res,next)=>{
        if (!req) {
            var err=new Error("Bad request");
            next(err);   
        }
        console.log("THIS IS REQUEST");
        console.log(req.body);
        let request=req.body;
        request.location=req.user.location;
        request.user=req.user._id;
        request.volunteer=null;
        Request.create(request)
        .then((request) => {
            console.log('Request Created ', request);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
        }, (err) => {
            console.log(err);
            next(err)}
            )
        .catch((err) => {
            console.log(err);
            next(err)}
            );


},
)
//Not allowed
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /requests');

})
//Not allowed
.delete((req,res,next)=>{
    res.statusCode = 403;
    res.end('DELETE operation not supported on /requests');

});


//Get one Request
requestRouter.route('/:requestId')
.get(authenticate.verifyUser,
    authenticate.verifyRequest,
    (req,res,next)=>{
        Request.findById(req.params.requestId)
        .populate("user").populate("volunteer")
        
        .then((request) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
        }, (err) => next(err))
        .catch((err) => next(err));



})
//Not allowed
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /requests');

})
//Change one Request
.put(authenticate.verifyUser,
    authenticate.verifyRole(ROLES.User,ROLES.Volunteer),
    authenticate.verifyRequest,
    (req,res,next)=>{
        Request.findByIdAndUpdate(req.params.requestId, {
            $set: req.body
        }, { new: true })
        .then((request) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
        }, (err) => next(err))
        .catch((err) => next(err));

})
//Delete one Request(only for user/admin)
.delete(authenticate.verifyUser,
    authenticate.verifyRole(ROLES.User),
    authenticate.verifyDeleteRequest,
    (req,res,next)=>{
        Request.findByIdAndRemove(req.params.requestId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));

});




module.exports=requestRouter;
