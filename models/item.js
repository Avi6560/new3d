const mongoose= require('mongoose');

const itemSchema= new mongoose.Schema({
    name:{type:String, trim:true},
    description:{type:String, trim:true},
    price:{type:Number, trim:true},
    images:{type:Array},
    collectionType:{type:Array}
},{timestamps:true})


module.exports=mongoose.model('Item',itemSchema)