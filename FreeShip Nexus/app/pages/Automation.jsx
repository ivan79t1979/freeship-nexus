import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Play, Pause, Settings, TrendingUp, Package } from 'lucide-react';

const Automation = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Mock settings for now
      setSettings({
        autoPriceUpdate: true,
        autoStockSync: true,
        priceUpdateInterval: '6',
        profitMargin: '30'
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="loading">Loading automation settings...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Automation Settings</h1>
        <p>Configure automated processes for your dropshipping business</p>
      </div>

      <div className="card">
        <h2>Automation Settings</h2>
        <div className="settings-grid">
          <div className="setting-group">
            <div className="setting-header">
              <TrendingUp size={20} />
              <h3>Price Automation</h3>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Auto Price Updates</label>
                <p>Automatically update prices when supplier prices change</p>
              </div>
              <button className="toggle-btn active">
                <Play size={16} />
                Enabled
              </button>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-header">
              <Package size={20} />
              <h3>Stock Automation</h3>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Auto Stock Sync</label>
                <p>Automatically sync stock levels with suppliers</p>
              </div>
              <button className="toggle-btn active">
                <Play size={16} />
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;