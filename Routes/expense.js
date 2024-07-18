import express from 'express';
import { Expense } from '../Model/ExpenseModel.js';
import authenticated from '../middleware/auth.js';
import { user } from '../Model/UserModel.js';
import sendFilterdRecord from '../utils/filterRecords.js';
import { record } from '../Model/recordModel.js';

const expenseRouter = express.Router()






expenseRouter.post('/add',authenticated , async function(req,res){
    const {title,amount,category,date,month} = req.body

    const recordId = req.user.userRecords.at(-1)

    try{



        const data = await Expense.create({title,amount,category,user:req.user,record:recordId,date,month})

        console.log(req.user)
      

        res.json({data})
   
    }catch(e){

  
        console.log(e.message)
    }
  
})

expenseRouter.get('/getprofile',authenticated,async function(req,res){

    try{
    const userData = await user.findById(req.user._id)

    res.send({data:userData})
    }catch(e){
        res.send({msg:e.message})
    }
})

expenseRouter.get('/currentdata',authenticated,async function(req,res){

    const id = req.user._id;
    // const skiped = req.query.skip;
    
        try{
            console.log(req.user._id)
        const userData = await Expense.find({user:id}).skip(req.user.skip).sort({date:1});
    
        res.send({data:userData})
        }catch(e){
            res.send({msg:e.message})
        }
    })

    expenseRouter.get('/alldata',authenticated,async function(req,res){

        const id = req.user._id;
        // const skiped = req.query.skip;
        
            try{
                console.log(req.user._id)
            const userData = await Expense.find({user:id}).sort({date:1,month:1});
        
            res.send({data:userData})
            }catch(e){
                res.send({msg:e.message})
            }
        })

expenseRouter.post('/remove/:id',async function(req,res){
    const {id} = req.params

    const entryDeleted = await Expense.findByIdAndDelete({_id:id})

    res.send({msg:'successfully deleted'})

   
})


expenseRouter.get('/filter',authenticated,async function(req,res){

    const {year,month,date} = req.query
    const id = req.user._id

    console.log(year,month,date)

   try {
     if(year) {
         if(!month && !date){
             const recordByYear = await Expense.find({year,user:id}).sort({date:1})
             sendFilterdRecord(req,res,recordByYear)
             
             }
     } 
 
     if(month) {
         if(!year && !date){
             const recordByMonth = await Expense.find({month,user:id}).sort({date:1})
             sendFilterdRecord(req,res,recordByMonth)
             
             }
     } 
 
 
     if(date) {
         if(!month && !year){
             console.log(typeof Number(date))
            
             const recordByDate = await Expense.find({$and:[{date:{$gte:date}},{date:{$lte:31}}],user:id}).sort({date:1})
             sendFilterdRecord(req,res,recordByDate)
             
             }
     } 
 
     if(year && month ) {
         if(!date){
             const recordByYearMonth = await Expense.find({year,month,user:id}).sort({date:1})
             sendFilterdRecord(req,res,recordByYearMonth)
             }
     } 
 
     if(year && month && date){
         
         const recordByYearMonthDate = await Expense.find({$and:[{date:{$gte:date}},{date:{$lte:31}}],year,month,user:id}).sort({date:1,year:-1,month:-1})
         sendFilterdRecord(req,res,recordByYearMonthDate)   
     }
 
   } catch (error) {
    console.log(error.message)

    
   }


})




export  {expenseRouter}