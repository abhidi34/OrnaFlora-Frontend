import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  function handleSend(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[email]) {
      setMessage('No account found for that email');
      return;
    }
    const otp = generateOTP();
    const payload = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    localStorage.setItem(`otp:${email}`, JSON.stringify(payload));
    // In a real app you'd send the OTP by email. Here we'll show it so tester can proceed.
    setMessage(`OTP sent (demo): ${otp} — expires in 5 minutes`);
  }

  return (
    <div style={{maxWidth:420,margin:'24px auto'}}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSend}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div style={{marginTop:10}}>
          <button type="submit">Send OTP</button>
          <button type="button" style={{marginLeft:8}} onClick={()=>navigate('/reset-password')}>Reset password</button>
        </div>
      </form>
      {message && <div style={{marginTop:12}}>{message}</div>}
    </div>
  );
}
