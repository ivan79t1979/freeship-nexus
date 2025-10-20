import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Users, Package, DollarSign, ShoppingCart, Download } from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data for now
      setAnalytics({
        overview: {
          totalRevenue: 1250.50,
          totalOrders: 15,
          averageOrderValue: 83.37,
          profitMargin: 35.2
        }
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading analytics...</div></div>;
  if (!analytics) return <div className="page"><div className="alert alert-error">Failed to load analytics</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Business Analytics</h1>
        <p>Comprehensive insights into your dropshipping performance</p>
      </div>

      <div className="stats-grid">
        <div className="metric-card">
          <div className="metric-icon bg-blue-100">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${analytics.overview.totalRevenue.toFixed(2)}</p>
            <span className="metric-trend positive">+12.5%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-100">
            <ShoppingCart className="text-green-600" size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Orders</h3>
            <p className="metric-value">{analytics.overview.totalOrders}</p>
            <span className="metric-trend positive">+8.3%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-purple-100">
            <Users className="text-purple-600" size={24} />
          </div>
          <div className="metric-content">
            <h3>Avg Order Value</h3>
            <p className="metric-value">${analytics.overview.averageOrderValue.toFixed(2)}</p>
            <span className="metric-trend">Per order</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-orange-100">
            <TrendingUp className="text-orange-600" size={24} />
          </div>
          <div className="metric-content">
            <h3>Profit Margin</h3>
            <p className="metric-value">{analytics.overview.profitMargin.toFixed(1)}%</p>
            <span className="metric-trend">Net margin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;