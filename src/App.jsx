import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import ReportItemForm from './components/ReportItemForm';

import Inbox from './pages/Inbox';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/inbox" element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        } />
        
        <Route path="/report" element={
          <ProtectedRoute>
            <div className="container" style={{ maxWidth: '800px' }}>
              <ReportItemForm onSuccess={() => window.location.href='/dashboard'} />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
