import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeProduct(url) {
  console.log('Starting scrape for URL:', url);
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      },
      timeout: 30000
    });
    console.log('Axios request successful. Status:', response.status);
    console.log('Response data length:', response.data.length);

    const $ = cheerio.load(response.data);

    if (url.includes('aliexpress.com')) {
      console.log('Scraping AliExpress');
      return scrapeAliExpress($, url);
    } else if (url.includes('walmart.com')) {
      console.log('Scraping Walmart');
      return scrapeWalmart($, url);
    } else {
      console.error('Unsupported website:', url);
      throw new Error('Unsupported website');
    }
  } catch (error) {
    console.error('Scraping function error:', error.message);
    if (error.response) {
      console.error('Axios response error status:', error.response.status);
      console.error('Axios response error data:', error.response.data);
    }
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}

function scrapeAliExpress($, url) {
  console.log('Inside scrapeAliExpress');
  const title = $('h1').first().text().trim() || $('.product-main-info h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || 'Product Title';
  const priceText = $('.product-price-value').first().text().trim() || $('[data-price]').first().text().trim() || $('[class*="price"]').first().text().trim() || $('.uniform-banner-box-price').text().trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

  const images = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src') || $(elem).attr('data-src');
    if (src && src.includes('alicdn.com')) {
      images.push(src.startsWith('//') ? `https:${src}` : src);
    }
  });

  console.log('AliExpress Scraped Title:', title);
  console.log('AliExpress Scraped Price:', price);

  return {
    title,
    price,
    currency: 'USD',
    images: images.slice(0, 10),
    description: $('.product-description-content').text().trim() || $('.product-overview-content').text().trim() || $('.detail-desc-decorate-content').text().trim() || $('meta[property="og:description"]').attr('content') || 'No description available',
    variants: ['Default'],
    stock: 100,
    url,
    supplier: 'AliExpress',
    scrapedAt: new Date().toISOString()
  };
}

function scrapeWalmart($, url) {
  console.log('Inside scrapeWalmart');
  const title = $('h1').first().text().trim() || $('.product-name').first().text().trim() || $('meta[property="og:title"]').attr('content') || 'Product Title';
  const priceText = $('[data-automation="product-price"]').first().text().trim() || $('span[itemprop="price"]').first().text().trim() || $('[data-testid*="price"]').first().text().trim() || $('.price-characteristic').first().text().trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

  const images = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src') || $(elem).attr('data-src');
    if (src && src.includes('walmart')) {
      images.push(src);
    }
  });

  console.log('Walmart Scraped Title:', title);
  console.log('Walmart Scraped Price:', price);

  return {
    title,
    price,
    currency: 'USD',
    images: images.slice(0, 10),
    description: $('div[itemprop="description"]').text().trim() || $('.product-description').text().trim() || $('[data-testid*="description"]').first().text().trim() || $('meta[property="og:description"]').attr('content') || 'No description available',
    variants: ['Default'],
    stock: 100,
    url,
    supplier: 'Walmart',
    scrapedAt: new Date().toISOString()
  };
}