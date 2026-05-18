import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there! How's it going?", senderId: targetUserId, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 2, text: "Hi! I'm doing great, just working on a new project. How about you?", senderId: 'me', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 3, text: "Same here. I saw your recent post about the tech stack, looks very interesting!", senderId: targetUserId, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(`/api/user/${targetUserId}`);
        if (res.data.user) {
          setTargetUser(res.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch target user", err);
      }
    };
    if (targetUserId) {
      fetchTargetUser();
    }
  }, [targetUserId]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      text: newMessage,
      senderId: 'me',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMsgObj]);
    setNewMessage("");

    // Simulate a reply for demonstration purposes of UI
    setTimeout(() => {
      const replyObj = {
        id: Date.now() + 1,
        text: "That's awesome! Let's collaborate soon. 😊",
        senderId: targetUserId,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, replyObj]);
    }, 2000);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <button 
            onClick={() => navigate(-1)} 
            style={{ 
              background: 'transparent', 
              color: 'var(--text-secondary)', 
              marginRight: '1rem', 
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ←
          </button>
          <div>
            <h3>{targetUser ? targetUser.name : `User ${targetUserId ? targetUserId.slice(-4) : ""}`}</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div 
                key={msg.id} 
                className={`message-bubble ${isMe ? 'message-sent' : 'message-received'}`}
              >
                {msg.text}
                <span className="message-time" style={{ color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!newMessage.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
