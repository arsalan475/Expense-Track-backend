import express from 'express'
import { user } from '../Model/UserModel.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { Expense } from '../Model/ExpenseModel.js'
import authenticated from '../middleware/auth.js'



const userRouter = express.Router()



userRouter.post('/register',async function(req,res){
    const {userName,email,password} = req.body

try {
    
        const userExist = await user.findOne({email})
    
        
    
        if(userExist) return res.send('user already exist with this email')
    
        
        const data = await user.create({userName,email,password})
        
        if(!data) throw new ApiError('400','','Please try later')
            
            res.cookie("token",data._id,{
                httpOnly: true,
                sameSite:   process.env.NODE_ENV === 'dev' ? "lax" : "none",
                secure:process.env.NODE_ENV === 'dev' ? false : true,
            })
            
        
        res.json({user:data})
} catch (error) {
    res.json(new ApiError(400,'',error.message)).status(400)
}

})


userRouter.post('/login',asyncHandler(async function(req,res){
    const {email,password} = req.body

try {
    
        const userExist = await user.findOne({email})
    
    
    
        if(!userExist) throw new ApiError(400,'','user not exist')
    
           const encrypted = await userExist.checkPasswordCorrect(password)

          
            
    
        if(!encrypted) throw new ApiError(400,'','invalid Password')
    
            res.cookie("token",userExist._id,{
                httpOnly: true,
                sameSite:   process.env.NODE_ENV === 'dev' ? "lax" : "none",
                secure:process.env.NODE_ENV === 'dev' ? false : true,
            })
        res.json({user:userExist})
    
    
    
} catch (error) {
   res.json( new ApiError(400,'',error.errors))
}    
}))





userRouter.get('/deactivate',authenticated, async function (req, res) {
   const {token} =  req.cookies
  const deleted = await Expense.deleteMany({user:token})
  const deactivatedUser = await user.findByIdAndDelete({_id:token})

  const options = {
    httpOnly: true,
    sameSite:   process.env.NODE_ENV === 'dev' ? "lax" : "none",
    secure:process.env.NODE_ENV === 'dev' ? false : true,
  }
 
 res.status(200).clearCookie("token",token,options).json({deactivatedUser}) //
})



userRouter.get('/logout',authenticated, async function (req, res) {
    const {token} =  req.cookies
 
   const options = {
     httpOnly: true,
     sameSite:   process.env.NODE_ENV === 'dev' ? "lax" : "none",
     secure:process.env.NODE_ENV === 'dev' ? false : true,
   }
  
  res.status(200).clearCookie("token",token,options).send('logout successfully') //
 })

export {userRouter}


