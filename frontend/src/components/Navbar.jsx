import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Store } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      <div className="container">
        <Link to="/" className="logo hide-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px'}}>
           <div style={{width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))'}}></div>
           CricketShop
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {user ? (
            <>
              {/* Buyer Links */}
              {(!user.role || user.role === 'USER') && (
                <>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/cart" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <ShoppingCart size={20} /> Cart
                  </Link>
                </>
              )}
              
              {/* Seller Links */}
              {user.role === 'SELLER' && (
                <Link to="/seller" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <Store size={20} /> Seller Dashboard
                </Link>
              )}
              
              {/* Admin Links */}
              {user.role === 'ADMIN' && (
                <Link to="/admin" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <LayoutDashboard size={20} /> Admin Panel
                </Link>
              )}

              <div ref={dropdownRef} style={{position: 'relative', marginLeft: '0.5rem'}}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="btn btn-secondary" 
                  style={{padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                  <UserIcon size={20} />
                </button>
                
                {showDropdown && (
                  <div className="card glass" style={{
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    marginTop: '0.5rem', 
                    minWidth: '150px', 
                    padding: '0.5rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.25rem',
                    zIndex: 50
                  }}>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowDropdown(false)}
                      style={{padding: '0.5rem', borderRadius: 'var(--radius)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                    >
                      <UserIcon size={16} /> Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      style={{
                        padding: '0.5rem', 
                        borderRadius: 'var(--radius)', 
                        color: 'var(--danger)', 
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{border: 'none'}}>Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
