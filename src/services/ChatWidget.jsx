import React, { useState } from 'react';
import { sendChatMessage } from '../services/api';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! I can help with your account status. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Add User Message
        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // 2. Get AI Response
            const reply = await sendChatMessage(userMsg.text);
            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={chatWindowStyle}>
                    <div style={headerStyle}>
                        <span>🤖 AI Assistant</span>
                        <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>X</button>
                    </div>
                    
                    <div style={messagesAreaStyle}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ 
                                textAlign: msg.sender === 'user' ? 'right' : 'left',
                                margin: '5px 0' 
                            }}>
                                <span style={msg.sender === 'user' ? userBubble : botBubble}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                        {loading && <div style={{color: '#888', fontSize: '12px'}}>Thinking...</div>}
                    </div>

                    <div style={inputAreaStyle}>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            style={inputStyle}
                        />
                        <button onClick={handleSend} style={sendBtnStyle}>➤</button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} style={floatBtnStyle}>
                    💬 Help
                </button>
            )}
        </div>
    );
};

// Styles
const chatWindowStyle = { width: '300px', height: '400px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const headerStyle = { backgroundColor: '#007bff', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' };
const messagesAreaStyle = { flex: 1, padding: '10px', overflowY: 'auto', backgroundColor: '#f9f9f9' };
const inputAreaStyle = { padding: '10px', borderTop: '1px solid #eee', display: 'flex' };
const userBubble = { backgroundColor: '#007bff', color: 'white', padding: '8px 12px', borderRadius: '15px 15px 0 15px', display: 'inline-block', fontSize: '14px' };
const botBubble = { backgroundColor: '#e9ecef', color: '#333', padding: '8px 12px', borderRadius: '15px 15px 15px 0', display: 'inline-block', fontSize: '14px' };
const inputStyle = { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd', outline: 'none' };
const sendBtnStyle = { marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#007bff' };
const closeBtnStyle = { background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const floatBtnStyle = { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' };

export default ChatWidget;