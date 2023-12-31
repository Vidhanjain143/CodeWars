const mongoose=require('mongoose')

const roomSchema=mongoose.Schema({
    roomId:{
        type:String,
        unique:true,
        required:true,
    },
    category:{
       type:String,
       required:true,
    },
    problems:{
        type:[Number],
    },
   
})

const Room=mongoose.model('Room',roomSchema);
module.exports=Room;