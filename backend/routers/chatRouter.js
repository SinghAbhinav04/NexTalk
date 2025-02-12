const express = require("express")
const authenticateJWT = require("../middlewares/authMiddleware")
const {retrieveAllContacts,createChatRoom,getChatList, getChatId,handleRoutingMessages,getChatHistory,chatbotQuery,retrieveChatbotMessageHistory}= require("../controllers/chatController")

const router = express.Router()

router.post("/contactlist",authenticateJWT,retrieveAllContacts)
router.post("/create-chat-room",authenticateJWT,createChatRoom)
router.post("/get-chat-list",authenticateJWT,getChatList)
router.post("/get-chat-id",authenticateJWT,getChatId)
router.post("/send-message",authenticateJWT,handleRoutingMessages)
router.get("/get-messages",authenticateJWT,getChatHistory)
router.post("/chatbot-query",authenticateJWT,chatbotQuery)
router.post("/retrieve-chat-bot-history",authenticateJWT,retrieveChatbotMessageHistory)

module.exports=router