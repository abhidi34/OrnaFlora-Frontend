import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function currencySymbol() {
  const c = localStorage.getItem('currency') || 'INR';
  return c === 'INR' ? '₹' : '$';
}

const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%23999" text-anchor="middle" dy=".3em"%3EImage Not Available%3C/text%3E%3C/svg%3E';

export default function ProductCard({ product }) {
  const { cart, dispatch } = useCart();
  const item = cart.items.find(i => i.id === product.id);
  const qty = item ? item.qty : 0;
  const [imgError, setImgError] = useState(false);

  function addOne() {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }

  function inc() {
    dispatch({ type: 'UPDATE_QTY', payload: { id: product.id, qty: qty + 1 } });
  }

  function dec() {
    if (qty <= 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: product.id });
    } else {
      dispatch({ type: 'UPDATE_QTY', payload: { id: product.id, qty: qty - 1 } });
    }
  }

  function onImgError(e) {
    if (!imgError) {
      setImgError(true);
      e.currentTarget.src = placeholder;
    }
  }

  return (
    <div className="product-card">
      <div className="product-media">
        <img src={product.image} alt={product.name} onError={onImgError} />
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="category">{product.category || ''}</p>
        <p className="price">{currencySymbol()}{product.price}</p>
        {qty === 0 ? (
          <button className="btn" onClick={addOne}>Add to cart</button>
        ) : (
          <div className="product-controls">
            <div className="qty-controls">
              <button className="qty-btn" onClick={dec}>−</button>
              <span className="qty-count">{qty}</span>
              <button className="qty-btn" onClick={inc}>+</button>
            </div>
            <Link to="/cart" className="btn view-cart-btn">View Cart</Link>
          </div>
        )}
      </div>
    </div>
  );
}
