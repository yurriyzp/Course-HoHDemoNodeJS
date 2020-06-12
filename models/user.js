/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });
const User= new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },

    adress:
        {
        type:String,
        required:true,
    },
    location:{
        type: pointSchema,
        required:true
    },
    

    phone:
    {
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true  
    },
    status:{
        type:String,
        default:"Non Verified"
    },
    messages:{
        type:[]
    }


});
User.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",User);