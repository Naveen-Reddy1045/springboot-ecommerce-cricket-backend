import React, { useState, useEffect } from 'react';
import api from '../api';
import { Package, Plus, Trash2, Edit, TrendingUp, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, sold: 0, ordersCount: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'

  const fetchMyProducts = async () => {
    try {
      const res = await api.get('/seller/products');
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/seller/orders');
      const ordersData = res.data.data || res.data || [];
      setOrders(ordersData);
      
      let revenue = 0;
      let sold = 0;
      ordersData.forEach(o => {
        o.items?.forEach(i => {
          if (i.itemStatus !== 'CANCELLED') {
            revenue += i.subtotal || 0;
            sold += i.quantity || 0;
          }
        });
      });
      setStats({ revenue, sold, ordersCount: ordersData.length });
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMyProducts(), fetchMyOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };
      if (editingId) {
        await api.put(`/seller/products/${editingId}`, payload);
      } else {
        await api.post('/seller/products', payload);
      }
      setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
      setEditingId(null);
      fetchMyProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl || ''
    });
    setEditingId(product.id);
    setActiveTab('products');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/seller/products/${id}`);
        fetchMyProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      await api.put(`/seller/orders/${orderId}/items/${itemId}/status?status=${status}`);
      fetchMyOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="page-container container">
      <h1 style={{fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <Package /> Seller Dashboard
      </h1>

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}>
            <TrendingUp size={24} color="var(--primary)" />
          </div>
          <div>
            <p style={{ margin: 0, opacity: 0.8 }}>Total Revenue</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>${stats.revenue.toFixed(2)}</h3>
          </div>
        </div>
        <div className="card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}>
            <Package size={24} color="var(--primary)" />
          </div>
          <div>
            <p style={{ margin: 0, opacity: 0.8 }}>Products Sold</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.sold}</h3>
          </div>
        </div>
        <div className="card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}>
            <ShoppingCart size={24} color="var(--primary)" />
          </div>
          <div>
            <p style={{ margin: 0, opacity: 0.8 }}>Total Orders</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.ordersCount}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('orders')}
          style={{ background: activeTab === 'orders' ? 'var(--primary)' : 'transparent', border: activeTab === 'orders' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}
        >
          Manage Orders
        </button>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('products')}
          style={{ background: activeTab === 'products' ? 'var(--primary)' : 'transparent', border: activeTab === 'products' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}
        >
          Manage Products
        </button>
      </div>

      {loading ? <p>Loading dashboard data...</p> : (
        <>
          {activeTab === 'orders' && (
            <div className="card glass" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Orders</h2>
              {orders.length === 0 ? <p>No orders found.</p> : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order =>
                        order.items?.map(item => (
                          <tr key={item.itemId}>
                            <td>#{order.orderId}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={{ fontWeight: '500' }}>{item.productName}</td>
                            <td>x{item.quantity}</td>
                            <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${item.subtotal?.toFixed(2)}</td>
                            <td>
                              <select
                                className="form-input"
                                style={{ padding: '0.4rem 0.6rem', width: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
                                value={item.itemStatus || 'PLACED'}
                                onChange={(e) => updateItemStatus(order.orderId, item.itemId, e.target.value)}
                              >
                                <option value="PLACED">Placed</option>
                                <option value="SHIPPING">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
              <div style={{flex: '1 1 400px'}}>
                <div className="card glass" style={{padding: '2rem'}}>
                  <h2 style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input type="text" name="name" required className="form-input" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea name="description" required className="form-input" rows="3" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <div className="form-group" style={{flex: 1}}>
                        <label className="form-label">Price ($)</label>
                        <input type="number" step="0.01" name="price" required className="form-input" value={formData.price} onChange={handleChange} />
                      </div>
                      <div className="form-group" style={{flex: 1}}>
                        <label className="form-label">Stock</label>
                        <input type="number" name="stock" required className="form-input" value={formData.stock} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input type="text" name="category" required className="form-input" value={formData.category} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input type="text" name="imageUrl" className="form-input" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                      {editingId ? <><Edit size={16}/> Update Product</> : <><Plus size={16}/> Add Product</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => {setEditingId(null); setFormData({name: '', description: '', price: '', category: '', stock: '', imageUrl: ''});}} className="btn btn-secondary" style={{width: '100%', marginTop: '0.5rem'}}>
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              </div>
              
              <div style={{flex: '2 1 600px'}}>
                <div className="card glass" style={{padding: '1rem'}}>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>{p.category}</td>
                              <td>${p.price?.toFixed(2)}</td>
                              <td>{p.stock}</td>
                              <td>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                  <button onClick={() => handleEdit(p)} className="btn btn-secondary" style={{padding: '0.25rem', border: 'none', color: 'var(--primary)'}}>
                                    <Edit size={18} />
                                  </button>
                                  <button onClick={() => handleDelete(p.id)} className="btn btn-secondary" style={{padding: '0.25rem', border: 'none', color: 'var(--danger)'}}>
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboard;
