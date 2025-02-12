const express = require("express")

const authenticateJWT = require("../middlewares/authMiddleware")
const {handleProfileSearch,handleContactList,changeUsername,getProfile, upload, updateProfilePicture } = require("../controllers/profileController")

const router = express.Router()


router.patch("/profile")
router.delete("/profile")

router.get("/search-profile",authenticateJWT,handleProfileSearch)
router.post("/add-contact",authenticateJWT,handleContactList)
router.post("/change-username",authenticateJWT,changeUsername)
router.post("/get-profile",authenticateJWT,getProfile)  
router.post('/update-picture', updateProfilePicture);


module.exports = router