import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, Search, Filter, Plus, Minus } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState([]);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async (keyword = '') => {
    setLoading(true);
    try {
      if (keyword) {
        // Find by keyword returns a direct list
        const res = await api.get(`/products/${keyword}`);
        setProducts(res.data || []);
      } else {
        // Get all products returns paginated ApiResponse
        const res = await api.get('/products');
        if (res.data && res.data.success) {
          setProducts(res.data.data.content || []);
        } else {
          setProducts([]);
        }
      }
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    if (user && (user.role === 'USER' || !user.role)) {
      try {
        const res = await api.get('/buyer/cart');
        setCartItems(res.data || []);
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const updateCartQuantity = async (productId, quantityChange) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/buyer/cart/add', {
        productId: productId,
        quantity: quantityChange
      });
      fetchCartItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update cart');
    }
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(16, 185, 129, 0.2))',
        padding: '4rem 1rem',
        textAlign: 'center',
        marginBottom: '2rem',
        borderRadius: 'var(--radius)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h1 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Premium Cricket Gear
        </h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
          Elevate your game with our professional-grade cricket equipment, apparel, and accessories.
        </p>
      </div>

      <div className="container">
        {/* Search Bar */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3rem'}}>
          <form onSubmit={handleSearch} style={{display: 'flex', width: '100%', maxWidth: '600px', gap: '0.5rem'}}>
            <div style={{position: 'relative', flex: 1}}>
              <div style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>
                <Search size={20} />
              </div>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search products by keyword..." 
                style={{paddingLeft: '48px', paddingRight: '1rem', height: '100%', fontSize: '1.1rem', borderRadius: '2rem'}}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{borderRadius: '2rem', padding: '0 1.5rem'}}>
              Search
            </button>
          </form>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)'}}>
            <div className="animate-pulse-hover">Loading products...</div>
          </div>
        ) : error ? (
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--danger)'}}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)'}}>No products found.</div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem'}}>
            {products.map(product => (
              <div key={product.id} className="card" style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{height: '200px', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)'}}>
                  {product.imageUrl ? (
                     <img src={product.imageUrl} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                     <div style={{opacity: 0.5}}><ShoppingCart size={48} /></div>
                  )}
                </div>
                <div style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                    <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>{product.name}</h3>
                    <span className="badge">{product.category}</span>
                  </div>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1}}>
                    {product.description?.substring(0, 100)}{product.description?.length > 100 ? '...' : ''}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                    <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)'}}>
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.stock > 0 ? (
                      (() => {
                        const inCart = cartItems.find(item => item.productId === product.id);
                        if (inCart) {
                          return (
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface-hover)', padding: '0.25rem', borderRadius: 'var(--radius)'}}>
                              <button onClick={() => updateCartQuantity(product.id, -1)} className="btn btn-secondary" style={{padding: '0.25rem 0.5rem', border: 'none'}}>
                                <Minus size={16} />
                              </button>
                              <span style={{fontWeight: 'bold', minWidth: '1.5rem', textAlign: 'center'}}>{inCart.quantity}</span>
                              <button onClick={() => updateCartQuantity(product.id, 1)} className="btn btn-secondary" style={{padding: '0.25rem 0.5rem', border: 'none'}}>
                                <Plus size={16} />
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <button onClick={() => updateCartQuantity(product.id, 1)} className="btn btn-primary" style={{padding: '0.5rem'}}>
                              <Plus size={18} /> Add
                            </button>
                          );
                        }
                      })()
                    ) : (
                      <span style={{color: 'var(--danger)', fontSize: '0.875rem', fontWeight: '500'}}>Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
