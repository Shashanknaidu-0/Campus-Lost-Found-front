import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import { Send, X } from 'lucide-react';

export default function ChatBox({ itemId, reporterId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = Number(localStorage.getItem('userId'));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchThread();
    const interval = setInterval(fetchThread, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [itemId, reporterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchThread = async () => {
    try {
      const response = await api.get(`/messages/thread?itemId=${itemId}&user1=${currentUserId}&user2=${reporterId}`);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const payload = {
        itemId,
        senderId: currentUserId,
        receiverId: reporterId,
        content: newMessage
      };
      await api.post('/messages', payload);
      setNewMessage('');
      fetchThread();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="glass-panel chat-container animate-fade-in" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(99, 102, 241, 0.1)' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Chat</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: 'auto' }}>
            Start the conversation...
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
              {msg.content}
              <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: msg.senderId === currentUserId ? 'right' : 'left' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="chat-input-area">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
