import mongoose from 'mongoose'
import { record } from './recordModel.js'


const userSchema = new mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    skip:{
        type:Number,
        default:0
    },

    userRecords : [
        {   type:mongoose.Schema.Types.ObjectId,
            ref:record,
        },
    ]
})



export const  user = mongoose.model('user',userSchema)