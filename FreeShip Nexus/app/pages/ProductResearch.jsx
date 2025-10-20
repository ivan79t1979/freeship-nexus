import React, { useState } from 'react';
import axios from 'axios';
import { ExternalLink, Download, AlertCircle } from 'lucide-react';

const ProductResearch = () => {
  const [url, setUrl] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/products/scrape', { url });
      setProduct(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scrape product');
      console.error('Scraping error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!product) return;

    try {
      const response = await axios.post('/api/products/import', {
        productData: product,
        storeType: 'ebay'
      });
      
      alert('Product imported successfully!');
    } catch (err) {
      setError('Failed to import product');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Product Research</h1>
        <p>Find and import products from AliExpress, Walmart, and more</p>
      </div>

      <div className="card">
        <form onSubmit={handleScrape} className="url-form">
          <div className="form-group">
            <label htmlFor="product-url">Product URL</label>
            <input
              id="product-url"
              type="url"
              placeholder="Paste product URL from AliExpress, Walmart, etc."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !url}
          >
            {loading ? 'Scraping...' : 'Scrape Product'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {product && (
        <div className="card product-display">
          <div className="product-header">
            <h2>{product.title}</h2>
            <div className="product-actions">
              <button 
                onClick={handleImport}
                className="btn btn-success"
              >
                <Download size={16} />
                Import to Store
              </button>
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <ExternalLink size={16} />
                View Original
              </a>
            </div>
          </div>

          <div className="product-content">
            <div className="product-images">
              {product.images && product.images.slice(0, 5).map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${product.title} - Image ${index + 1}`}
                  className="product-image"
                />
              ))}
            </div>

            <div className="product-details">
              <div className="detail-group">
                <h3>Pricing</h3>
                <div className="price">
                  ${product.price} {product.currency}
                </div>
              </div>

              <div className="detail-group">
                <h3>Stock</h3>
                <span className="stock-badge">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="detail-group">
                <h3>Supplier</h3>
                <span>{product.supplier}</span>
              </div>

              <div className="detail-group">
                <h3>Description</h3>
                <p className="description">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductResearch;