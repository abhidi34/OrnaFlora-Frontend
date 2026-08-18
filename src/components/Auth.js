import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import './Auth.css';

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(trimmedEmail, trimmedPassword);
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('authToken', response.token || response.id);
      localStorage.setItem('currentUser', trimmedEmail);
      
      // Check if admin
      if (response.role === 'ADMIN' || response.role === 'admin') {
        localStorage.setItem('adminUser', trimmedEmail);
        localStorage.setItem('adminRole', 'admin');
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>
      {error && <div className="error">{error}</div>}
      
      <div className="actions">
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" className="link" onClick={onSwitch} disabled={loading}>Go to Sign up</button>
      </div>
      <div className="forgot-password-link">
        <a href="/forgot-password">Forgot Password?</a>
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.signup({
        name,
        email: email.trim().toLowerCase(),
        password,
        phone
      });
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('authToken', response.token || response.id);
      localStorage.setItem('currentUser', email.trim().toLowerCase());
      
      alert('Signup successful!');
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Name</label>
        <input 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          required 
          disabled={loading}
        />
      </div>
      <div className="field">
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          required 
          disabled={loading}
        />
      </div>
      <div className="field">
        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          required 
          disabled={loading}
        />
      </div>
      <div className="field">
        <label>Phone</label>
        <input 
          value={phone} 
          onChange={e=>setPhone(e.target.value)} 
          disabled={loading}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <button type="button" className="link" onClick={onSwitch} disabled={loading}>Go to Login</button>
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
