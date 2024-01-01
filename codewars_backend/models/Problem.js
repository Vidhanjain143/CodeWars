const mongoose=require('mongoose')

const problemSchema=mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true,
    },
    category:String,
    title:String,
    description:String,
    inputTestCases:[Number,String],
    expectedOutput:[Number,String],
    constraints:[String],
})

const Problem=mongoose.model('Problem',problemSchema);
module.exports=Problem;