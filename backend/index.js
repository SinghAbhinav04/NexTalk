const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const initializeSocket = require("./socketSetup/socketInitializer.js")
const cors = require("cors")
require('dotenv').config();
const MONGODBURL = process.env.MONGODBURL;

const connectMongoDB = require("./connection.js")
const router = require("./routers/authRouter.js")
const userRouter = require("./routers/userRouter.js")
const chatRouter = require("./routers/chatRouter.js")

const app = express()

app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization'],  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static('uploads'));

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: '*', 
        methods: ['GET', 'POST','PUT','DELETE'],
        allowedHeaders: ['Content-Type'],
    }
})

initializeSocket(io)

app.set("io",io)

connectMongoDB(MONGODBURL)
.then(()=>{
    console.log("Mongo DB connected")
})
.catch((err)=>{
    console.log(err)
})

app.use("/auth",router)
app.use("/home/profile",userRouter)
app.use("/home/chat",chatRouter)
app.get("/",(req,res)=>{
    res.send("hey")
})



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

