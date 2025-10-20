import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Clock, Package, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock orders for now
      setOrders([]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading orders...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>Manage and fulfill your customer orders</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart className="text-blue-500" />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">0</p>
            <span className="stat-subtext">All time</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock className="text-yellow-500" />
          </div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-number">0</p>
            <span className="stat-subtext">Need attention</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="empty-state">
          <ShoppingCart size={48} className="empty-icon" />
          <h3>No orders yet</h3>
          <p>Orders from your connected stores will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;