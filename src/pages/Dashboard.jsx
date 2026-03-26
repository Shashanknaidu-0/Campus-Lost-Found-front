import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Search, MapPin, Tag } from 'lucide-react';
import ChatBox from '../components/ChatBox';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // { itemId, reporterId }

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMatchProbColor = (prob) => {
    if (!prob) return 'prob-low';
    if (prob > 75) return 'prob-high';
    if (prob > 40) return 'prob-med';
    return 'prob-low';
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Campus Dashboard</h2>
          <p>Browse reported lost and found items across campus</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading items...</div>
      ) : (
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card glass-panel">
              <span className={`item-badge badge-${item.status.toLowerCase()}`}>
                {item.status}
              </span>
              
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
              )}
              
              <h3 style={{ fontSize: '1.25rem' }}>{item.title}</h3>
              <p style={{ marginBottom: '1rem', flex: 1 }}>{item.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Tag size={16} /> <span>{item.category || 'General'}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MapPin size={16} /> <span>{item.location}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                {item.reporterId !== Number(localStorage.getItem('userId')) ? (
                  <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setActiveChat({ itemId: item.id, reporterId: item.reporterId })}>
                    Message Finder/Loser
                  </button>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reported by you</span>
                )}
                
                {item.matchProbability > 0 && (
                  <span className={getMatchProbColor(item.matchProbability)} style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {item.matchProbability.toFixed(1)}% Match!
                  </span>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No items reported yet.
            </div>
          )}
        </div>
      )}

      {activeChat && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '350px', zIndex: 100 }}>
          <ChatBox 
            itemId={activeChat.itemId} 
            reporterId={activeChat.reporterId} 
            onClose={() => setActiveChat(null)} 
          />
        </div>
      )}
    </div>
  );
}
