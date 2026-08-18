import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './Cart.css';

export default function Cart() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const symbol = cart.currency === 'USD' ? '$' : '₹';
  const total = cart.items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);
  const delivery = 40;
  const tax = Math.round(total * 0.1);

  // Save cart to backend when it changes
  useEffect(() => {
    const saveCart = async () => {
      const user = localStorage.getItem('user');
      if (user && cart.items.length > 0) {
        try {
          const userObj = JSON.parse(user);
          await apiService.saveCart(userObj.id, cart.items);
        } catch (err) {
          console.error('Failed to sync cart with backend:', err);
        }
      }
    };

    saveCart();
  }, [cart.items]);

  function handleCheckout() {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    if (cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }
    navigate('/address');
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      
      {cart.items.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="price">{symbol}{item.price}</p>
                </div>
                <div className="item-controls">
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: Math.max(1, item.qty - 1) } })}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
                </div>
                <div className="item-subtotal">{symbol}{item.price * item.qty}</div>
                <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{symbol}{total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{symbol}{delivery}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{symbol}{tax}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{symbol}{total + delivery + tax}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
