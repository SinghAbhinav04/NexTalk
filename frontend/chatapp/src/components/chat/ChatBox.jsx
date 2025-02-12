import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import "../../assets/styles/chatbox.css";
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ChatBox() {
    const { selectedUser, updateSelectedUser } = useUserContext();
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const [isChatOptionsPoppedup, setIsChatOptionsPoppedup] = useState(false);
    const [isSelectedUserProfileOpen, setIsSelectedUSerProfileOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const currentUserEmail = localStorage.getItem('email');
    const currentUserId = localStorage.getItem('id');

    // Helper function to format date for grouping
    const formatDateForGrouping = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const messageDate = new Date(date);
        
        // Reset time portion for comparison
        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        messageDate.setHours(0, 0, 0, 0);

        if (messageDate.getTime() === today.getTime()) {
            return "Today";
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(message => {
            if (!message.timeStamp) return; // Skip messages without timestamp
            const date = formatDateForGrouping(message.timeStamp);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(newSocket.id);
            updateStatus(newSocket.id);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!selectedUser) {
                setMessages([]);
                return;
            }
            setMessages([]);

            const chatId = await getChatId();
            if (!chatId) return;

            try {
                const response = await axios.get(`http://localhost:3000/home/chat/get-messages`, {
                    params: { chatId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setMessages(response.data.map(msg => ({
                    content: msg.content,
                    id: msg.sentBy === currentUserEmail ? socket?.id : null,
                    sent: msg.sentBy === currentUserEmail,
                    timeStamp: msg.sentAt,
                })));
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();
    }, [selectedUser]);

    useEffect(() => {
        if (!socket || !selectedUser) return;

        socket.emit('join', { email: currentUserEmail, id: currentUserId });

        socket.on('new-message', (message) => {
            console.log('New message received:', message);
            const newMessage = {
                content: message.content,
                id: socket.id,
                sent: false,
                timeStamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, newMessage]);
        });

        return () => {
            socket.off('new-message');
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const getChatId = async () => {
        if (!selectedUser) return;
        try {
            const response = await axios.post("http://localhost:3000/home/chat/get-chat-id", {
                userId: currentUserId,
                otherUserId: selectedUser._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            return response.data.chatId;
        } catch (error) {
            console.error("Error getting chat ID:", error);
            return null;
        }
    };

    const updateStatus = async (socketId) => {
        if (!socketId) return;
        try {
            await axios.post("http://localhost:3000/auth/status", {
                email: currentUserEmail,
                socketId: socketId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleSubmitMessage = async () => {
        if (inputValue.trim() && socket && selectedUser) {
            const messageData = {
                content: inputValue,
                id: socket.id,
                sent: true,
                timeStamp: new Date().toISOString()
            };
            socket.emit('user-message', inputValue);
            setMessages(prev => [...prev, messageData]);
            setInputValue("");

            const chatId = await getChatId();
            if (chatId) {
                try {
                    await axios.post("http://localhost:3000/home/chat/send-message", {
                        sentBy: currentUserEmail,
                        sentTo: selectedUser.email,
                        content: inputValue,
                        chatId: chatId,
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    });
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            }
        }
    };

    const handleShowChatOptions = () => {
        setIsChatOptionsPoppedup(!isChatOptionsPoppedup);
    };

    const handleCloseChat = () => {
        updateSelectedUser(null);
    };

    const handleShowUserProfile = () => {
        setIsSelectedUSerProfileOpen(!isSelectedUserProfileOpen);
    };

    const convertToIST = (utcDate) => {
        if (!utcDate) return '';
        const date = new Date(utcDate);
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const istHours = (utcHours + 5 + Math.floor((utcMinutes + 30) / 60)) % 24;
        const istMinutes = (utcMinutes + 30) % 60;
        const formattedHours = String(istHours).padStart(2, '0');
        const formattedMinutes = String(istMinutes).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    };

    return (
        <div className="chat-box-container">
            <div className='chat-box-profile'>
                <img
                    src={
                        selectedUser.profilePhoto
                            ? `data:image/jpeg;base64,${selectedUser.profilePhoto}`
                            : "/default-profile.png"
                    }
                    alt={`${selectedUser.username}'s profile`}
                    className="profile-picture"
                />
                {selectedUser.username}
                
                <div className='chat-options'>
                        <MoreVertIcon onClick={handleShowChatOptions} className='more-vert-icon' />
                        {isChatOptionsPoppedup && (
                            <div className='chat-options-popup'>
                                <div>Block</div>
                                <CloseIcon className="close-icon" onClick={handleCloseChat} />
                            
                            </div>
                        )}
                </div>
            </div>
            <div className="messages">
                {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
                    <div key={date} className="message-group">
                        <div className="date-separator">
                            <span className="date-text">{date}</span>
                        </div>
                        {dateMessages.map((message, index) => (
                            <div key={index} className={`message ${message.sent ? 'sent' : 'received'}`}>
                                <span className="message-content">{message.content}</span>
                                <span className="message-time">{convertToIST(message.timeStamp)}</span>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {isEmojiPickerOpen && (
                <div className="emoji-picker-container">
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji) => {
                            setInputValue((prev) => prev + emoji.native);
                            setIsEmojiPickerOpen(false);
                        }}
                        className="emoji-picker"
                    />
                </div>
            )}
            <div className="input-field">
                <EmojiEmotionsIcon
                    onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                    className="emoji-icon"
                />
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmitMessage();
                        }
                    }}
                    placeholder="Type a message..."
                />
                <button onClick={handleSubmitMessage}>
                    <SendIcon />
                </button>
            </div>
        </div>
    );
}

export default ChatBox;