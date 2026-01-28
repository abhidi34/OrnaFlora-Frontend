import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', zip: '', landmark: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('addresses');
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  function saveAddress() {
    if (!form.name || !form.phone || !form.street || !form.city || !form.zip) {
      alert('Please fill all fields');
      return;
    }
    let updated;
    if (editId) {
      updated = addresses.map(a => a.id === editId ? { ...form, id: editId } : a);
    } else {
      updated = [...addresses, { ...form, id: Date.now() }];
    }
    setAddresses(updated);
    localStorage.setItem('addresses', JSON.stringify(updated));
    setForm({ name: '', phone: '', street: '', city: '', zip: '', landmark: '' });
    setShowForm(false);
    setEditId(null);
  }

  function deleteAddress(id) {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('addresses', JSON.stringify(updated));
  }

  function selectAddress(addr) {
    localStorage.setItem('selectedAddress', JSON.stringify(addr));
    navigate('/order');
  }

  return (
    <div className="address-page">
      <h2>Delivery Addresses</h2>
      
      <div className="address-list">
        {addresses.map(addr => (
          <div key={addr.id} className="address-card">
            <div className="addr-text">
              <h4>{addr.name}</h4>
              <p>{addr.street}, {addr.landmark && `${addr.landmark}, `}{addr.city} - {addr.zip}</p>
              <p>📞 {addr.phone}</p>
            </div>
            <div className="addr-actions">
              <button className="btn-small" onClick={() => { setEditId(addr.id); setForm(addr); setShowForm(true); }}>Edit</button>
              <button className="btn-small delete" onClick={() => deleteAddress(addr.id)}>Delete</button>
              <button className="btn" onClick={() => selectAddress(addr)}>Select</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button className="add-addr-btn" onClick={() => setShowForm(true)}>+ Add New Address</button>
      ) : (
        <div className="address-form">
          <h3>{editId ? 'Edit Address' : 'Add New Address'}</h3>
          <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input placeholder="Street Address" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
          <input placeholder="Landmark (optional)" value={form.landmark} onChange={e => setForm({...form, landmark: e.target.value})} />
          <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          <input placeholder="Zip Code" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} />
          <div className="form-actions">
            <button className="btn" onClick={saveAddress}>{editId ? 'Update' : 'Save'} Address</button>
            <button className="btn ghost" onClick={() => { setShowForm(false); setEditId(null); setForm({ name: '', phone: '', street: '', city: '', zip: '', landmark: '' }); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
