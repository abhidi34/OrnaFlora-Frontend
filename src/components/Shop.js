import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Large', 'Indoor', 'Climbing', 'Succulents'];

export default function Shop() {
  const location = useLocation();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get('q') || '');
  }, [location.search]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matches_q = p.name.toLowerCase().includes(q.toLowerCase());
      const matches_cat = cat === 'All' || p.category === cat;
      return matches_q && matches_cat;
    });
  }, [q, cat]);

  return (
    <div className="shop-page">
      <h2>Plants</h2>
      
      <div className="shop-filters">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={cat === c ? 'active' : ''}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="product-list">
        {filtered.length > 0 ? filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        )) : <p style={{gridColumn:'1/-1'}}>No products found</p>}
      </div>
    </div>
  );
}
