const User = require("../models/userModel")
const UserStatus = require("../models/userStatusModel")
const jwt = require("jsonwebtoken")
//const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const JWT_SECRET = "alphabeta"



//OTP part in future
/*
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'Mailjet',
        auth: {
          user: '750f3775370154ab308c628a1072e629',
          pass: '4e04b6eb71a959b2e644588185729b2c',
        },
      });

    const mailOptions = {
        from: 'nextalkauth@gmail.com',
        to: email,
        subject: 'Your OTP for Signup',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Error sending email: ", err);
        throw new Error("Email send failed");
    }
}
*/

async function handleCreateUser(req,res){
    try{
        const {firstName,middleName,lastName,dob,username,email,password}= req.body
        
        if(!firstName||!lastName||!email||!password||!username||!dob){
            return res.status(400).json({message:"All fields are required"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({message:"User already exists"})
        }

        //const otp = generateOtp(); // Generate OTP
        //await sendOtpEmail(email, otp);

        const hashedPassword = await bcrypt.hash(password,10)

        await User.create({firstName,middleName,lastName,dob,username,email,password:hashedPassword});
        res.status(200).json({message:"User created successfully"})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}


async function handleLogin(req,res){

    try{
        const{email,password}= req.body;
        if(!email|| !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid password"})
        }

        const token = jwt.sign({id:user._id,email:user.email},JWT_SECRET,{
            expiresIn:'3h'
        })
        const id = user._id

        res.status(200).json({ message: "Login successful" ,token,email,id}); 
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function updateStatus(req,res){
    try{
        const{email,socketId}= req.body
        if(!email){
            return res.status(400).json({message:"missing email field "})
        }
        const existingUserStatus = await UserStatus.findOne({userMail:email}) 

        if(!existingUserStatus){
            const newStatusObject = new UserStatus({
                userMail:email,
                status:"online",
                socketId:socketId
            })
            await newStatusObject.save()
            return res.status(200).json({message:"Created user status object"})
        }else{
                existingUserStatus.status="online"
                existingUserStatus.socketId=socketId
                await existingUserStatus.save()
                return res.status(200).json({message:"updated"})
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

async function setStatusOff(req,res){
    try{
        const{email} = req.body
        if(!email){
            return res.status(400).json({message:"email missing"})
        }

        const user = await UserStatus.findOne({userMail:email})

        user.status="offline"
        user.socketId=""
        await user.save()
        return res.status(200).json({message:"updated"})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }
}

module.exports = {handleCreateUser,handleLogin, updateStatus,setStatusOff}