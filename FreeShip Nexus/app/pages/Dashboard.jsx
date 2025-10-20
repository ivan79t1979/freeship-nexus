import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse] = await Promise.all([
        axios.get('/api/products')
      ]);

      const products = productsResponse.data.products || [];
      
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status === 'active').length,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: products.reduce((sum, p) => sum + p.listing_price, 0),
        monthlyRevenue: products.reduce((sum, p) => sum + p.listing_price, 0) * 0.3
      });

      setRecentProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your dropshipping business</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package className="text-blue-500" />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            <span className="stat-subtext">{stats.activeProducts} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart className="text-green-500" />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
            <span className="stat-subtext">{stats.pendingOrders} pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign className="text-yellow-500" />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
            <span className="stat-subtext">All time</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp className="text-purple-500" />
          </div>
          <div className="stat-content">
            <h3>Monthly Revenue</h3>
            <p className="stat-number">${stats.monthlyRevenue.toFixed(2)}</p>
            <span className="stat-subtext">This month</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Products</h2>
        {recentProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-icon" />
            <h3>No products yet</h3>
            <p>Start by importing your first product from the Research page.</p>
            <a href="/research" className="btn btn-primary">
              Import Product
            </a>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Supplier Price</th>
                  <th>Listing Price</th>
                  <th>Profit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        {product.images && product.images[0] && (
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="product-thumb"
                          />
                        )}
                        <span className="product-title">{product.title}</span>
                      </div>
                    </td>
                    <td>${product.supplier_price}</td>
                    <td>${product.listing_price}</td>
                    <td className="profit-cell">
                      ${(product.listing_price - product.supplier_price).toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge status-${product.status}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;