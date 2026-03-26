import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { Send, Upload } from 'lucide-react';

export default function ReportItemForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'LOST',
    imageUrl: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;

      // If a local file is selected, upload it first
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data; 
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        reporterId: Number(localStorage.getItem('userId'))
      };
      await api.post('/items', payload);
      setFormData({ title: '', description: '', category: '', location: '', status: 'LOST', imageUrl: '' });
      if (onSuccess) onSuccess();
      alert('Item reported successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Upload size={24} color="var(--primary)" /> Report an Item
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="LOST">I Lost Something</option>
              <option value="FOUND">I Found Something</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Category</label>
            <input type="text" name="category" placeholder="e.g. Electronics, Books" value={formData.category} onChange={handleChange} required />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Item Title</label>
          <input type="text" name="title" placeholder="What is it?" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Description</label>
          <textarea name="description" placeholder="Provide distinct details (colors, brands, etc.)" value={formData.description} onChange={handleChange} rows="3" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Location (Lost/Found at)</label>
            <input type="text" name="location" placeholder="e.g. Library 2nd Floor" value={formData.location} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Image URL / Upload Image</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="text" name="imageUrl" placeholder="Image URL (OR)" value={formData.imageUrl} onChange={handleChange} style={{ flex: 1 }} disabled={!!file} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>OR</span>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} disabled={!!formData.imageUrl} style={{ flex: 1, padding: '0.55rem' }} />
            </div>
            {(file || formData.imageUrl) && (
              <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem' }}>Image attached!</p>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Submitting...' : 'Report Item'} <Send size={18} />
        </button>
      </form>
    </div>
  );
}
