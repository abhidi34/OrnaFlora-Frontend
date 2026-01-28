import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
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
    setError(null);
    localStorage.setItem('currentUser', email);
    alert('Login successful (demo)');
    navigate('/');
  }

  return (
    <div style={{maxWidth:420,margin:'20px auto'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <div style={{marginTop:10}}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
