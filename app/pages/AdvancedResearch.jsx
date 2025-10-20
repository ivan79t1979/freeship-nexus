import React, { useState } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';

const AdvancedResearch = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/research/analyze', { url });
      setAnalysis(response.data);
    } catch (error) {
      alert('Analysis failed: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Advanced Product Research</h1>
        <p>Deep analysis of product opportunities and risks</p>
      </div>

      <div className="card">
        <form onSubmit={handleAnalyze} className="url-form">
          <div className="form-group">
            <label>Product URL</label>
            <input
              type="url"
              placeholder="Paste product URL for deep analysis..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <BarChart3 size={16} />
            {loading ? 'Analyzing...' : 'Analyze Product'}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="card">
          <h2>Analysis Results</h2>
          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>Opportunity Score</h3>
              <div className="score-excellent">85/100</div>
              <p>Good market opportunity</p>
            </div>
            <div className="analysis-card">
              <h3>Risk Assessment</h3>
              <div className="risk-level-low">Low Risk</div>
              <p>Stable market conditions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedResearch;