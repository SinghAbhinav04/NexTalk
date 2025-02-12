const mongoose = require("mongoose")

function connectMongoDB(URL){
    return mongoose.connect(URL);
}

module.exports=connectMongoDB