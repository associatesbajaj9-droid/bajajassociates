import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import CategoryManager from './components/CategoryManager';
import ProductManager from './components/ProductManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tiles, setTiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tilesRes, catRes] = await Promise.all([
        fetch('/api/tiles'),
        fetch('/api/categories')
      ]);

      let tilesData = [];
      let categoriesData = [];

      if (!tilesRes.ok) {
        let errMsg = 'Failed to fetch products';
        const contentType = tilesRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await tilesRes.json();
          errMsg = errData.message || errData.error || errMsg;
        } else {
          errMsg = await tilesRes.text();
        }
        throw new Error(errMsg);
      } else {
        tilesData = await tilesRes.json();
      }

      if (!catRes.ok) {
        let errMsg = 'Failed to fetch categories';
        const contentType = catRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await catRes.json();
          errMsg = errData.message || errData.error || errMsg;
        } else {
          errMsg = await catRes.text();
        }
        throw new Error(errMsg);
      } else {
        categoriesData = await catRes.json();
      }

      setTiles(tilesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      alert('Error fetching admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    navigate('/admin/login');
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
        onLogout={handleLogout} 
        mobileOpen={isMobileMenuOpen}
      />
      
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--admin-text)' }}>
              {activeTab === 'dashboard' ? 'Overview Dashboard' : activeTab === 'categories' ? 'Category Management' : 'Products & Pricing'}
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Manage your furniture pieces, designs, and collections.</p>
          </div>
          
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Loading Admin Workspace...</p>
          </div>
        ) : (
          <div className="admin-content-area" style={{ animation: 'fadeIn 0.3s ease-in' }}>
            {activeTab === 'dashboard' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Products" count={tiles.length} color="#3b82f6" icon="📦" />
                <StatCard title="Product Categories" count={categories.length} color="#10b981" icon="🗂️" />
                <StatCard title="Out of Stock" count={tiles.filter(t => !t.stockStatus).length} color="#ef4444" icon="⚠️" />
              </div>
            )}

            {activeTab === 'categories' && (
              <CategoryManager categories={categories} refresh={fetchData} />
            )}

            {activeTab === 'products' && (
              <ProductManager tiles={tiles} categories={categories} refresh={fetchData} />
            )}
          </div>
        )}

        {/* Mobile Toggle Button */}
        <button 
          className="admin-mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </main>
    </div>
  );
};

const StatCard = ({ title, count, color, icon }) => (
  <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ fontSize: '2.5rem', background: `${color}15`, width: '70px', height: '70px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <h3 style={{ margin: '0.25rem 0 0', fontSize: '2rem', color: 'var(--admin-text)' }}>{count}</h3>
    </div>
  </div>
);

export default AdminDashboard;
