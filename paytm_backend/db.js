const mongoose=require('mongoose')
const { number } = require('zod')

mongoose.connect("mongodb://localhost:27017/paytm")

const UserSchema= new mongoose.Schema({
    username:{
        type:String, 
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const accountSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const Account=mongoose.model("Account",accountSchema)
const User=mongoose.model("User",UserSchema)



module.exports={
    User,Account
}