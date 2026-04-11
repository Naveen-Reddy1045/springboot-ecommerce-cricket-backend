import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/buyer/cart');
      setCartItems(res.data || []);
    } catch (err) {
      setError('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemove = async (cartId) => {
    try {
      await api.delete(`/buyer/cart/${cartId}`);
      fetchCartItems();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await api.delete('/buyer/cart/clear');
        fetchCartItems();
      } catch (err) {
        alert('Failed to clear cart');
      }
    }
  };

  const handleCheckout = async () => {
    if (checkoutStatus) return;
    try {
      setCheckoutStatus('Processing...');
      const res = await api.post('/buyer/orders/place');
      setCheckoutStatus('Order placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setCheckoutStatus('');
      alert(err.response?.data?.message || 'Failed to checkout');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return <div className="page-container glass" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading cart...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <ShoppingBag /> Your Cart
        </h1>
        
        {error && <div style={{color: 'var(--danger)', marginBottom: '1rem'}}>{error}</div>}

        {cartItems.length === 0 ? (
          <div className="card glass" style={{padding: '4rem', textAlign: 'center'}}>
            <div style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.5}}>
              <ShoppingCart size={64} style={{margin: '0 auto'}} />
            </div>
            <h2 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Your cart is empty</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem'}}>
            <div style={{flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button onClick={handleClear} className="btn btn-secondary" style={{color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                  Clear Cart
                </button>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="card glass" style={{display: 'flex', padding: '1rem', gap: '1rem', alignItems: 'center'}}>
                  <div style={{width: '100px', height: '100px', background: 'var(--surface-hover)', borderRadius: 'var(--radius)', flexShrink: 0}}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
                    ) : (
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3}}><ShoppingBag size={32} /></div>
                    )}
                  </div>
                  
                  <div style={{flex: 1}}>
                    <h3 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>{item.productName}</h3>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Qty: {item.quantity}</p>
                    <p style={{fontWeight: 'bold', color: 'var(--secondary)'}}>${item.price?.toFixed(2)}</p>
                  </div>
                  
                  <button onClick={() => handleRemove(item.id)} className="btn btn-secondary" style={{alignSelf: 'flex-start', padding: '0.5rem', border: 'none', color: 'var(--danger)'}}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{flex: '1 1 350px'}}>
              <div className="card glass" style={{padding: '2rem', position: 'sticky', top: '100px'}}>
                <h3 style={{fontSize: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)'}}>Order Summary</h3>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <span style={{color: 'var(--text-secondary)'}}>Subtotal ({cartItems.length} items)</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)'}}>
                  <span style={{color: 'var(--text-secondary)'}}>Shipping</span>
                  <span style={{color: 'var(--secondary)'}}>Free</span>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold'}}>
                  <span>Total</span>
                  <span style={{color: 'var(--primary)'}}>${calculateTotal()}</span>
                </div>
                
                <button 
                  onClick={handleCheckout} 
                  className="btn btn-primary" 
                  style={{width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem'}}
                  disabled={!!checkoutStatus}
                >
                  <CreditCard size={20} /> 
                  {checkoutStatus || 'Proceed to Checkout'}
                </button>
                
                <button onClick={() => navigate('/')} className="btn btn-secondary" style={{width: '100%', padding: '0.75rem', border: 'none'}}>
                  <ArrowRight size={18} /> Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
