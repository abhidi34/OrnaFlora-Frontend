import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const isAdmin = localStorage.getItem('adminUser');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    loadOrders();
  }, [isAdmin, navigate]);

  function loadOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(allOrders);
  }

  function getFilteredOrders() {
    return orders.filter(order => {
      const matchesStatus = filter === 'All' || order.status === filter;
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.phone.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }

  function handleStatusChange(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || !newStatus) return;

    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setEditingOrderId(null);
    setNewStatus('');
  }

  function handleLogout() {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    navigate('/');
  }

  const statuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const filteredOrders = getFilteredOrders();

  const stats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{stats.confirmed}</h3>
          <p>Confirmed</p>
        </div>
        <div className="stat-card">
          <h3>{stats.processing}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{stats.shipped}</h3>
          <p>Shipped</p>
        </div>
        <div className="stat-card">
          <h3>{stats.delivered}</h3>
          <p>Delivered</p>
        </div>
        <div className="stat-card">
          <h3>{stats.cancelled}</h3>
          <p>Cancelled</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="admin-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name, Email, or Phone..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No orders found</p>
          </div>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <div className="col-id">Order ID</div>
              <div className="col-customer">Customer</div>
              <div className="col-address">Delivery Address</div>
              <div className="col-amount">Amount</div>
              <div className="col-date">Date</div>
              <div className="col-status">Status</div>
              <div className="col-action">Action</div>
            </div>

            {filteredOrders.map(order => (
              <div key={order.id} className="table-row">
                <div className="col-id">
                  <strong>{order.id}</strong>
                </div>

                <div className="col-customer">
                  <p><strong>{order.address.name}</strong></p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{order.address.phone}</p>
                </div>

                <div className="col-address">
                  <p style={{ fontSize: '13px' }}>
                    {order.address.street}, {order.address.landmark && `${order.address.landmark}, `}
                    {order.address.city} - {order.address.zip}
                  </p>
                </div>

                <div className="col-amount">
                  <strong>${order.total}</strong>
                </div>

                <div className="col-date">
                  {order.date}
                </div>

                <div className="col-status">
                  {editingOrderId === order.id ? (
                    <select 
                      value={newStatus || order.status}
                      onChange={e => setNewStatus(e.target.value)}
                      className="status-select"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  )}
                </div>

                <div className="col-action">
                  {editingOrderId === order.id ? (
                    <div className="action-buttons">
                      <button 
                        className="save-btn"
                        onClick={() => handleStatusChange(order.id)}
                      >
                        ✓ Save
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setEditingOrderId(null)}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setEditingOrderId(order.id);
                          setNewStatus(order.status);
                        }}
                      >
                        Edit Status
                      </button>
                      <button 
                        className="view-btn"
                        onClick={() => {
                          // Show order details in modal or expand
                          alert(`Order Details:\n\nItems: ${order.items.length}\nPayment: ${order.paymentMethod}\nTotal: $${order.total}`);
                        }}
                      >
                        View
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
