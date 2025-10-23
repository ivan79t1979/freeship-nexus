import { Product } from '../../lib/database.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = verifyToken(token);
    const { productData, profitMargin = 30 } = req.body;

    const supplierPrice = productData.price;
    const listingPrice = supplierPrice * (1 + profitMargin / 100);

    const productId = await Product.create({
      userId: decoded.id,
      originalUrl: productData.url,
      title: productData.title,
      description: productData.description,
      supplierPrice,
      listingPrice,
      profitMargin,
      supplierName: productData.supplier,
      images: productData.images,
      variants: productData.variants,
      supplierStock: productData.stock
    });

    res.json({
      success: true,
      message: 'Product imported successfully',
      productId,
      listingPrice
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message });
  }
}