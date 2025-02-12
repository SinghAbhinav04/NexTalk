import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatBox from '../chat/ChatBox'
import ChatBot from '../chat/ChatBot'
import SettingPanel from '../settings/SettingPanel'
import ProfilePanel from '../profile/ProfilePanel'
import SearchProfile from '../profile/SearchProfile'
import Chats from '../chat/Chats'
import '../../assets/styles/homepage.css'
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SearchIcon from '@mui/icons-material/Search';
import { useUserContext } from '../context/UserContext'
import axios from 'axios'

function Homepage(){

    const [activeComponent,setActiveComponent]=useState('chats')
    const { selectedUser, updateSelectedUser } = useUserContext();
    const [activeIcon, setActiveIcon] = useState('chat');
    const [showChatbot, setShowChatbot] = useState(false);

    
    const navigate = useNavigate()

    useEffect(()=>{
        updateSelectedUser(null)
    },[])


  

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
        }else {
            try {
                const expirationTime = localStorage.getItem("expTime");
                const currentTime = new Date().getTime()

                if(currentTime>parseInt(expirationTime)){
                    handleChangeStatus()
                    localStorage.clear()

                    if(window.location.pathname!=='/'){

                        navigate("/")
                    }
                }
            } catch (error) {
                console.error("Invalid token:", error);
                
                localStorage.clear()

                navigate('/');
            }
        }
    }, [navigate]);

    const renderSideBar=()=>{
        switch (activeComponent){
            case 'chats':
                return <Chats/>
                case 'chatbot':
                    return <ChatBot/>
            case 'settings':
                return <SettingPanel/>
            case 'profile':
                return <ProfilePanel/>
            case 'search':
                return <SearchProfile/>
            default:
                return <ChatList/>    
        }
    }



   

    return(
        <div className='chatapp-container'>
            <div className='navbar'>
                <nav className='navbar-links'>
                    <div className='navbar-btn'>
                    <button
                        className={`icon-wrapper ${activeIcon === 'chat' ? 'active' : ''}`}
                        onClick={() =>{ setActiveIcon('chat')
                                        setActiveComponent('chats')
                        }}>
                        <ChatIcon className="icon" />
                    </button>
                    <button
                        className={`icon-wrapper ${activeIcon === 'search' ? 'active' : ''}`}
                        onClick={() =>{ setActiveIcon('search')
                                        setActiveComponent('search')
                        }}>
                        <SearchIcon className="icon" />
                    </button>
                    <button
                        className={`icon-wrapper ${activeIcon === 'chatbot' ? 'active' : ''}`}
                        onClick={() => { 
                            setActiveIcon('chatbot')
                            setShowChatbot(true)
                            updateSelectedUser(null)
                        }}>
                        <SmartToyIcon className="icon" />
                   </button>
                    <button
                        className={`icon-wrapper ${activeIcon === 'settings' ? 'active' : ''}`}
                        onClick={() =>{ setActiveIcon('settings')
                                        setActiveComponent('settings')
                        }}>
                        <SettingsIcon className="icon" />
                    </button>
                    <button
                        className={`icon-wrapper ${activeIcon === 'profile' ? 'active' : ''}`}
                        onClick={() =>{ setActiveIcon('profile')
                                        setActiveComponent('profile')
                        }}>
                        <AccountCircleIcon className="icon" />
                    </button>
                    </div>
                </nav>
            </div>
            <div className='sidebar'>
                {renderSideBar()}
            </div>
            <div className='chat-area-container'>
                {selectedUser ? (
                    <ChatBox />
                    
                ) : showChatbot ? (
                    <ChatBot setShowChatbot={setShowChatbot} />
                ) : (
                    <div className='nextalk-default'>
                    <div className="nexTalk-title"><span className='N'>N</span>ex<span className='T'>T</span>alk</div>
                    <div className="nexTalk-subtitle">Chatting app for the <span className='N'>N</span>ex<span className='T'>T</span> generation</div>
                    </div>                  
                )}
            </div>
        </div>
    )
}

export default Homepage 