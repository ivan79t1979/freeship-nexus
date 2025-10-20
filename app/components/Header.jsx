import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Search, BarChart3, TrendingUp, ShoppingCart, RefreshCw } from 'lucide-react';

const Header = ({ user }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Package, label: 'Dashboard' },
    { path: '/research', icon: Search, label: 'Basic Research' },
    { path: '/advanced-research', icon: BarChart3, label: 'Advanced Research' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/automation', icon: RefreshCw, label: 'Automation' },
  ];

  return (
    <header className="header">
      <div className="header-brand">
        <Package size={24} />
        <span className="brand-name">FreeShip Nexus</span>
      </div>
      
      <nav className="nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="header-actions">
        {user ? (
          <div className="user-menu">
            <span>Welcome, {user.name}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="btn btn-outline btn-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary">Connect Store</button>
        )}
      </div>
    </header>
  );
};

export default Header;