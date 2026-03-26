import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, MessageCircle } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="navbar glass-panel">
      <Link to="/dashboard" className="nav-brand">
        Campus L&F
      </Link>
      
      <div className="nav-links">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, {username}</span>
        
        <Link to="/inbox" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none' }}>
          <MessageCircle size={16} /> Inbox
        </Link>
        <Link to="/report" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <PlusCircle size={16} /> Report
        </Link>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}
