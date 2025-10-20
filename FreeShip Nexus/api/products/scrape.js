import { scrapeProduct } from '../../../lib/scraper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const productData = await scrapeProduct(url);
    res.json(productData);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape product',
      details: error.message 
    });
  }
}