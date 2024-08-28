import mongoose from 'mongoose'
import { record } from './RecordModel.js'

import bcrypt from 'bcryptjs'
import validator from 'validator'

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:[true,"User already exists"],
        // validate:validator.isEmail
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'password must be 8 characters long'],
    },
    skip:{
        type:Number,
        default:0
    },

    userRecords : [
        {   type:mongoose.Schema.Types.ObjectId,
            ref:record,
        },
    ],

    createdAt : {
        type:Date ,
      default: Date
    }
})

userSchema.pre('save',function(next){

    this.createdAt = new Date(this.createdAt)
    
             next()
    })
    


userSchema.pre('save',async function(next){

   

if(!this.isModified('password')) return next()

   const hashed =  await   bcrypt.hash(this.password,10)

      this.password = hashed
         next()
})


userSchema.methods.checkPasswordCorrect = async function(password){
    const encrypted = await bcrypt.compare(password,this.password)

    return encrypted
}


export const  user = mongoose.model('user',userSchema)