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
    contestStarted: {
        type: Boolean,
        default: false, // Initially, the contest has not started
    },
    startTime: {
    type: Date, // Stores the timestamp when the contest starts
    default: null,
    },

})

const Room=mongoose.model('Room',roomSchema);
module.exports=Room;