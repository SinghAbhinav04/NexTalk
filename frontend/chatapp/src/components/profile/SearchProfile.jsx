import { useState } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import '../../assets/styles/searchProfile.css'

function SearchProfile() {
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState([]);
  const [popupProfile, setPopupProfile] = useState(null);

  const handleProfileSearch = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3000/home/profile/search-profile', {
        params: { username },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserList(response.data.users);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserClick = (user) => {
    setPopupProfile(user);
  };

  const handleClosePopup = () => {
    setPopupProfile(null);
  };

  const handleAddToContact = async () => {
    try{
        console.log(popupProfile.email)
        const contactEmail = popupProfile.email;
        const userEmail = localStorage.getItem("email")
        const id = popupProfile._id

        const response = await axios.post("http://localhost:3000/home/profile/add-contact",{
            id:id,
            userEmail:userEmail,
            contactEmail:contactEmail
        } ,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        }
    )

        if(response.status===200){
            alert("user added successfully")
        }
    }catch(err){
        console.log(err)
    }
  };

  return (
    <div className="profile-search">
      <div className='profile-search-div'>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key==='Enter'){
            handleProfileSearch()
          }
        }}
        placeholder="Search for a user"
        className="search-input"
      />
      <button onClick={handleProfileSearch} className="icon-wrapper">
      <SearchIcon className="icon" />
      </button>
      </div>
      <div className="result-list">
        {userList.map((user) => (
          <div
            className="profile"
            key={user._id}
            onClick={() => handleUserClick(user)}
          >
            {user.username}
          </div>
        ))}
      </div>
      {popupProfile && (
        <>
          <div className="popup">
            <div className="popup-header">
              <h3>{popupProfile.username}</h3>
              <CloseIcon className="close-icon" onClick={handleClosePopup} />
            </div>
            <div className="popup-body">
              <p><strong>Name:</strong> {popupProfile.firstName} {popupProfile.lastName}</p>
              <p><strong>Date of Birth:</strong> {popupProfile.dob}</p>
            </div>
            <button onClick={handleAddToContact} className="icon-wrapper">
                <PersonAddIcon className='icon' />
            </button>
          </div>
          <div className="overlay" onClick={handleClosePopup} />
        </>
      )}
    </div>
  );
}

export default SearchProfile;
