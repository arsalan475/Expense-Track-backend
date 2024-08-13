import express, { Router } from 'express'
import authenticated from '../middleware/auth.js';
import { record } from '../Model/recordModel.js';
import sendFilterdRecord from '../utils/filterRecords.js';
import { user } from '../Model/UserModel.js';
import { Expense } from '../Model/ExpenseModel.js';
import { ApiError } from '../utils/apiError.js';


const recordRouter = express.Router();

recordRouter.post('/addincome',authenticated,async function(req,res){
    const {income,month,date} = req.body

  

    try{

        const recordAdded = await record.create({income,month,date,user:req.user})

        if(!recordAdded) throw new ApiError(400,'','connection losed reload or try later')
        
       const User = await user.findById(req.user._id);

       if(!User) throw new ApiError(400,'','connection losed reload or try later')

       User.userRecords.push(recordAdded);

       const check =     await  User.save({validateBeforeSave:false})
       
        res.status(200).json({data : recordAdded,check:check})
        }catch(error){
            res.status(400).json(new ApiError(400,'',e.errors))
          
        }

   
    
})



recordRouter.get('/getallrecords',authenticated,async function(req,res){

    const id = req.user._id

    const allRecords = await record.find({user:id})
    res.json({data:allRecords})

})

recordRouter.get('/singlerecord/:id',authenticated,async function(req,res){
  try {
      const id = req.params.id
  
      if(!id){
          return res.status(400).json({success:false,message:'Invalid ID'})
      }
      const singleRecord = await record.findById(id)
      res.json({data:singleRecord})
  } catch (error) {
    console.log(error.message)
  }
})


recordRouter.post('/closerecord',authenticated,async function(req,res){
    const id = req.user._id
    try {
        const User = await user.findById(id);
    
        if(!User) throw new ApiError(500,'','connection failed')
    
          const numOfEntries = await  Expense.find({user:User._id}).countDocuments()
          const data = await  Expense.find({user:User._id})

       const lastEntryid = data.at(-1)._id

       const entries = await  Expense.findById(lastEntryid)

       entries.closeRecord = true;
       entries.saving = req.body.saving;
       entries.monthlyIncome = req.body.income;

  const editedEntries = await entries.save({validateBeforeSave: false})
    
            User.skip = numOfEntries ;
        await    User.save({validateBeforeSave:false})
    
            res.json({lastEntry:editedEntries});
    } catch (error) {
        res.status(500).json(new ApiError(500,'',error.errors))
    }
})


export {recordRouter}