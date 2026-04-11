import React, { useState, useEffect } from 'react';
import api from '../api';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Truck, ShoppingBag } from 'lucide-react';

const statusConfig = {
  PLACED:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: Clock,         label: 'Placed' },
  SHIPPING:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: Truck,         label: 'Shipped' },
  DELIVERED: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  icon: CheckCircle,   label: 'Delivered' },
  CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  icon: XCircle,       label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.PLACED;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.3rem 0.7rem', borderRadius: '999px',
      background: cfg.bg, color: cfg.color,
      fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap'
    }}>
      <Icon size={13} /> {cfg.label}
    </span>
  );
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/buyer/orders');
      setOrders(res.data || []);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.put(`/buyer/orders/${orderId}/cancel`);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedId(prev => prev === orderId ? null : orderId);
  };

  if (loading) return (
    <div className="page-container glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading orders...
    </div>
  );

  return (
    <div className="page-container container">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Package /> My Orders
      </h1>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      {orders.length === 0 ? (
        <div className="card glass" style={{ padding: '4rem', textAlign: 'center' }}>
          <ShoppingBag size={64} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)', opacity: 0.4 }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No orders yet</h2>
          <p style={{ color: 'var(--text-secondary)' }}>When you place an order, it will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const isExpanded = expandedId === order.orderId;
            const cfg = statusConfig[order.status] || statusConfig.PLACED;
            return (
              <div
                key={order.orderId}
                className="card glass"
                style={{ overflow: 'hidden', border: isExpanded ? `1px solid ${cfg.color}40` : '1px solid rgba(255,255,255,0.07)', transition: 'border 0.2s' }}
              >
                {/* ─── Order Summary Row ─── */}
                <div
                  onClick={() => toggleExpand(order.orderId)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem', cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>ORDER</p>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>#{order.orderId}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>DATE</p>
                      <p style={{ margin: 0, fontWeight: '500' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>TOTAL</p>
                      <p style={{ margin: 0, fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>${order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>STATUS</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.2rem' }}>ITEMS</p>
                      <p style={{ margin: 0, fontWeight: '500' }}>{order.items?.length || 0} product{order.items?.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(order.orderId); }}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.9rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    )}
                    {isExpanded
                      ? <ChevronUp size={20} style={{ opacity: 0.6 }} />
                      : <ChevronDown size={20} style={{ opacity: 0.6 }} />}
                  </div>
                </div>

                {/* ─── Expanded Detail Panel ─── */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 1.5rem', background: 'rgba(0,0,0,0.15)' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Order Details
                    </h3>

                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {order.items?.map(item => (
                        <div
                          key={item.itemId || item.productId}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.85rem 1rem', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                            <div style={{
                              width: '38px', height: '38px', borderRadius: '8px',
                              background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                              <Package size={18} style={{ opacity: 0.7 }} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{item.productName}</p>
                              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>
                                ${item.price?.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <StatusBadge status={item.itemStatus || order.status} />
                            <p style={{ margin: 0, fontWeight: '700', color: 'var(--primary)', minWidth: '70px', textAlign: 'right' }}>
                              ${item.subtotal?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cost Summary */}
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem'
                    }}>
                      <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ opacity: 0.6 }}>Subtotal</span>
                        <span style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ opacity: 0.6 }}>Shipping</span>
                        <span style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right', color: '#22c55e' }}>Free</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>Total</span>
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)', minWidth: '80px', textAlign: 'right' }}>${order.totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
