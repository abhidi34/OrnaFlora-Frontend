import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQ = params.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [currentUser, setCurrentUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const { cart } = useCart();
  const cartCount = cart.items.reduce((sum, i) => sum + i.qty, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {

  const email = localStorage.getItem('currentUser');
  const userJson = localStorage.getItem('user');

  if (email && userJson) {
    const user = JSON.parse(userJson);
    setCurrentUser(user);
    setUserAvatar(user?.avatar || null);
  } else {
    setCurrentUser(null);
    setUserAvatar(null);
  }

  const admin = localStorage.getItem('adminUser');
  if (admin) {
    setAdminUser(admin);
  } else {
    setAdminUser(null);
  }

}, [location]);

  function submitSearch(e) {
    e?.preventDefault();
    const search = q ? `?q=${encodeURIComponent(q)}` : '';
    setMenuOpen(false);
    navigate(`/shop${search}`);
  }

  function getInitials(name) {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  function handleLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('user');
  setCurrentUser(null);
  navigate('/');
}

  function handleAdminLogout() {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    setAdminUser(null);
    navigate('/');
  }

  return (
    <header className="site-header">
      <nav className="container">
        <img src="/OrgLogo.png" alt="Logo" className="logo-image" />

        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>Shashi ramyh Ornaflora Plant Nursery</Link>
        
        <button className="mobile-menu-btn" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(s=>!s)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <form className="search-form" onSubmit={submitSearch} role="search">
          <input
            className="search-input"
            placeholder="Search plants..."
            value={q}
            onChange={e => setQ(e.target.value)}
            aria-label="Search plants"
          />
          <button className="btn" type="submit" title="Search">🔍</button>
        </form>

        <div className="main-nav" id="main-nav">
          <Link to="/" className="nav-link nav-home" title="Home">
            🏠 <span className="nav-label">Home</span>
          </Link>
          <Link to="/shop" className="nav-link nav-plants" title="Shop Plants">
            🌿 <span className="nav-label">Plants</span>
          </Link>
          
          {!adminUser && (
            <Link to="/cart" className="cart-link">
              🛒 <span className="cart-badge">{cartCount}</span>
            </Link>
          )}
          
          {adminUser ? (
            <div className="profile-dropdown">
              <button className="profile-btn admin-badge" title="Admin menu">🛠️ Admin</button>
              <div className="dropdown-menu">
                <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleAdminLogout} style={{color: '#e74c3c'}}>Logout</button>
              </div>
            </div>
          ) : currentUser ? (
            <div className="profile-dropdown">
              <button className="profile-btn" title="Profile menu" aria-label={`Profile menu for ${currentUser.name}`}>
                {userAvatar ? (
                  <img src={userAvatar} alt={`Profile of ${currentUser.name}`} className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar">{getInitials(currentUser.name)}</div>
                )}
              </button>
              <div className="dropdown-menu">
                <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="cta" onClick={() => setMenuOpen(false)}>Login / Signup</Link>
          )}
        </div>
        
        <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open':''}`} aria-hidden={!menuOpen}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Plants</Link>
          {!adminUser && (
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
          )}
          {adminUser ? (
            <>
              <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              <button onClick={handleAdminLogout} style={{color: '#e74c3c'}}>Logout</button>
            </>
          ) : currentUser ? (
            <>
              <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
              <button onClick={handleLogout} style={{color: '#e74c3c'}}>Logout</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)}>Login / Sign up</Link>
          )}
         
        </div>
      </nav>
    </header>
  );
}

