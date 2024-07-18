import express, { Router } from 'express'
import mongoose from 'mongoose';
import {expenseRouter} from './Routes/expense.js';
import cors from 'cors'

import {userRouter} from './Routes/user.js';
import cookieParser from 'cookie-parser';
import { recordRouter } from './Routes/record.js';


import dotenv from 'dotenv'


dotenv.config({
    path:'.env'
})

const app = express()

app.use(cors(
    {
        origin: 'http://localhost:5173',
        
        credentials:true,
    }
))

app.use(express.json())

app.use(cookieParser())


const port = process.env.PORT || 8000;
const mongo_uri = process.env.MONGO_URI


app.use(userRouter)
app.use(expenseRouter)
app.use(recordRouter)

mongoose.connect(mongo_uri,{
    dbName:'ExpenseTracker'
}).then(()=> {
    console.log('connected to database')
    app.listen(port,()=> console.log('server is runing',port))
}).catch((error)=> {
    console.log(error.message)
    
})

