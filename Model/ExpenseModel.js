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
        type: String,
        default:  Date
        },
    
        month:{
            type: String,
            default: Date
            },
    
            date:{
                type: String,
                default:Date
                },

                fullDate:{
                    type:String,
                    default:Date
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







ExpenseSchema.pre('save',function(next){
   
    this.date = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.fullDate = new Date().toDateString()
    next()
})
export const Expense = mongoose.model('Expense',ExpenseSchema)