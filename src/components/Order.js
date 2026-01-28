import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Order.css';

export default function Order() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const symbol = cart.currency === 'USD' ? '$' : '₹';
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = 40;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + delivery + tax;

  useEffect(() => {
    const saved = localStorage.getItem('selectedAddress');
    if (saved) {
      setAddress(JSON.parse(saved));
    }
  }, []);

  function handlePlaceOrder() {
    if (!address) {
      alert('Please select a delivery address');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const order = {
        id: `ORD${Date.now()}`,
        items: cart.items,
        address,
        total,
        paymentMethod,
        date: new Date().toLocaleDateString(),
        status: 'Confirmed'
      };
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      dispatch({ type: 'CLEAR' });
      alert(`Order placed successfully! Order ID: ${order.id}`);
      navigate('/');
    }, 1000);
  }

  function changeAddress() {
    navigate('/address');
  }

  return (
    <div className="order-page">
      <h2>Order Confirmation</h2>
      
      {cart.items.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>No items in cart</p>
        </div>
      ) : (
        <div className="order-layout">
          <div className="order-col">
            {/* Items Review */}
            <section className="order-section">
              <h3>Order Items</h3>
              <div className="order-items">
                {cart.items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span className="qty">Qty: {item.qty}</span>
                    </div>
                    <span className="price">{symbol}{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address */}
            <section className="order-section">
              <h3>Delivery Address</h3>
              {address ? (
                <div className="address-display">
                  <h4>{address.name}</h4>
                  <p>{address.street}, {address.landmark && `${address.landmark}, `}{address.city} - {address.zip}</p>
                  <p>📞 {address.phone}</p>
                  <button className="link-btn" onClick={changeAddress}>Change Address</button>
                </div>
              ) : (
                <button className="btn" onClick={changeAddress}>Select Address</button>
              )}
            </section>

            {/* Payment */}
            <section className="order-section">
              <h3>Payment Method</h3>
              <div className="payment-opts">
                <label>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={e => setPaymentMethod(e.target.value)} />
                  Credit/Debit Card
                </label>
                <label>
                  <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={e => setPaymentMethod(e.target.value)} />
                  Digital Wallet
                </label>
                <label>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} />
                  Cash on Delivery
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="order-summary">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{symbol}{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>{symbol}{delivery}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{symbol}{tax}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>{symbol}{total}</span>
            </div>
            <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
