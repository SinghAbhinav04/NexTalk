const ContactList = require("../models/contactListModel")
const User= require("../models/userModel")
const ChatRoom = require("../models/chatRoomModel")
const UserStatus = require("../models/userStatusModel")
const Message = require("../models/messageModel")
const ChatbotMessage = require("../models/chatbotMessageModel")
const mongoose=require("mongoose")
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const GOOGLEAPI = process.env.GOOGLEAPI;


async function retrieveAllContacts(req,res){
    try{
        const {email}=req.body
        if(!email){
            return res.status(400).json({message:"All fields are required"})
        }

        const contactListUsers=await ContactList.findOne({userEmail:email})

        if(!contactListUsers){
            return res.status(404).json({messsage:"Contact list not found"})
        }

        const responseData=await Promise.all(
            contactListUsers.contact.map(async (Object)=>{
                return await User.findOne({email:Object.userMail}).select('profilePhoto username email _id')
                
            })
        )

        res.json({ contacts: responseData });

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function createChatRoom(req,res){
    try{
        const {users, chatName, isGroupChat}= req.body
        if(!users || users.length<2){
            return res.status(400).json({message:"Invalid data"})
        }

        const isExistingChatRoom = await ChatRoom.findOne({
            "participants.userId": { $all: users }, // All participants match
            
            isGroupChat: false,
        });

        if(isExistingChatRoom){
            return res.status(403).json({message:"Chat room already exists!"})
        }

        const participants= users.map((userId)=>({
            userId:userId
        }))

        const newChatRoom = new ChatRoom(
            {
                chatName:chatName||null,
                isGroupChat: isGroupChat||false,
                participants,
            }
        )
        const savedChatRoom = await newChatRoom.save()

        return res.status(200).json({message:"Chat room created"})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function getChatList(req,res){
    try{
        const {user} = req.body
        if(!user){
            return res.status(400).json({message:"Invalid request"})
        }
        const chatRooms = await ChatRoom.find().select('participants')
        const participantsIds= new Set();

        chatRooms.forEach(chatRoom=>{
            const userInChat = chatRoom.participants.some(participant => participant.userId.toString() === user);
            if(userInChat){
            chatRoom.participants.forEach(participant=>{
                if(participant.userId.toString()!==user){
                    participantsIds.add(participant.userId.toString())
                }
            })
        }
        })

        const users = await User.find({_id:{$in:Array.from(participantsIds)}}).select("profilePhoto username email _id bio")
 

        res.status(200).json(users)

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function getChatId(req, res){
    try{
        const{userId,otherUserId }= req.body
        if(!userId||!otherUserId){
            return res.status(400).json({message:"missing user id"})
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);
        const users=[userObjectId,otherUserObjectId]
        const existingChatRoom = await ChatRoom.findOne({
            "participants.userId": { $all: users }, // All participants match
            
            isGroupChat: false,
        });
            
        res.status(200).json({message:"OK",chatId:existingChatRoom._id})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function handleRoutingMessages(req,res){
    try{    
        const io =req.app.get("io")
        const {sentBy, sentTo , content, chatId}= req.body
        if(!sentBy||!sentTo||!content||!chatId){
            return res.status(400).json({message:"missing fields"})
        }

        const message = new Message({
            chatId,
            sentBy,
            sentTo,
            content,
            status:"sent"
        })
        await message.save()

        const recipient = await UserStatus.findOne({userMail:sentTo})

        if(recipient?.status==="online" && recipient.socketId){
            io.to(recipient.socketId).emit('new-message',
                message
            )
        }
        res.status(200).json({message:"message sent"})


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

async function getChatHistory(req, res){
    try {
        const { chatId } = req.query; 
        if(!chatId){
            return res.status(400).json({message:"missing chat id"})
        }
        const messages = await Message.find({ chatId }).sort({ sentAt: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: "Error fetching messages" });
    }
};

async function chatbotQuery(req,res){
    try{
        const {email , query}= req.body
        if(!email||!query){
            return res.status(400).json({message:"missing query field"})
        }
        const genAI = new GoogleGenerativeAI(GOOGLEAPI)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = query;
        const response = await model.generateContent(prompt);

        const responseText = response.response.text();

        const chatbotMessage = new ChatbotMessage({
            sentBy:email,
            query:query,
            response:responseText,
        })
        await chatbotMessage.save()

        res.status(200).json({message:"Successful",content:responseText})

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function retrieveChatbotMessageHistory(req,res){
    try{
        const{email}= req.body
        if(!email){
            return res.status(400).json({message:"email field is missing"})
        }
        const messages =await ChatbotMessage.find({sentBy:email}).select("query response")

        res.status(200).json({message:"OK",content:messages})


    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

module.exports = {retrieveAllContacts,createChatRoom, getChatList, handleRoutingMessages,getChatId,getChatHistory,chatbotQuery, retrieveChatbotMessageHistory}