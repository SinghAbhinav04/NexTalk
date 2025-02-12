import "../../assets/styles/loginPage.css";
import { useState , useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import axios from 'axios'


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
            localStorage.removeItem('email')
            localStorage.removeItem("id")
        }
    }, [navigate]);


    const handleSubmitData=async (e)=>{
        e.preventDefault();
        try{
            console.log(email,password)
        const response = await axios.post("http://localhost:3000/auth/login",{email,password})
        console.log("sent")
        console.log(response)
        if(response.status===200||response.statusText==="OK"){
            const {token,email,id}= response.data;
            localStorage.setItem("authToken",token)

            const expirationTime = new Date().getTime()+10800000;
            localStorage.setItem("expTime",expirationTime)
            localStorage.setItem("email",email)
            localStorage.setItem("id",id)

            navigate('/home')
        }else if(response.status==409){
            window.alert("password or email wrong")
        }
        }catch(err){
            console.log(err)
        }
    }


    return (
        <div className="login-page">
            <div className="app-name">
                <span className="font-style-1">N</span>
                <span className="font-style-2">EX</span>
                <span className="font-style-3">T</span>
                <span className="font-style-2">ALK</span>
            </div>
            <div className="login-page-container">
                <div className="left-section">
                    <div className="promo-content">
                        <h1>Connecting Members,</h1>
                        <h2>Creating Memories.</h2>
                    </div>
                </div>

                <div className="right-section">
                    <div className="form-container">
                        <h2>Login</h2>
                        <form onSubmit={handleSubmitData}>
                            <input
                                type="text"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                           <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        paddingRight: '40px', // Add padding to make space for the icon
                                    }}
                                />
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '8px', // Position the icon inside the input box
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '0', // Remove extra padding for better alignment
                                        color: '#ffffff',
                                    }}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </div>

                            <button type="submit" className="login-btn">Login</button>
                        </form>
                        <p>Don't have an account? <button className="signup-link" onClick={() => navigate("/signup")}>signup here</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
