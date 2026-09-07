import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, onLogout, mobileOpen }) => {
  const navigate = useNavigate();
  
  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #333' }}>
        <h2 style={{ margin: 0, color: '#D4A64A', fontSize: '1.5rem', fontWeight: 'bold' }}>Bajaj Admin</h2>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['dashboard', 'categories', 'products', 'about'].map((tab) => (
            <li key={tab}>
              <button 
                onClick={() => setActiveTab(tab)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem 1.5rem',
                  background: activeTab === tab ? '#4A2B1B' : 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#D4A64A' : '#D9C2A8',
                  borderLeft: activeTab === tab ? '4px solid #f5a623' : '4px solid transparent',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
              >
                {tab === 'about' ? 'About Section' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={{ padding: '1rem' }}>
        <button 
          onClick={onLogout}
          style={{ width: '100%', padding: '0.8rem', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
