import { application } from "express";
import mongoose from "mongoose";




const recordSchema = mongoose.Schema({
    year:{
    type: String,
    default:new Date(Date.now()).getFullYear(),
    },

    month:{
        type: String,
        default:new Date().getMonth() + 1,
        },

        date:{
            type: String,
            default:new Date().getDate(),
            },
    income:{
        type:Number,
        required:true,
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },

   
    
})



export const record = mongoose.model('record',recordSchema)

