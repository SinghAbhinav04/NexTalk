const express = require("express")
const {handleCreateUser,handleLogin, updateStatus,setStatusOff}= require("../controllers/authController")

const router = express.Router()

router.post("/login",handleLogin)
router.post("/signup",handleCreateUser)
router.post("/status",updateStatus)
router.post("/logout",setStatusOff)

module.exports = router