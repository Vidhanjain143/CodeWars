const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    score:Number
})

const User=mongoose.model('User',userSchema)
module.exports=User;