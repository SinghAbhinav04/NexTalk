const mongoose = require("mongoose")

const messageModel = new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChatRoom",
        required:true
    },
    sentBy:{
        type:"string",
        required:true
    },
    sentTo:{
        type:"string",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    sentAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:"string",
        required:true,
        default:"sent"
    },
    seenAt:{
        type:Date,
        default:null
    }
})

const Message= mongoose.model("Message", messageModel)

module.exports = Message