import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../assets/styles/ProfilePanel.css";
import DefaultUserImage from '../../assets/default-user.png'; // Add a default user image

function ProfilePanel() {
    const [user, setUser] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.post("http://localhost:3000/home/profile/get-profile", {
                    email,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Error details:", error.response || error);
            }
        };
        getProfile();
    }, [email, token]);

    const userProfile = user[0] || {};

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1]; // Extract Base64 string
                setProfilePhoto(base64String);
            };
            reader.readAsDataURL(file);
        }
    };


 const updateProfilePhoto = async () => {
        if (!profilePhoto) {
            alert('Please select a file');
            return;
        }

        try {
            const email = localStorage.getItem("email")
            const response = await axios.post(
                "http://localhost:3000/home/profile/update-picture",
                { profilePhoto, email }, // Sending Base64 string
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert('Profile picture updated successfully');
                window.location.reload();
            }
        } catch (err) {
            console.error('Error updating profile photo:', err.response || err);
        }
    };

    return (
        <div className="profile-panel">
            <div className="user-profile">
                <img
                    src={
                        userProfile.profilePhoto
                            ? `data:image/png;base64,${userProfile.profilePhoto}`
                            : DefaultUserImage
                    }
                    alt="Profile"
                    className="profile-photo"
                />
                <div className="file-upload">
                    <label htmlFor="file-input" className="custom-file-label">
                        Choose a file
                    </label>
                    <input 
                        id="file-input" 
                        type="file" 
                        onChange={handleProfilePhotoChange} 
                    />
                </div>                
                <button onClick={updateProfilePhoto}>Update Profile Picture</button>
                <div>First Name: {userProfile.firstName || 'Loading...'}</div>
                <div>Last Name: {userProfile.lastName || 'Loading...'}</div>
                <div>Username: {userProfile.username || 'Loading...'}</div>
                <div>Email: {userProfile.email || 'Loading...'}</div>
                <div>DOB: {userProfile.dob || 'Loading...'}</div>
                <div>Bio:{userProfile.bio||'Loading...'}</div>
            </div>
        </div>
    );
}

export default ProfilePanel;
