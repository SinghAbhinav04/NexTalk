const setupSocketHandlers = require("../socketHandler/socketController.js")

function initializeSocket(io){
    io.on('connection',(socket)=>{
        console.log(socket.id)
        setupSocketHandlers(io,socket)
    })
    return io
}
module.exports = initializeSocket