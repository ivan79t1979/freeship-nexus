import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        store_id INTEGER,
        original_url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        supplier_price DECIMAL(10,2) NOT NULL,
        listing_price DECIMAL(10,2) NOT NULL,
        profit_margin DECIMAL(5,2) NOT NULL,
        supplier_name TEXT NOT NULL,
        images JSONB,
        variants JSONB,
        supplier_stock INTEGER,
        our_stock INTEGER,
        status TEXT DEFAULT 'draft',
        ebay_item_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        last_updated TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        store_id INTEGER NOT NULL,
        platform_order_id TEXT UNIQUE,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        shipping_address JSONB,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        total_price DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        supplier_order_id TEXT,
        tracking_number TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export class User {
  static async create(email, password) {
    const passwordHash = await bcrypt.hash(password, 12);
    
    const result = await sql`
      INSERT INTO users (email, password_hash) 
      VALUES (${email}, ${passwordHash})
      RETURNING id
    `;
    
    return result.rows[0].id;
  }

  static async findByEmail(email) {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0];
  }

  static async findById(id) {
    const result = await sql`
      SELECT id, email, created_at FROM users WHERE id = ${id}
    `;
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export class Product {
  static async create(productData) {
    const {
      userId, originalUrl, title, description, supplierPrice,
      listingPrice, profitMargin, supplierName, images, variants, supplierStock
    } = productData;

    const result = await sql`
      INSERT INTO products (
        user_id, original_url, title, description, supplier_price,
        listing_price, profit_margin, supplier_name, images, variants, supplier_stock, our_stock
      ) VALUES (
        ${userId}, ${originalUrl}, ${title}, ${description}, ${supplierPrice},
        ${listingPrice}, ${profitMargin}, ${supplierName}, 
        ${JSON.stringify(images)}, 
        ${JSON.stringify(variants || [])},
        ${supplierStock}, ${supplierStock}
      )
      RETURNING id
    `;

    return result.rows[0].id;
  }

  static async findByUser(userId) {
    const result = await sql`
      SELECT * FROM products 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    
    return result.rows;
  }
}