/*
 * Copyright (c) Yurii Yevdokimov
 * Released under the CC BY-NC-SA 4.0
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Goods=new Schema({
    name:{
        type:String,
        default:""
    },
    amount:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0,
    },

    place:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:""
    }
})
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

const Request =new Schema({
    name: {
        type:String,
        required:true
    },
    isGoods:{
        type:Boolean,
       
    },
    isDelivery:{
        type:Boolean,
   
    },
    isService:{
        type:Boolean,
        
    },
    isMoney:{
        type:Boolean,
       
    },
    description:{
        type:String,

    },
    ccnumber:{
        type:String,
    },
    amount: {
        type:Number,
    },
    purpose:{
        type:String
    },
    goods:[Goods],
    status:{
        type:String,
        default:"Not active"
    },
    volunteer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    location:{
        type: pointSchema,
        required:false
    },




})

module.exports=mongoose.model("Request",Request);