import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import ProductCard from './ProductCard';
import './Shop.css';

const DEFAULT_CATEGORIES = ['All', 'Large', 'Indoor', 'Climbing', 'Succulents'];

export default function Shop() {
  const location = useLocation();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const productsData = await apiService.getProducts();
        setProducts(Array.isArray(productsData) ? productsData : productsData.data || []);

        // Try to fetch categories from backend, fallback to defaults
        try {
          const categoriesData = await apiService.getCategories();
          if (Array.isArray(categoriesData)) {
            setCategories(['All', ...categoriesData]);
          } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
            setCategories(['All', ...categoriesData.data]);
          }
        } catch {
          setCategories(DEFAULT_CATEGORIES);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch shop data:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matches_q = p.name?.toLowerCase().includes(q.toLowerCase());
      const matches_cat = cat === 'All' || p.category === cat;
      return matches_q && matches_cat;
    });
  }, [q, cat, products]);

  if (loading) return <div className="shop-page"><h2>Plants</h2><p>Loading...</p></div>;

  return (
    <div className="shop-page">
      <h2>Plants</h2>
      
      {error && <p style={{color:'red', textAlign:'center'}}>Error loading products: {error}</p>}
      
      <div className="shop-filters">
        {categories.map(c => (
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
