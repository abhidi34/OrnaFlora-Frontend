import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProductList from './components/ProductList';
import Header from './components/Header';
import Auth from './components/Auth';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Address from './components/Address';
import Order from './components/Order';
import Account from './components/Account';
import AdminAuth from './components/AdminAuth';
import AdminDashboard from './components/AdminDashboard';

function Home() {
  return (
    <div className="home-root">
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Shashi ramyh Ornaflora Plant Nursery</h1>
          <p className="hero-sub">Healthy, happy plants for your home and office.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn">Shop Plants</Link>
            <Link to="/login" className="btn ghost">Account</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-plant p1" />
          <div className="floating-plant p2" />
          <div className="floating-plant p3" />
        </div>
      </header>

      <main style={{padding:'24px 20px'}}>
        <h2 style={{marginBottom:12}}>Our Plants</h2>
        <ProductList />
      </main>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <main id="main" style={{padding:12}}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/shop" element={<Shop/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/address" element={<Address/>} />
            <Route path="/order" element={<Order/>} />
            <Route path="/account" element={<Account/>} />
            <Route path="/login" element={<Auth/>} />
            <Route path="/signup" element={<Auth/>} />
            <Route path="/auth" element={<Auth/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/admin-login" element={<AdminAuth/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
