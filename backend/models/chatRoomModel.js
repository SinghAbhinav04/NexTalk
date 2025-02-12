const mongoose = require("mongoose")

const chatRoomModel = new mongoose.Schema({
    chatName:{
        type:"string",
        default:null
    },
    isGroupChat:{
        type:"Boolean",
        default:false
    },
    participants:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            joinedAt:{
                type:Date,
                default:Date.now
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }

})

const ChatRoom = mongoose.model("ChatRoom",chatRoomModel)
module.exports=ChatRoom