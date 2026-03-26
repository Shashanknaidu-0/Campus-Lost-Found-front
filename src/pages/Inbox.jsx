import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { MessageCircle } from 'lucide-react';
import ChatBox from '../components/ChatBox';

export default function Inbox() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // { itemId, otherUserId }
  
  const currentUserId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      // Fetch all messages involving this user
      const response = await api.get(`/messages/inbox?userId=${currentUserId}`);
      const messages = response.data;
      
      // Group by distinct conversation (itemId + otherUserId)
      const convos = new Map();
      
      messages.forEach(msg => {
        const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
        const key = `${msg.itemId}-${otherUserId}`;
        
        if (!convos.has(key)) {
          convos.set(key, {
            itemId: msg.itemId,
            otherUserId: otherUserId,
            latestMessage: msg.content,
            timestamp: msg.timestamp,
            isUnread: msg.receiverId === currentUserId && !msg.isRead
          });
        }
      });
      
      setThreads(Array.from(convos.values()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Your Inbox</h2>
        <p>Manage your conversations regarding lost and found items</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading messages...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          {threads.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <MessageCircle size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              No messages yet.
            </div>
          ) : (
            threads.map((thread, idx) => (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => setActiveChat({ itemId: thread.itemId, otherUserId: thread.otherUserId })}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Item #{thread.itemId} Thread 
                    {thread.isUnread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: thread.isUnread ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {thread.latestMessage}
                  </p>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(thread.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeChat && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '350px', zIndex: 100 }}>
          <ChatBox 
            itemId={activeChat.itemId} 
            reporterId={activeChat.otherUserId} 
            onClose={() => setActiveChat(null)} 
          />
        </div>
      )}
    </div>
  );
}
