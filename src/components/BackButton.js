import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <button 
      className="back-btn" 
      onClick={() => navigate(-1)}
      title="Go back"
      aria-label="Go back to previous page"
    >
      ← Back
    </button>
  );
}
