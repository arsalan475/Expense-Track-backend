import { user } from "../Model/UserModel.js"


async function  authenticated(req,res,next){

const {token} = req.cookies

if(!token) return res.send('create an account first') 

  const userData =  await user.findById(token)

  if(!userData) return res.send('create an account')

  req.user = userData

  next()

}

export default authenticated