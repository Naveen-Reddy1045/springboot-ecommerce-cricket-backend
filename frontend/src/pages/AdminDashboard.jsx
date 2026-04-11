import React, { useState, useEffect } from 'react';
import api from '../api';
import { LayoutDashboard, Users, UserCheck, UserX, Package, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, ordersRes, revenueRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/orders'),
        api.get('/admin/revenue')
      ]);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
      setRevenue(revenueRes.data || 0);
    } catch (err) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to toggle user status');
    }
  };

  return (
    <div className="page-container container">
      <h1 style={{fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <LayoutDashboard /> Admin Dashboard
      </h1>

      <div style={{display: 'flex', gap: '1.5rem', marginBottom: '3rem'}}>
        <div className="card glass" style={{flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <div style={{padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', color: 'var(--primary)'}}>
            <DollarSign size={32} />
          </div>
          <div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>Total Revenue</p>
            <h3 style={{fontSize: '2rem', fontWeight: 'bold'}}>${revenue?.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="card glass" style={{flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <div style={{padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: 'var(--secondary)'}}>
            <Users size={32} />
          </div>
          <div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>Total Users</p>
            <h3 style={{fontSize: '2rem', fontWeight: 'bold'}}>{users.length}</h3>
          </div>
        </div>

        <div className="card glass" style={{flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <div style={{padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)'}}>
            <Package size={32} />
          </div>
          <div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>Total Orders</p>
            <h3 style={{fontSize: '2rem', fontWeight: 'bold'}}>{orders.length}</h3>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
        <div style={{flex: '1 1 500px'}}>
          <div className="card glass" style={{padding: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Users size={20} /> User Management
            </h2>
            {loading ? <p>Loading...</p> : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="badge" style={{background: u.role === 'ADMIN' ? 'var(--danger)' : u.role === 'SELLER' ? 'var(--secondary)' : 'var(--primary)'}}>{u.role}</span></td>
                        <td>
                          <button 
                            onClick={() => handleToggleUser(u.id)} 
                            className="btn btn-secondary" 
                            style={{padding: '0.25rem', border: 'none', color: u.enabled ? 'var(--secondary)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px'}}
                            title="Toggle Status"
                          >
                            {u.enabled ? <><UserCheck size={18}/> Active</> : <><UserX size={18}/> Inactive</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div style={{flex: '1 1 500px'}}>
          <div className="card glass" style={{padding: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Package size={20} /> Recent Orders
            </h2>
            {loading ? <p>Loading...</p> : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(o => (
                      <tr key={o.orderId}>
                        <td>#{o.orderId}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>${o.totalPrice?.toFixed(2)}</td>
                        <td>{o.orderStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
