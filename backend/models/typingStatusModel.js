const mongoose = require("mongoose")

const typingStatusModel = new mongoose.Schema({
    chatId: 
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'ChatRoom', required: true 
    },
    userId: 
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    isTyping: 
    { type: Boolean,
         default: false 
    },
    lastUpdated: {
         type: Date,
          default: Date.now 
        }
})

const TypingStatus = mongoose.model("TypingStatus",typingStatusModel)

module.exports=TypingStatus