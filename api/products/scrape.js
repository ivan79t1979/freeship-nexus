import { scrapeProduct } from '../../lib/scraper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Scrape API: Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    console.log('Scrape API: Received request for URL:', url);
    
    if (!url) {
      console.log('Scrape API: URL is missing');
      return res.status(400).json({ error: 'URL is required' });
    }

    const productData = await scrapeProduct(url);
    console.log('Scrape API: Product data scraped successfully', productData);
    res.json(productData);
  } catch (error) {
    console.error('Scrape API: Error during scraping:', error.message);
    res.status(500).json({ 
      error: 'Failed to scrape product',
      details: error.message 
    });
  }
}