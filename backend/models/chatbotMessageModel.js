const mongoose = require("mongoose")

const chatbotMessageModel = new mongoose.Schema({
    sentBy:{
        type:"string",
        required:true
    },
    query:{
        type:String,
        required:true
    },
    response:{
        type:String,
        required:true
    },
    sentAt:{
        type:Date,
        default:Date.now
    },
    
})

const ChatbotMessage= mongoose.model("ChatbotMessage", chatbotMessageModel)

module.exports = ChatbotMessage