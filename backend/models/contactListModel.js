const mongoose = require("mongoose")

const contactListModel = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    contact:[
        {
            userMail:{
                type:String,
                required:true
            },
            dateAdded:{
                type:Date,
                default:Date.now
            }
        }
    ],
    updatedAt:{
        type:Date,
        default:Date.now
    
    }
},{timestamps:true})

const ContactList = mongoose.model("ContactList",contactListModel)

module.exports= ContactList