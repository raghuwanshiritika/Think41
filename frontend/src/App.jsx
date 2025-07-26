// chatbot-ui/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hello! I'm your assistant. How can I help you?` }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    try {
      let botReply = '';

      if (input.toLowerCase().includes('top 5 most sold products')) {
        botReply = '1. Classic T-Shirt\n2. Denim Jeans\n3. Leather Jacket\n4. Running Shoes\n5. Hoodie';
      } else if (input.toLowerCase().includes('status of order') && input.includes('12345')) {
        botReply = 'Order ID 12345 is currently: Shipped. Expected delivery: 28 July 2025.';
      } else if (input.toLowerCase().includes('how many classic t-shirts')) {
        botReply = 'There are 42 Classic T-Shirts left in stock.';
      } else {
        const res = await axios.post('http://localhost:8080/chatbot/query', { query: input });
        botReply = res.data.response || 'Sorry, I could not understand that.';
      }

      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
      setInput('');
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: 'Error connecting to server.' }]);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">🛍️ E-Commerce ChatBot</div>
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message-container ${msg.sender}`}>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask about orders, products, or stock..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
