// components/ChatList.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext.jsx";
import axios from 'axios';
import "../../assets/styles/chatList.css";

function ChatList() {
    const [chatList, setChatList] = useState([]);
    const { updateSelectedUser } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatList = async () => {
            const userId = localStorage.getItem("id");
            try {
                const response = await axios.post(
                    "http://localhost:3000/home/chat/get-chat-list",
                    { user: userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setChatList(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch chat list", err);
            }
        };

        fetchChatList();
    }, []);

    const handleUserClick = (user) => {
        console.log("Changing user:", user);
        updateSelectedUser(user);
    };

    return (
        <div className="chat-list-container">
            {chatList.map((user, index) => (
                <div className="chat-profile" key={index} onClick={() => handleUserClick(user)}>
                    <img
                        src={
                            user.profilePhoto
                                ? `data:image/jpeg;base64,${user.profilePhoto}`
                                : "/default-profile.png" // Fallback to default image
                        }
                        alt={`${user.username}'s profile`}
                        className="profile-picture"
                    />
                    <span>{user.username}</span>
                </div>
            ))}
        </div>
    );
}

export default ChatList;
