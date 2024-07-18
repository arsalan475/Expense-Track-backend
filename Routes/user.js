import express from 'express'
import { user } from '../Model/UserModel.js'


const userRouter = express.Router()



userRouter.post('/register',async function(req,res){
    const {userName,email,password} = req.body


    const userExist = await user.findOne({email})

    

    if(userExist) return res.send('user already exist with this email')


    const data = await user.create({userName,email,password})

    if(data) res.cookie("token",data._id)
        console.log(req.cookies)
    res.json({data})

})


userRouter.post('/login',async function(req,res){
    const {email,password} = req.body

   

    const userExist = await user.findOne({email})

    if(!userExist) return res.send('invalid email')

    if(userExist.password !== password) return res.send('incorret email or password')

        res.cookie("token",userExist._id)
    res.send({user:userExist})


    
})








export {userRouter}


