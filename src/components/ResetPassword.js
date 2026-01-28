import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    const raw = localStorage.getItem(`otp:${email}`);
    if (!raw) {
      setMessage('No OTP found for that email. Request a new OTP.');
      return;
    }
    const payload = JSON.parse(raw);
    if (payload.otp !== otp) {
      setMessage('Invalid OTP');
      return;
    }
    if (Date.now() > payload.expiresAt) {
      setMessage('OTP expired. Request a new one.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[email]) {
      setMessage('No account exists for that email');
      return;
    }
    users[email].password = password;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem(`otp:${email}`);
    setMessage('Password reset successful (demo)');
    setTimeout(()=>navigate('/login'),1000);
  }

  return (
    <div style={{maxWidth:420,margin:'24px auto'}}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>OTP</label>
          <input value={otp} onChange={e=>setOtp(e.target.value)} required />
        </div>
        <div>
          <label>New password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        <div>
          <label>Confirm password</label>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required />
        </div>
        {message && <div style={{color: message.includes('successful') ? 'green' : 'red', marginTop:8}}>{message}</div>}
        <div style={{marginTop:10}}>
          <button type="submit">Reset password</button>
        </div>
      </form>
    </div>
  );
}
