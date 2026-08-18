import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { apiService } from '../services/api';
import './ProductList.css';

export default function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(Array.isArray(data) ? data : data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').toLowerCase().trim();
  const filtered = q ? products.filter(p => p.name?.toLowerCase().includes(q)) : products;

  if (loading) return <section className="product-list"><p>Loading products...</p></section>;
  if (error) return <section className="product-list"><p style={{color:'red'}}>Error: {error}</p></section>;

  return (
    <section className="product-list">
      {filtered.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}
