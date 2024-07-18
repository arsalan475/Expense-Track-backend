import express, { Router } from 'express'
import authenticated from '../middleware/auth.js';
import { record } from '../Model/recordModel.js';
import sendFilterdRecord from '../utils/filterRecords.js';
import { user } from '../Model/UserModel.js';
import { Expense } from '../Model/ExpenseModel.js';


const recordRouter = express.Router();

recordRouter.post('/addincome',authenticated,async function(req,res){
    const {income,month,date} = req.body

  

    try{

        const recordAdded = await record.create({income,month,date,user:req.user})
        
       const User = await user.findById(req.user._id);

       User.userRecords.push(recordAdded);

       const check =     await  User.save({validateBeforeSave:false})
       
        res.json({data : recordAdded,check:check})
        }catch(error){
            res.status(404).json({success:false,message:error.message})
          
        }

   
    
})

recordRouter.get('/getrecord',authenticated,async function(req,res){

    const {year,month,date} = req.query
    const id = req.user._id

    if(year) {
        if(!month && !date){
            const recordByYear = await record.find({year,user:id})
            sendFilterdRecord(req,res,recordByYear)
            
            }
    } 

    if(month) {
        if(!year && !date){
            const recordByMonth = await record.find({month,user:id})
            sendFilterdRecord(req,res,recordByMonth)
            
            }
    } 


    if(date) {
        if(!month && !year){
            const recordByDate = await record.find({$and:[{date:{$gte:date}},{date:{$lte:23}}],user:id})
            sendFilterdRecord(req,res,recordByDate)
            
            }
    } 

    if(year && month ) {
        if(!date){
            const recordByYearMonth = await record.find({year,month,user:id})
            sendFilterdRecord(req,res,recordByYearMonth)
            }
    } 

    if(year && month && date){
        
        const recordByYearMonthDate = await record.find({year,month,date,user:id})
        sendFilterdRecord(req,res,recordByYearMonthDate)
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
    
        if(!User) throw new Error('No such user')
    
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
        console.error(error.message)
    }
})


export {recordRouter}