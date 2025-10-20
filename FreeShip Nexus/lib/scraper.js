import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeProduct(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);

    if (url.includes('aliexpress.com')) {
      return scrapeAliExpress($, url);
    } else if (url.includes('walmart.com')) {
      return scrapeWalmart($, url);
    } else {
      throw new Error('Unsupported website');
    }
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}

function scrapeAliExpress($, url) {
  const title = $('h1').first().text().trim() || 'Product Title';
  const priceText = $('[class*="price"]').first().text().trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

  const images = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && src.includes('alicdn.com')) {
      images.push(src.startsWith('//') ? `https:${src}` : src);
    }
  });

  return {
    title,
    price,
    currency: 'USD',
    images: images.slice(0, 10),
    description: $('.product-description').text().trim() || 'No description available',
    variants: ['Default'],
    stock: 100,
    url,
    supplier: 'AliExpress',
    scrapedAt: new Date().toISOString()
  };
}

function scrapeWalmart($, url) {
  const title = $('h1').first().text().trim() || 'Product Title';
  const priceText = $('[data-testid*="price"]').first().text().trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

  const images = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && src.includes('walmart')) {
      images.push(src);
    }
  });

  return {
    title,
    price,
    currency: 'USD',
    images: images.slice(0, 10),
    description: $('[data-testid*="description"]').text().trim() || 'No description available',
    variants: ['Default'],
    stock: 100,
    url,
    supplier: 'Walmart',
    scrapedAt: new Date().toISOString()
  };
}