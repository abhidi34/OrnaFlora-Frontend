import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      setError('User already exists');
      return;
    }
    users[email] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful');
    navigate('/login');
  }

  return (
    <div style={{maxWidth:420,margin:'24px auto'}}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        <div>
          <label>Confirm password</label>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required />
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <div style={{marginTop:10}}>
          <button type="submit">Sign up</button>
        </div>
      </form>
    </div>
  );
}
