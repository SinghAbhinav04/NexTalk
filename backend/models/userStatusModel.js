const mongoose = require("mongoose")

const UserStatusModel = new mongoose.Schema({
    userMail:{
        type:String,
        required:true
    },
     status:{
            type:String,
            default:"offline",
            required:true
        },
    socketId:{
        type:String,
        deafult:""
    }
})

const UserStatus= mongoose.model("UserStatus",UserStatusModel)

module.exports=UserStatus