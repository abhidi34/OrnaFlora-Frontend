import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './Account.css';

export default function Account() {
  const navigate = useNavigate();
  const email = localStorage.getItem('currentUser');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (!email) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user from localStorage
        const userJson = localStorage.getItem('user');
        const currentUser = userJson ? JSON.parse(userJson) : null;
        
        if (currentUser) {
          setUser(currentUser);
          setFormData({ 
            name: currentUser.name || '', 
            email: currentUser.email || email, 
            phone: currentUser.phone || '' 
          });

          // Fetch orders for this user
          try {
            const ordersData = await apiService.getOrders(currentUser.id);
            setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data || []);
          } catch (err) {
            console.error('Failed to fetch orders:', err);
            setOrders([]);
          }

          // Fetch addresses for this user
          try {
            const addressesData = await apiService.getAddresses(currentUser.id);
            setAddresses(Array.isArray(addressesData) ? addressesData : addressesData.data || []);
          } catch (err) {
            console.error('Failed to fetch addresses:', err);
            setAddresses([]);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, navigate]);

  async function handleSaveProfile() {
    if (!user) return;
    
    try {
      const response = await apiService.updateUser(user.id, {
        name: formData.name,
        phone: formData.phone
      });
      
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert(`Failed to update profile: ${err.message}`);
    }
  }

  function getInitials(name) {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  if (!user) return <div style={{ padding: '20px', textAlign: 'center' }}>User not found</div>;

  return (
    <div className="account-page">
      <div className="account-header">
        <div className="profile-hero">
          <div className="profile-pic">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">{getInitials(user.name)}</div>
            )}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{email}</p>
          </div>
        </div>
      </div>

      <div className="account-content">
        <div className="account-tabs">
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            📦 My Orders
          </button>
          <button className={activeTab === 'addresses' ? 'active' : ''} onClick={() => setActiveTab('addresses')}>
            📍 My Addresses
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            👤 My Profile
          </button>
        </div>

        <div className="account-body">
          {/* My Orders */}
          {activeTab === 'orders' && (
            <section className="account-section">
              <h3>My Orders</h3>
              {orders.length === 0 ? (
                <p style={{ color: '#999' }}>No orders yet</p>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h4>{order.id || 'Order'}</h4>
                        <span className="order-status">{order.status || 'PENDING'}</span>
                      </div>
                      <p className="order-date">{order.createdDate ? new Date(order.createdDate).toLocaleDateString() : 'N/A'}</p>
                      <p className="order-items">{order.items?.length || 0} items</p>
                      <p className="order-total">₹{order.total || 0}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* My Addresses */}
          {activeTab === 'addresses' && (
            <section className="account-section">
              <h3>My Addresses</h3>
              <button className="btn" onClick={() => navigate('/address')} style={{ marginBottom: '12px' }}>
                Manage Addresses
              </button>
              {addresses.length === 0 ? (
                <p style={{ color: '#999' }}>No addresses saved</p>
              ) : (
                <div className="addresses-list">
                  {addresses.map(addr => (
                    <div key={addr.id} className="addr-preview">
                      <h4>{addr.name}</h4>
                      <p>{addr.street}, {addr.landmark && `${addr.landmark}, `}{addr.city} - {addr.zip}</p>
                      <p>📞 {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <section className="account-section">
              <h3>Edit Profile</h3>
              <div className="profile-edit">
                {!editMode ? (
                  <div className="profile-view">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <button className="btn" onClick={() => setEditMode(true)}>Edit Details</button>
                  </div>
                ) : (
                  <div className="profile-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="form-actions">
                      <button className="btn" onClick={handleSaveProfile}>Save Changes</button>
                      <button className="btn ghost" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
