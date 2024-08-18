import express from 'express';
import { Expense } from '../Model/ExpenseModel.js';
import authenticated from '../middleware/auth.js';
import { user } from '../Model/UserModel.js';
import sendFilterdRecord from '../utils/filterRecords.js';
import { ApiError } from '../utils/apiError.js';

const expenseRouter = express.Router()






expenseRouter.post('/add',authenticated , async function(req,res){
    const {title,amount,category,date,month} = req.body

    const recordId = req.user.userRecords.at(-1)

    try{



        const data = await Expense.create({title,amount,category,user:req.user,record:recordId,date,month})

        if(!data) throw new ApiError('400','','try again')
      

        
        res.status(201).json({success:true,data})
   
    }catch(e){

  
        res.status(500).json(new ApiError(500,'',e.errors))
    }
  
})

expenseRouter.get('/getprofile',authenticated,async function(req,res){

    try{
    const userData = await user.findById(req.user._id)

  if(!userData) throw new ApiError(404,'','not found')
    res.status(200).json({success:true,data:userData})
    }catch(e){
        res.status(404).json(new ApiError(404,'',e.errors))
    }
})

expenseRouter.get('/currentdata',authenticated,async function(req,res){

    const id = req.user._id;
    // const skiped = req.query.skip;
    
        try{
            
        const userData = await Expense.find({user:id}).skip(req.user.skip).sort({date:-1});
    
            if(!userData) throw new ApiError(404,'','not found')

        res.status(200).json({success:true,data:userData})
        }catch(e){
            res.status(404).json(new ApiError(404,'',e.errors))
        }
    })

    expenseRouter.get('/alldata',authenticated,async function(req,res){

        const id = req.user._id;
        // const skiped = req.query.skip;
        
            try{
                
            const userData = await Expense.find({user:id}).sort({date:1,month:1});
        
            if(!userData) throw new ApiError(404,'','not found')

            res.json({success:true,data:userData}).status(200)

            }catch(e){
                res.status(404).json(new ApiError(404,'',e.errors))
            }
        })

expenseRouter.post('/remove/:id',async function(req,res){
    try {
        const {id} = req.params

        if(!id) throw new ApiError(500,'','Reload App')
    
        const entryDeleted = await Expense.findByIdAndDelete({_id:id})
    
        
        res.status(200).json({success:true,msg:'deleted successfully'})
    } catch (error) {
        res.status(500).json(new ApiError(500,'',e.errors))
    }

   
})


expenseRouter.get('/filter',authenticated,async function(req,res){

    const {year,month,date} = req.query
    const id = req.user._id

    

   try {
     if(year) {
         if(!month && !date){
             const recordByYear = await Expense.find({year,user:id}).sort({date:1})

             if(!recordByYear) throw new ApiError(404,'','not found')

             sendFilterdRecord(req,res,recordByYear)
             
             }
     } 
 
     if(month) {
         if(!year && !date){
             const recordByMonth = await Expense.find({month,user:id}).sort({date:1})

             if(!recordByMonth) throw new ApiError(404,'','not found')
             sendFilterdRecord(req,res,recordByMonth)
             
             }
     } 
 
 
     if(date) {
         if(!month && !year){
             console.log(typeof Number(date))
            
             const recordByDate = await Expense.find({$and:[{date:{$gte:date}},{date:{$lte:31}}],user:id}).sort({date:1})

             if(!recordByData) throw new ApiError(404,'','not found')
             sendFilterdRecord(req,res,recordByDate)
             
             }
     } 
 
     if(year && month ) {
         if(!date){
             const recordByYearMonth = await Expense.find({year,month,user:id}).sort({date:1})

             if(!recordByYearMonth) throw new ApiError(404,'','not found')
             sendFilterdRecord(req,res,recordByYearMonth)
             }
     } 
 
     if(year && month && date){
         
         const recordByYearMonthDate = await Expense.find({$and:[{date:{$gte:date}},{date:{$lte:31}}],year,month,user:id}).sort({date:1,year:-1,month:-1})
         if(!recordByYearMonthDate) throw new ApiError(404,'','not found')
         sendFilterdRecord(req,res,recordByYearMonthDate)   
     }
 
   } catch (error) {
    res.status(404).json(new ApiError(404,'',error.errors))

    
   }


})




export  {expenseRouter}