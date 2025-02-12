import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import "../../assets/styles/SettingPanel.css"

function SettingPanel(){
    const navigate = useNavigate()

    const handleLogout=()=>{
        handleChangeStatus()
        localStorage.clear()
        navigate("/")
    }

      const handleChangeStatus=async ()=>{
            const email = localStorage.getItem("email")
            const response = await axios.post("http://localhost:3000/auth/logout",{email})
            if(response.status===200){
                console.log("successful")
            }
        }
        const handleThemeChange=()=>{

        }
    return(
        <div className="settings-panel">
            <span onClick={handleThemeChange}>Change Theme</span>
            <LogoutIcon onClick={handleLogout}/>
        </div>
    )
}

export default SettingPanel