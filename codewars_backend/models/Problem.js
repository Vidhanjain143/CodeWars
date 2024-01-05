const mongoose=require('mongoose')

const problemSchema=mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true,
    },
    title:String,
    description:[String],
    input:String,
    output:String,
    inputTestCases:String,
    expectedOutput:String,
    constraints:[String],
})

const Easy=mongoose.model('Easy',problemSchema);
const Medium=mongoose.model('Medium',problemSchema);
const Hard=mongoose.model('Hard',problemSchema);

module.exports={Easy,Medium,Hard}