import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      if (response.data && response.data.success) {
        login(response.data.data); // token
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container glass" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="auth-container card">
        <h2 style={{fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem'}}>Welcome Back</h2>
        
        {error && (
          <div style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                required
                className="form-input" 
                style={{paddingLeft: '40px'}}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="password"
                required
                className="form-input" 
                style={{paddingLeft: '40px'}}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '0.75rem'}} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)'}}>
          Don't have an account? <span style={{color: 'var(--primary)', cursor: 'pointer'}} onClick={() => navigate('/register')}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
