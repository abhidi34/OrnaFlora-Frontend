import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Admin credentials
  const ADMIN_EMAIL = 'admin@ornaflora.com';
  const ADMIN_PASSWORD = 'admin123';

  function handleSubmit(e) {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Check if admin login
    if (trimmedEmail === ADMIN_EMAIL.toLowerCase() && trimmedPassword === ADMIN_PASSWORD) {
      localStorage.setItem('adminUser', ADMIN_EMAIL);
      localStorage.setItem('adminRole', 'admin');
      localStorage.removeItem('currentUser'); // Clear customer login
      setError(null);
      console.log('Admin login successful');
      navigate('/admin-dashboard');
      return;
    }

    // Check customer login
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];
    if (!user || user.password !== password) {
      setError('Invalid email or password');
      return;
    }
    
    // Successful customer login
    localStorage.setItem('currentUser', email);
    localStorage.removeItem('adminUser'); // Clear admin login
    localStorage.removeItem('adminRole');
    setError(null);
    navigate('/');
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="your@email.com"
          required 
        />
      </div>
      <div className="field">
        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="••••••••"
          required 
        />
      </div>
      {error && <div className="error">{error}</div>}
      
      {/* Admin credentials hint */}
      <div style={{ 
        backgroundColor: '#f0f8ff', 
        padding: '10px', 
        borderRadius: '4px', 
        fontSize: '11px',
        marginBottom: '12px',
        lineHeight: '1.4'
      }}>
        <p style={{ margin: '0 0 4px 0' }}><strong>Demo Admin:</strong> admin@ornaflora.com / admin123</p>
        <p style={{ margin: '0' }}><strong>Or</strong> create a customer account above</p>
      </div>
      
      <div className="actions">
        <button className="auth-btn" type="submit">Login</button>
        <button type="button" className="link" onClick={onSwitch}>Go to Sign up</button>
      </div>
    </form>
  );
}

function SignupForm({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      setError('User already exists');
      return;
    }
    users[email] = { name, password, phone, avatar: null };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', email);
    alert('Signup successful (demo)');
    navigate('/');
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      </div>
      <div className="field">
        <label>Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button className="auth-btn" type="submit">Sign up</button>
        <button type="button" className="link" onClick={onSwitch}>Go to Login</button>
      </div>
    </form>
  );
}

export default function Auth() {
  const loc = useLocation();
  const initial = loc.pathname === '/signup' || loc.search.includes('tab=signup') ? 'signup' : 'login';
  const [tab, setTab] = useState(initial);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="tabs">
          <button className={tab==='login'? 'active':''} onClick={()=>setTab('login')}>Login</button>
          <button className={tab==='signup'? 'active':''} onClick={()=>setTab('signup')}>Sign up</button>
        </div>

        <div className="tab-body">
          {tab==='login' ? <LoginForm onSwitch={()=>setTab('signup')} /> : <SignupForm onSwitch={()=>setTab('login')} />}
        </div>
      </div>
    </div>
  );
}
