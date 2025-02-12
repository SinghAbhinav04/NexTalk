import{useState} from 'react'
import ChatList from './ChatList.jsx'
import ContactList from './ContactList'
import GroupIcon from '@mui/icons-material/Group';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import "../../assets/styles/chats.css"

function Chats(){
    const[activeComponent,setActiveComponent]=useState("ChatList")
    const [activeIcon , setActiveIcon]= useState("chat")

    const renderActiveComponent=()=>{
        switch(activeComponent){
            case "ChatList":
                return <ChatList/>
            case "ContactList":
                return <ContactList/>
            default:
                return <ChatList/>
        }
    }

    return (
        <div>
            <div className='side-bar-btn-container'>
                <button onClick={(e)=>{
                    setActiveComponent("ChatList")
                    setActiveIcon("chat")
                }}
                    className={`sidebar-icon ${activeIcon=="chat"?"active":""}`}
                    >
                    <ChatOutlinedIcon/>
                </button>
                <button onClick={(e)=>{
                    e.preventDefault()
                    setActiveComponent("ContactList")
                    setActiveIcon("contact")
                }}
                    className={`sidebar-icon ${activeIcon=="contact"?"active":""}`}
                >
                    <GroupIcon/>
                </button>
            </div>
            <div className='sidebar-active-component'>
                {renderActiveComponent()}
            </div>
        </div>
    )
}

export default Chats