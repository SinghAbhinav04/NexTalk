import "../../assets/styles/signupPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import image1 from '../../assets/image4.jpeg';
import image3 from '../../assets/image9.jpeg';

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(true);  
    const [OTPVerificationPopup, setOTPVerificationPopup] = useState(false);
    const [otp, setOtp] = useState("");
    const [actualOtp, setActualOtp] = useState("");
    const [currentImage, setCurrentImage] = useState(0);


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const expiration = localStorage.getItem('expTime');
        const currentTime = new Date().getTime();

        if (token && expiration && currentTime < parseInt(expiration)) {
            if (window.location.pathname !== '/home') {
                navigate('/home');
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem("id");
            localStorage.removeItem("email");
        }
    }, [navigate]);

    const handleSubmitData = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setIsPasswordValid(false); 
            return;
        }

        try {
            const data = {
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                dob: dob,
                username: username,
                email: email,
                password: password
            };

            const response = await axios.post("http://localhost:3000/auth/signup", data);
            setActualOtp(response.data.otp);  // Store the actual OTP for verification
            setOTPVerificationPopup(true);    // Show OTP input field
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    const handleOTPVerification = () => {
        if (otp === actualOtp) {
            alert("OTP Verified!");
        } else {
            alert("Invalid OTP, please try again.");
        }
    };


    const images = [image1, image3];

    console.log('Image paths:', {
        image1: image1, 
        image3: image3
    });
    
        useEffect(() => {
            const timer = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % images.length);
                console.log('Current Image Index:', currentImage);
            }, 5000);
    
            return () => clearInterval(timer);
        }, [images]);
    
    

    return (
        <div className="signup-page">
            <div className="app-name">
                <span className="font-style-1">N</span>
                <span className="font-style-2">EX</span>
                <span className="font-style-3">T</span>
                <span className="font-style-2">ALK</span>
            </div>
            <div className="signup-page-container">
                <div className="image-slider" style={{height: '80vh', width: '35vw'}}>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            style={{
                                display: currentImage === index ? 'block' : 'none',
                                width: '100%', 
                                height: '100%',
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                            }}
                        />
                    ))}
                </div>
                <div className="right-section">
                    <div className="form-container">

                        {/* otp part in future
                        {OTPVerificationPopup && (
                            <div>
                                <span>Enter the OTP sent to your email:</span>
                                <input 
                                    type="text" 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleOTPVerification();
                                        }
                                    }}
                                />
                                <button onClick={handleOTPVerification}>Verify OTP</button>
                            </div>
                        )}
                    */}
                        
                        <h2>Signup</h2>
                        <form onSubmit={handleSubmitData}>
                            <div className="name-row">
                                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <input type="text" placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setIsPasswordValid(e.target.value.length >= 8); }}
                                    style={{ borderColor: !isPasswordValid ? 'red' : '' }}
                                />
                                <IconButton className="visibility-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </div>
                            <button type="submit" className="signup-btn">Signup</button>
                            <p>Already have an account? <button className="login-link" onClick={() => navigate("/")}>Login here</button></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
