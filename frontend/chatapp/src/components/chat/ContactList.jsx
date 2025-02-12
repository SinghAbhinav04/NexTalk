// components/ContactList.js
import { useState, useEffect } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import"../../assets/styles/chatList.css"
function ContactList() {
    const [contactList, setContactList] = useState([]);
    const [error, setError] = useState("");
    const [popupProfile, setPopupProfile] = useState(null);

    const handleUserClick = (user) => {
        setPopupProfile(user);
    };

    const handleClosePopup = () => {
        setPopupProfile(null);
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const email = localStorage.getItem("email");
                if (!email) {
                    setError("Email not found in local storage.");
                    return;
                }

                const response = await axios.post(
                    "http://localhost:3000/home/chat/contactlist",
                    { email },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );

                if (response.data.contacts) {
                    setContactList(response.data.contacts);
                } else {
                    setError("No contacts found");
                }
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch contact list. Please try again."
                );
            }
        };

        fetchContacts();
    }, []);

    const handleCreateChatRoom = async () => {
        const userId = localStorage.getItem("id");
        const users = [userId, popupProfile._id];
        try {
            await axios.post(
                "http://localhost:3000/home/chat/create-chat-room",
                { users },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
        } catch (err) {
            console.error("Failed to create chat room", err);
        }
    };

    return (
        <div className="chat-list-container">
            {error && <p className="error-message">{error}</p>}
            <div className="contact-profile">
                {contactList.length > 0 ? (
                    contactList.map((user, index) => (
                        <div
                            key={index}
                            onClick={() => handleUserClick(user)}
                            className="chat-profile"
                        >
                            <img
                                src={
                                    user.profilePhoto
                                        ? `data:image/jpeg;base64,${user.profilePhoto}`
                                        : "/default-profile.png"
                                }
                                
                                className="profile-picture"
                            />
                            <span>{user.username}</span>
                        </div>
                    ))
                ) : (
                    <p>No contacts found.</p>
                )}
            </div>
            {popupProfile && (
                <>
                    <div className="popup">
                        <div className="popup-header">
                            <img
                                src={
                                    popupProfile.profilePhoto
                                        ? `data:image/jpeg;base64,${popupProfile.profilePhoto}`
                                        : "/default-profile.png"
                                }
                                alt={`${popupProfile.username}'s profile`}
                                className="profile-picture"
                            />
                            <h3>{popupProfile.username}</h3>
                            <CloseIcon className="close-icon" onClick={handleClosePopup} />
                        </div>
                        <button onClick={handleCreateChatRoom} className="icon-wrapper">
                            <PersonAddIcon className="icon" /> Create chat
                        </button>
                    </div>
                    <div className="overlay" onClick={handleClosePopup} />
                </>
            )}
        </div>
    );
}

export default ContactList;
