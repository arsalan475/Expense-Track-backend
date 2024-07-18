
async function  sendFilterdRecord(req,res,data){

    try{
     return   res.status(200).json({sucess:true,data})
     }catch(error){
      return  res.status(400).json({sucess:false,message:error.message})
     }


}


export default sendFilterdRecord;