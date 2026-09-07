import React, { useState, useEffect } from 'react';

const AboutManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    badge: '',
    tagline: '',
    story1: '',
    story2: '',
    phone: '',
    email: '',
    instagramLink: '',
    storeImageUrl: '',
    address: '',
    mapEmbedUrl: '',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || '',
          badge: data.badge || '',
          tagline: data.tagline || '',
          story1: data.story1 || '',
          story2: data.story2 || '',
          phone: data.phone || '',
          email: data.email || '',
          instagramLink: data.instagramLink || '',
          storeImageUrl: data.storeImageUrl || '',
          address: data.address || '',
          mapEmbedUrl: data.mapEmbedUrl || '',
        });
      }
    } catch (err) {
      console.error('Failed to load about section data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
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

      if (res.ok) {
        const result = await res.json();
        setFormData((prev) => ({ ...prev, storeImageUrl: result.url }));
        setMessage({ type: 'success', text: 'Store image uploaded successfully!' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.message || 'Image upload failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'About section updated successfully!' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.message || 'Failed to update about section' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--admin-text-muted)', padding: '2rem' }}>Loading About settings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', background: 'var(--admin-card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
      <h2 style={{ margin: '0 0 1.5rem', color: 'var(--admin-text)', fontSize: '1.4rem' }}>Edit About Section</h2>

      {message.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? '#10b98120' : '#ef444420',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#10b981' : '#ef4444'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Badge Text</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="e.g. Our Story"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Main Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="About Bajaj Associates"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Tagline</label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Premium furniture & decor..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Store / Showroom Photo</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ color: 'var(--admin-text-muted)' }}
            />
            {uploading && <span style={{ color: '#3b82f6' }}>Uploading...</span>}
          </div>
          {formData.storeImageUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <img src={formData.storeImageUrl} alt="Store preview" style={{ maxWidth: '180px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Story Paragraph 1</label>
          <textarea
            name="story1"
            rows="4"
            value={formData.story1}
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Story Paragraph 2</label>
          <textarea
            name="story2"
            rows="4"
            value={formData.story2}
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9111999271"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Instagram Profile Link</label>
          <input
            type="text"
            name="instagramLink"
            value={formData.instagramLink}
            onChange={handleChange}
            placeholder="https://www.instagram.com/singhai.harshjain"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="bajajassociates.furniture@gmail.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Showroom Address</label>
          <textarea
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'var(--admin-text)', marginBottom: '0.5rem', fontWeight: '500' }}>Google Map Embed URL (iframe src)</label>
          <input
            type="text"
            name="mapEmbedUrl"
            value={formData.mapEmbedUrl}
            onChange={handleChange}
            placeholder="https://maps.google.com/maps?q=..."
            style={inputStyle}
          />
          <small style={{ color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.25rem' }}>Paste the direct URL from Google Maps Embed iframe src attribute.</small>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #c95f1e 0%, #ae4812 100%)',
            color: '#fff',
            border: 'none',
            padding: '0.85rem 1.75rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            marginTop: '1rem',
            fontSize: '1rem',
            alignSelf: 'flex-start'
          }}
        >
          {saving ? 'Saving Changes...' : 'Save About Section'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--admin-border)',
  color: 'var(--admin-text)',
  fontSize: '0.95rem'
};

export default AboutManager;
