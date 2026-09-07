import React, { useState } from 'react';

const CategoryManager = ({ categories, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This might break products linked to it!')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let errMsg = 'Failed to delete category';
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errMsg = errorData.message || errorData.error || errMsg;
        } else {
          errMsg = await res.text();
        }
        throw new Error(errMsg);
      }
      refresh();
    } catch (error) {
      console.error(error);
      alert('Error deleting category: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      id: category.id,
      name: category.name,
      nameHi: category.nameHi || '',
      icon: category.icon || '',
      cover: category.cover || '',
      description: category.description || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      setFormData(prev => ({ ...prev, cover: result.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `/api/categories?id=${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errMsg = 'Failed to save category';
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errMsg = errorData.message || errorData.error || errMsg;
        } else {
          errMsg = await res.text();
        }
        throw new Error(errMsg);
      }
      
      setFormData({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      refresh();
    } catch (error) {
      console.error(error);
      alert('Error saving category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingId(null);
      setFormData({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
    } else {
      setShowForm(true);
    }
  };

  return (
    <div className="admin-card">
      <div className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--admin-text)' }}>Category Management ({categories.length})</h2>
        <button 
          onClick={toggleForm} 
          style={{ padding: '0.6rem 1.2rem', background: showForm ? '#64748b' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          {showForm ? 'Cancel' : '+ Add New Category'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--admin-text)' }}>{editingId ? 'Edit Category' : 'Create Category'}</h3>
          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Slug ID (e.g. wall-tiles)</label>
              <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})} style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Cover Image</label>
              <div style={{ border: '2px dashed var(--admin-border)', padding: '1rem', borderRadius: '6px', textAlign: 'center', background: 'var(--admin-bg)', marginBottom: '1rem' }}>
                <input type="file" onChange={handleFileUpload} accept="image/*" style={{ color: 'var(--admin-text-muted)' }} />
                {uploading && <p style={{ color: '#3b82f6', fontSize: '0.875rem', marginTop: '0.5rem' }}>Uploading to Cloudinary...</p>}
              </div>
              {formData.cover && (
                <img src={formData.cover} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-border)', marginBottom: '1rem' }} />
              )}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px', resize: 'vertical'}} />
            </div>
            <button disabled={loading} type="submit" style={{ gridColumn: 'span 2', padding: '0.8rem', background: loading ? '#94a3b8' : '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : editingId ? 'Update Category' : 'Save Category'}
            </button>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem', borderRadius: '8px 0 0 8px' }}>Icon</th>
              <th style={{ padding: '1rem' }}>ID Slug</th>
              <th style={{ padding: '1rem' }}>Display Name</th>
              <th style={{ padding: '1rem', borderRadius: '0 8px 8px 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                <td style={{ padding: '1rem', fontSize: '1.5rem' }}>{c.icon || '📁'}</td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--admin-text-muted)' }}>{c.id}</td>
                <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--admin-text)' }}>{c.name}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleEdit(c)} 
                      style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(c._id)} 
                      style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No categories found. Add some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  border: '1px solid var(--admin-border)',
  borderRadius: '6px',
  outline: 'none',
  fontSize: '0.95rem',
  background: 'var(--admin-input-bg)',
  color: 'var(--admin-text)'
};

export default CategoryManager;
