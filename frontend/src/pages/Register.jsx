import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Mail, Lock, User, UserCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data && response.data.success) {
        setSuccess('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
         // Handle validation errors from backend
         const errorMsgs = typeof err.response.data.errors === 'object' 
             ? Object.values(err.response.data.errors).join(', ') 
             : JSON.stringify(err.response.data.errors);
         setError(errorMsgs);
      } else {
         setError(err.response?.data?.message || 'Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container glass" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="auth-container card" style={{maxWidth: '500px'}}>
        <h2 style={{fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem'}}>Create an Account</h2>
        
        {error && (
          <div style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
            {error}
          </div>
        )}

        {success && (
          <div style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>
                <User size={18} />
              </div>
              <input 
                type="text" 
                name="name"
                required
                className="form-input" 
                style={{paddingLeft: '40px'}}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

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
                minLength="8"
                className="form-input" 
                style={{paddingLeft: '40px'}}
                placeholder="•••••••• (Min 8 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">I want to</label>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>
                <UserCheck size={18} />
              </div>
              <select 
                name="role"
                className="form-input" 
                style={{paddingLeft: '40px', appearance: 'none', background: 'var(--surface)'}}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">Buy Products</option>
                <option value="SELLER">Sell Products</option>
                <option value="ADMIN">Admin (Dev Mode)</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '0.75rem', marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)'}}>
          Already have an account? <span style={{color: 'var(--primary)', cursor: 'pointer'}} onClick={() => navigate('/login')}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
