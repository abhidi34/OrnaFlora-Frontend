import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Demo admin credentials
  const ADMIN_EMAIL = 'admin@ornaflora.com';
  const ADMIN_PASSWORD = 'admin123';

  function handleSubmit(e) {
    e.preventDefault();
    
    // Trim whitespace and convert email to lowercase for comparison
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const expectedEmail = ADMIN_EMAIL.toLowerCase();
    
    console.log('Admin Login Attempt:', {
      inputEmail: trimmedEmail,
      expectedEmail: expectedEmail,
      inputPassword: trimmedPassword,
      expectedPassword: ADMIN_PASSWORD,
      emailMatch: trimmedEmail === expectedEmail,
      passwordMatch: trimmedPassword === ADMIN_PASSWORD
    });
    
    if (trimmedEmail === expectedEmail && trimmedPassword === ADMIN_PASSWORD) {
      localStorage.setItem('adminUser', ADMIN_EMAIL);
      localStorage.setItem('adminRole', 'admin');
      setError(null);
      console.log('Admin login successful');
      navigate('/admin-dashboard');
    } else {
      if (trimmedEmail !== expectedEmail) {
        setError('Invalid email. Use: admin@ornaflora.com');
      } else if (trimmedPassword !== ADMIN_PASSWORD) {
        setError('Invalid password. Check the credentials below.');
      } else {
        setError('Invalid admin credentials. Please check email and password.');
      }
      console.log('Admin login failed');
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    setEmail('');
    setPassword('');
    navigate('/');
  }

  const isAdminLoggedIn = localStorage.getItem('adminUser');

  if (isAdminLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-box">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ marginBottom: '20px' }}>You are logged in as Admin</p>
            <button className="auth-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Admin Login</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@ornaflora.com"
              required 
            />
          </div>
          
          <div className="field">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div style={{ 
            backgroundColor: '#f0f8ff', 
            padding: '12px', 
            borderRadius: '4px', 
            fontSize: '12px',
            marginBottom: '16px'
          }}>
            <p style={{ margin: '4px 0' }}><strong>Demo Credentials:</strong></p>
            <p style={{ margin: '4px 0' }}>Email: admin@ornaflora.com</p>
            <p style={{ margin: '4px 0' }}>Password: admin123</p>
          </div>

          <div className="actions">
            <button className="auth-btn" type="submit">Admin Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
