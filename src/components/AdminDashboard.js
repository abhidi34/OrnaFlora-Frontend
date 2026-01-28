import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState(products);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);

  const isAdmin = localStorage.getItem('adminUser');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  function loadData() {
    loadOrders();
    loadUsers();
    loadProducts();
  }

  function loadOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(allOrders);
  }

  function loadUsers() {
    const allUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const usersList = Object.entries(allUsers).map(([email, data]) => ({
      email,
      ...data
    }));
    setUsers(usersList);
  }

  function loadProducts() {
    const stored = localStorage.getItem('adminProducts');
    if (stored) {
      setProductsList(JSON.parse(stored));
    } else {
      setProductsList(products);
    }
  }

  function deleteUser(email) {
    if (window.confirm(`Delete user account ${email}? This action cannot be undone.`)) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '{}');
      delete allUsers[email];
      localStorage.setItem('users', JSON.stringify(allUsers));
      setUsers(Object.entries(allUsers).map(([e, data]) => ({ email: e, ...data })));
    }
  }

  function updateProduct(id, updatedData) {
    const updated = productsList.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setProductsList(updated);
    localStorage.setItem('adminProducts', JSON.stringify(updated));
    setEditingProductId(null);
    setEditingProduct({});
  }

  function deleteProduct(id) {
    if (window.confirm('Delete this product?')) {
      const updated = productsList.filter(p => p.id !== id);
      setProductsList(updated);
      localStorage.setItem('adminProducts', JSON.stringify(updated));
    }
  }

  function addNewProduct() {
    const newId = Math.max(...productsList.map(p => p.id), 0) + 1;
    const newProduct = {
      id: newId,
      name: 'New Product',
      price: 0,
      category: 'Indoor',
      image: 'https://via.placeholder.com/400x300?text=New+Product',
      stock: 10,
      images: ['https://via.placeholder.com/400x300?text=New+Product']
    };
    const updated = [...productsList, newProduct];
    setProductsList(updated);
    localStorage.setItem('adminProducts', JSON.stringify(updated));
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

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          📦 Orders
        </button>
        <button 
          className={`tab-btn ${tab === 'products' ? 'active' : ''}`}
          onClick={() => setTab('products')}
        >
          🌿 Products
        </button>
        <button 
          className={`tab-btn ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
        >
          👥 Users
        </button>
      </div>

      {/* ========== ORDERS TAB ========== */}
      {tab === 'orders' && (
        <>
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
        </>
      )}

      {/* ========== PRODUCTS TAB ========== */}
      {tab === 'products' && (
        <>
          <div className="admin-controls">
            <button className="add-btn" onClick={addNewProduct}>+ Add New Product</button>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '8px', marginLeft: '10px' }}
            />
          </div>

          <div className="products-grid">
            {productsList
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(product => (
              <div key={product.id} className="product-admin-card">
                {editingProductId === product.id ? (
                  <div className="edit-form">
                    <h3>Edit Product</h3>
                    <div className="form-group">
                      <label>Product Name</label>
                      <input 
                        type="text" 
                        value={editingProduct.name || product.name}
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price ($)</label>
                        <input 
                          type="number" 
                          value={editingProduct.price !== undefined ? editingProduct.price : product.price}
                          onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock</label>
                        <input 
                          type="number" 
                          value={editingProduct.stock !== undefined ? editingProduct.stock : (product.stock || 10)}
                          onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        value={editingProduct.category || product.category}
                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      >
                        <option>Large</option>
                        <option>Indoor</option>
                        <option>Climbing</option>
                        <option>Succulents</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Main Image URL</label>
                      <input 
                        type="text" 
                        value={editingProduct.image || product.image}
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Additional Images (comma-separated URLs)</label>
                      <textarea 
                        rows="3"
                        value={(editingProduct.images || product.images || []).join('\n')}
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          images: e.target.value.split('\n').filter(url => url.trim())
                        })}
                        placeholder="One image URL per line"
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        className="save-btn"
                        onClick={() => updateProduct(product.id, editingProduct)}
                      >
                        ✓ Save Changes
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => {
                          setEditingProductId(null);
                          setEditingProduct({});
                        }}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="product-image">
                      <img src={product.image} alt={product.name} onError={e => e.target.src = 'https://via.placeholder.com/200x200'} />
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="category">{product.category}</p>
                      <p className="price">${product.price}</p>
                      <p className="stock">Stock: {product.stock || 10}</p>
                      {product.images && product.images.length > 1 && (
                        <p className="images-count">📷 {product.images.length} images</p>
                      )}
                    </div>
                    <div className="product-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setEditingProductId(product.id);
                          setEditingProduct(product);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========== USERS TAB ========== */}
      {tab === 'users' && (
        <>
          <div className="admin-controls">
            <input 
              type="text" 
              placeholder="Search users by email or name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
          </div>

          <div className="users-table">
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p>No users found</p>
              </div>
            ) : (
              <>
                <div className="table-header">
                  <div className="col-email">Email</div>
                  <div className="col-name">Name</div>
                  <div className="col-phone">Phone</div>
                  <div className="col-action">Action</div>
                </div>
                {users
                  .filter(u => 
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(user => (
                  <div key={user.email} className="table-row">
                    <div className="col-email">{user.email}</div>
                    <div className="col-name">{user.name || '-'}</div>
                    <div className="col-phone">{user.phone || '-'}</div>
                    <div className="col-action">
                      <button 
                        className="delete-btn"
                        onClick={() => deleteUser(user.email)}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
