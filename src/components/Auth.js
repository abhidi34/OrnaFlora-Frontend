import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  function handleSubmit(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];
    if (!user || user.password !== password) {
      setError('Invalid email or password');
      return;
    }
    localStorage.setItem('currentUser', email);
    setError(null);
    navigate('/');
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      </div>
      {error && <div className="error">{error}</div>}
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
