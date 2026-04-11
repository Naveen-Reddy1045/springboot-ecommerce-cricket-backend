import React, { useState, useEffect, useContext } from 'react';
import { User, MapPin, Plus, Trash2, Home, Navigation, CheckCircle } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/buyer/address');
      setAddresses(res.data.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/buyer/address', formData);
      setFormVisible(false);
      setFormData({
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      fetchAddresses();
      alert('Address added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handleRemoveAddress = async (id) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await api.delete(`/buyer/address/${id}`);
        fetchAddresses();
      } catch (err) {
        alert('Failed to delete address');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        
        {/* Profile Header */}
        <div className="card glass" style={{padding: '3rem', textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <User size={48} />
          </div>
          <h1 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>User Profile</h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '1.25rem'}}>{user?.sub || 'User Email'}</p>
          <div style={{marginTop: '1rem', display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '2rem', fontWeight: 'bold'}}>
            ROLE: {user?.role || 'BUYER'}
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h2 style={{fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <MapPin /> Shipping Addresses
          </h2>
          <button onClick={() => setFormVisible(!formVisible)} className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Plus size={18} /> {formVisible ? 'Cancel' : 'Add New Address'}
          </button>
        </div>

        {formVisible && (
          <div className="card glass" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem'}}>New Address Details</h3>
            <form onSubmit={handleAddAddress} style={{display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1rem'}}>
              
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-input" placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input required type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="form-input" placeholder="10 digit number" pattern="^[0-9]{10}$" />
              </div>

              <div className="form-group">
                <label className="form-label">Address Line</label>
                <input required type="text" name="addressLine" value={formData.addressLine} onChange={handleInputChange} className="form-input" placeholder="Street layout, House number" />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-input" placeholder="City" />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="form-input" placeholder="State" />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="form-input" placeholder="6 digit pincode" pattern="^[0-9]{6}$" />
              </div>

              <div className="form-group" style={{gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleInputChange} style={{width: '20px', height: '20px'}} />
                <label htmlFor="isDefault" className="form-label" style={{marginBottom: 0, cursor: 'pointer'}}>Use as default address</label>
              </div>

              <div style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Save Address</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="card glass" style={{padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
            <Home size={48} style={{opacity: 0.5, margin: '0 auto 1rem'}} />
            <p>You haven't saved any addresses yet.</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
            {addresses.map(address => (
              <div key={address.id} className="card glass" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', border: address.default || address.isDefault ? '2px solid var(--primary)' : '1px solid var(--border)'}}>
                {(address.default || address.isDefault) && (
                  <span style={{position: 'absolute', top: '1rem', right: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 'bold'}}>
                    <CheckCircle size={14} /> Default
                  </span>
                )}
                
                <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem', paddingRight: '40px'}}>{address.fullName}</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                  <Navigation size={16} style={{flexShrink: 0, marginTop: '0.25rem'}} />
                  <span>
                    {address.addressLine}<br />
                    {address.city}, {address.state} {address.pincode}
                  </span>
                </p>
                <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
                  <span style={{fontWeight: '500'}}>{address.phoneNumber}</span>
                  <button onClick={() => handleRemoveAddress(address.id)} className="btn btn-secondary" style={{padding: '0.35rem', color: 'var(--danger)', border: 'none'}}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
