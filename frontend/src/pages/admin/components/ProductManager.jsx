import React, { useState } from 'react';

const ProductManager = ({ tiles, categories, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', imageUrl: '', publicId: '', stockStatus: true, images: [] });
  const [uploading, setUploading] = useState(false);

  const openForm = (tile = null) => {
    setEditingTile(tile);
    if(tile) setFormData(tile);
    else setFormData({ name: '', price: '', category: '', description: '', imageUrl: '', publicId: '', stockStatus: true, images: [] });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    await fetch(`/api/tiles?id=${id}`, { method: 'DELETE' });
    refresh();
  };

  const handleToggleStock = async (tile) => {
    await fetch(`/api/tiles?id=${tile._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockStatus: !tile.stockStatus }),
    });
    refresh();
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        return await res.json();
      });

      const results = await Promise.all(uploadPromises);
      
      if (editingTile) {
        setFormData({ ...formData, imageUrl: results[0].url, publicId: results[0].public_id });
      } else {
        const newImages = results.map(r => ({ imageUrl: r.url, publicId: r.public_id }));
        setFormData({ ...formData, images: [...(formData.images || []), ...newImages] });
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTile) {
        const res = await fetch(`/api/tiles?id=${editingTile._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update product');
      } else {
        const imagesToCreate = formData.images && formData.images.length > 0 
          ? formData.images 
          : [{ imageUrl: formData.imageUrl, publicId: formData.publicId }];
          
        if (!imagesToCreate[0].imageUrl) {
          alert('Please upload at least one image');
          return;
        }

        const createPromises = imagesToCreate.map(img => {
          return fetch('/api/tiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              imageUrl: img.imageUrl,
              publicId: img.publicId
            }),
          });
        });

        const responses = await Promise.all(createPromises);
        const failed = responses.filter(r => !r.ok);
        if (failed.length > 0) throw new Error(`Failed to create ${failed.length} products`);
      }

      refresh();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error saving product: ' + err.message);
    }
  };

  
  return (
    <div className="admin-card">
      <div className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--admin-text)' }}>Products Catalogue ({tiles.length})</h2>
        <button 
          onClick={() => openForm()}
          style={{ padding: '0.6rem 1.2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          + Add New Product
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', color: 'var(--admin-text)' }}>
              {editingTile ? 'Edit Product' : 'Create New Product'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
              </div>
              
              <div>
                <label style={labelStyle}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} required>
                  <option value="" style={{ background: 'var(--admin-card-bg)', color: 'var(--admin-text)' }}>Select a Category</option>
                  {categories.map(c => <option key={c.id} value={c.id} style={{ background: 'var(--admin-card-bg)', color: 'var(--admin-text)' }}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Availability Status</label>
                <select value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} required>
                  <option value="" style={{ background: 'var(--admin-card-bg)', color: 'var(--admin-text)' }}>Select Status</option>
                  <option value="Available" style={{ background: 'var(--admin-card-bg)', color: 'var(--admin-text)' }}>Available</option>
                  <option value="Available on Order" style={{ background: 'var(--admin-card-bg)', color: 'var(--admin-text)' }}>Available on Order</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px'}} />
              </div>

              <div>
                <label style={labelStyle}>Product Image(s) {editingTile ? '' : '(Select multiple files for bulk creation)'}</label>
                <div style={{ border: '2px dashed var(--admin-border)', padding: '1rem', borderRadius: '6px', textAlign: 'center', background: 'var(--admin-bg)' }}>
                  <input type="file" multiple={!editingTile} onChange={handleFileUpload} accept="image/*" style={{ color: 'var(--admin-text-muted)' }} />
                  {uploading && <p style={{ color: '#3b82f6', fontSize: '0.875rem', marginTop: '0.5rem' }}>Uploading to Cloudinary...</p>}
                </div>
                {editingTile && formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginTop: '1rem', border: '1px solid var(--admin-border)' }} />
                )}
                {!editingTile && formData.images && formData.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
                    {formData.images.map((img, idx) => (
                      <img key={idx} src={img.imageUrl} alt={`Preview ${idx}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-border)' }} />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '0.8rem', background: uploading ? '#94a3b8' : '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Product
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.8rem', background: 'var(--admin-bg)', color: 'var(--admin-text)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {tiles.map(tile => (
          <div key={tile._id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--admin-border)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', background: 'var(--admin-card-bg)' }}>
            <div style={{ position: 'relative', height: '200px' }}>
              <img src={tile.imageUrl} alt={tile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: tile.stockStatus ? '#10b981' : '#ef4444', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {tile.stockStatus ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            
            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--admin-text)' }}>{tile.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>
                <span style={{ background: 'var(--admin-bg)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{tile.category}</span>
                <strong style={{ color: 'var(--admin-text)' }}>{tile.price}</strong>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                <button onClick={() => openForm(tile)} style={{ flex: '1 1 60px', ...actionBtnStyle, background: '#3b82f6', color: '#fff' }}>
                  Edit
                </button>
                <button onClick={() => handleToggleStock(tile)} style={{ flex: '1 1 60px', ...actionBtnStyle, background: '#f59e0b', color: '#fff' }}>
                  Stock
                </button>
                <button onClick={() => handleDelete(tile._id)} style={{ flex: '1 1 60px', ...actionBtnStyle, background: '#ef4444', color: '#fff' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '0.6rem', border: '1px solid var(--admin-border)', borderRadius: '6px', outline: 'none', background: 'var(--admin-input-bg)', color: 'var(--admin-text)' };
const actionBtnStyle = { padding: '0.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.2s' };

export default ProductManager;
