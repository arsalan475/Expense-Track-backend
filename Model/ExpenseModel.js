import mongoose from "mongoose";





const ExpenseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },

    category:{
        type:String,
        required:true,
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        
    },

    record:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'record',
        
    },

    year:{
        type: Number,
        default:new Date(Date.now()).getFullYear(),
        },
    
        month:{
            type: Number,
            default:new Date().getMonth() + 1,
            },
    
            date:{
                type: Number,
                default:new Date().getDate(),
                },

                fullDate:{
                    type:String,
                    default: new Date().toDateString()
                },


                closeRecord:{
                    type: Boolean,
                    default:false
                },

                saving:{
                    type:Number,
                    default:null,
                },

                monthlyIncome:{
                    type:Number,
                    default:null,
                }
},{timestamps:true})


export const Expense = mongoose.model('Expense',ExpenseSchema)