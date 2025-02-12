const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    profilePhoto: {
        type: String,
        default: null,
        validate: {
            validator: function (value) {
                return value === null || /^[a-zA-Z0-9+/=]*$/.test(value); // Checks for Base64 format
            },
            message: 'Invalid profile photo format.',
        },
    },
    firstName:{
        type:String,
        required:true
    },
    middleName:{
        type:String
    },
    lastName:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        default:"Hey there!!"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})

const User = mongoose.model('User',userModel);

module.exports= User;