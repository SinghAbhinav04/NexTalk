import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/chatbot.css';
import CloseIcon from '@mui/icons-material/Close';


function ChatBot({ setShowChatbot }) {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);


    useEffect(()=>{
        const retrieveHistory = async ()=>{
            try{
                const email = localStorage.getItem("email")
                const authToken = localStorage.getItem("authToken");

                const response = await axios.post("http://localhost:3000/home/chat/retrieve-chat-bot-history",{
                    email
                },{
                    headers: { Authorization: `Bearer ${authToken}` },

                })
                if(response.status===200){
                    const history = response.data.content.map((item) => [
                        { type: "user", content: item.query },
                        { type: "bot", content: item.response }
                    ]).flat();

                    setMessages(history);
                }
            }
            catch(err){
                console.log(err)
            }
        }
        retrieveHistory()
    },[])


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleGetChatbotResponse = async () => {
        if (!query.trim()) return;
        
        const newMessage = { type: 'user', content: query };
        setMessages(prev => [...prev, newMessage]);
        setQuery("");

        try {
            const email = localStorage.getItem("email");
            const authToken = localStorage.getItem("authToken");
            if (!email || !authToken) return;
            
            const res = await axios.post(
                "http://localhost:3000/home/chat/chatbot-query",
                { email, query },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            if (res.status === 200) {
                setMessages(prev => [...prev, { 
                    type: 'bot', 
                    content: res.data.content 
                }]);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };
    const handleCloseChat=()=>{
        setShowChatbot(false)
    }

    return (
        <div className='chat-container'>
            <div className='chat-bot-div'>
            <CloseIcon className="close-icon chatbox-close-chat" onClick={handleCloseChat} />
            </div>
            <div className='chat-messages'>
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.type}-wrapper`}>
                        {msg.type === 'bot' && <div className='bot-icon'>AI</div>}
                        <div className={`message ${msg.type}-message`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='chat-input'>
                <input
                    type="text"
                    placeholder="Type here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleGetChatbotResponse();
                    }}
                />
                <button onClick={handleGetChatbotResponse}>
                    <span>›</span>
                </button>
            </div>
        </div>
    );
}

export default ChatBot;