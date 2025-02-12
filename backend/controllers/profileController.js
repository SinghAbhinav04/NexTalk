const ContactList = require("../models/contactListModel")
const User = require("../models/userModel")
const multer = require('multer');
const upload = multer();

async function handleProfileSearch(req,res){
    try{
        const {username} = req.query
        const users= await User.find(
            {username: { $regex: username, $options: 'i' }} // 'i' for case-insensitive search
        ).select('username firstName lastName dob email')

        if(users.length===0){
            return res.status(404).json({message:"No reault found"})
            
        }
        return res.status(200).json({ users });
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function handleContactList(req,res){
    try{
        const {id,userEmail , contactEmail}=req.body

        if(!userEmail || !contactEmail || !id){
            return res.status(400).json({message:"All fields are required"})
        }

        const existingContactList = await ContactList.findOne({userEmail})
        if(existingContactList){    
            const isContactExisting= existingContactList.contact.some(
                (contact)=>contact.userMail===contactEmail
            )

            if(isContactExisting){
                return res.status(400).json({message:"Contact already exists"})
            }

            existingContactList.contact.push({
                userId:id,
                userMail:contactEmail,
                dateAdded:new Date()
            })
            existingContactList.updatedAt=new Date();
            await existingContactList.save()

            return res.status(200).json({message:"User created successfully"})

        } else{
            const newContactList = new ContactList({
                userId:id,
                userEmail,
                contact:[
                    {
                        userMail:contactEmail,
                        dateAdded: new Date()
                    }
                ],
            })
            await newContactList.save()

            return res.status(200).json({message:"Contact added"})
        }

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function changeUsername(req,res){
    try{
        const{email, username}=req.body
        if(!email||!username){
            return res.status(400).json({message:"missing email field"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const existingUsernames = await User.find().select('username');        
        
        const isUsernameTaken = existingUsernames.some((existingUser)=>existingUser.username===username)


        if (isUsernameTaken) {
            return res.status(409).json({ message: "Username already exists" });
        }

        user.username=username;
        await user.save()
        return res.status(200).json({message:"username updated"})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function updateProfilePicture(req, res) {
    try {
        const { email, profilePhoto } = req.body;

        console.log(email)

        if (!profilePhoto) {
            return res.status(400).json({ message: 'No profile photo provided' });
        }

        // Update the user's profile photo
        const user = await User.findOne({email})
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePhoto=profilePhoto;
        await user.save() 

        res.status(200).json({
            message: 'Profile picture updated successfully',
            user: {
                email: user.email,
                username: user.username,
                profilePhoto: user.profilePhoto,
            },
        });
    } catch (err) {
        console.error('Error updating profile picture:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getProfile(req,res){
    try{
        const{email} = req.body
        if(!email){
            return res.status(400).json({message:"Email is missing!"})
        }

        const user =await User.find({email:email}).select("profilePhoto firstName lastName username email dob bio")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({message:"OK",user:user})
    }   
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

module.exports = {handleProfileSearch,handleContactList, changeUsername, getProfile, upload, updateProfilePicture }