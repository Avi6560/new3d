const mongoose= require('mongoose');

userSchema = new mongoose.Schema({
    email:{ type: String, require:true, trim:true},
    password:{ type: String, require:true, trim:true, minLength:8},
    cnfPassword:{type:String, require:true, trim:true, minLength:8},
    isPayment:{type:Boolean, default:false},
    
},{timestamps:true})

userTokenSchema= new mongoose.Schema({
   userId:{type:String},
   token:{type:String},
   refressToken:{type:String},
   active:{type:Number, default:1},
})
const User= mongoose.model('User', userSchema);
const userToken= mongoose.model('userToken', userTokenSchema);

module.exports = {User,userToken};
