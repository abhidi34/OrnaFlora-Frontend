import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import './ProductList.css';

export default function ProductList() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').toLowerCase().trim();
  const filtered = q ? products.filter(p => p.name.toLowerCase().includes(q)) : products;

  return (
    <section className="product-list">
      {filtered.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}
