import { Database } from 'sqlite3';
import { databaseService } from '../services/database';

export interface TechnicalProperty {
  property: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  product_id: string;
  name: string;
  full_name: string;
  description: string;
  brand: string;
  industry: string;
  chemistry?: string;
  url?: string;
  image?: string;
  benefits: string[];
  applications: string[];
  technical: TechnicalProperty[];
  sizing?: string[];
  published: boolean;
  benefits_count: number;
  created_at: string;
  updated_at: string;
  last_edited?: string;
}

export interface ProductStats {
  total_products: number;
  total_benefits: number;
  organized_date: string;
  hierarchy: string;
  notes: string;
}

export interface BrandIndustryCounts {
  [brand: string]: {
    [industry: string]: number;
  };
}

export class ProductModel {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
    this.createTable();
  }

  private createTable(): void {
    const sql = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        product_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        full_name TEXT NOT NULL,
        description TEXT,
        brand TEXT NOT NULL,
        industry TEXT NOT NULL,
        chemistry TEXT,
        url TEXT,
        image TEXT,
        benefits TEXT NOT NULL,
        applications TEXT NOT NULL,
        technical TEXT NOT NULL,
        sizing TEXT,
        published BOOLEAN DEFAULT 1,
        benefits_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_edited DATETIME
      )
    `;

    this.db.run(sql, (err) => {
      if (err) {
        console.error('Error creating products table:', err);
      } else {
        console.log('Products table created successfully');
      }
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM products ORDER BY created_at DESC';
      
      this.db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const products = rows.map(row => this.parseProduct(row));
          resolve(products);
        }
      });
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM products WHERE id = ? OR product_id = ?';
      
      this.db.get(sql, [id, id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(this.parseProduct(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return new Promise((resolve, reject) => {
      const id = product.product_id;
      const sql = `
        INSERT INTO products (
          id, product_id, name, full_name, description, brand, industry,
          chemistry, url, image, benefits, applications, technical, sizing,
          published, benefits_count, last_edited
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        id, product.product_id, product.name, product.full_name, product.description,
        product.brand, product.industry, product.chemistry, product.url, product.image,
        JSON.stringify(product.benefits), JSON.stringify(product.applications),
        JSON.stringify(product.technical), JSON.stringify(product.sizing),
        product.published ? 1 : 0, product.benefits_count, product.last_edited
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          const newProduct: Product = {
            ...product,
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          resolve(newProduct);
        }
      });
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
      if (updates.full_name) { fields.push('full_name = ?'); values.push(updates.full_name); }
      if (updates.description) { fields.push('description = ?'); values.push(updates.description); }
      if (updates.brand) { fields.push('brand = ?'); values.push(updates.brand); }
      if (updates.industry) { fields.push('industry = ?'); values.push(updates.industry); }
      if (updates.chemistry) { fields.push('chemistry = ?'); values.push(updates.chemistry); }
      if (updates.url) { fields.push('url = ?'); values.push(updates.url); }
      if (updates.image) { fields.push('image = ?'); values.push(updates.image); }
      if (updates.benefits) { fields.push('benefits = ?'); values.push(JSON.stringify(updates.benefits)); }
      if (updates.applications) { fields.push('applications = ?'); values.push(JSON.stringify(updates.applications)); }
      if (updates.technical) { fields.push('technical = ?'); values.push(JSON.stringify(updates.technical)); }
      if (updates.sizing) { fields.push('sizing = ?'); values.push(JSON.stringify(updates.sizing)); }
      if (updates.published !== undefined) { fields.push('published = ?'); values.push(updates.published ? 1 : 0); }
      if (updates.benefits_count !== undefined) { fields.push('benefits_count = ?'); values.push(updates.benefits_count); }
      if (updates.last_edited) { fields.push('last_edited = ?'); values.push(updates.last_edited); }

      if (fields.length === 0) {
        reject(new Error('No fields to update'));
        return;
      }

      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ? OR product_id = ?`;
      values.push(id); // Add id again for the second WHERE condition

      this.db.run(sql, values, (err: any) => {
        if (err) {
          reject(err);
        } else {
          // Check if any rows were affected
          this.db.get('SELECT changes() as changes', [], (err2: any, row: any) => {
            if (err2) {
              reject(err2);
            } else if (row.changes === 0) {
              resolve(null);
            } else {
              // Fetch the updated product
              const productModel = new ProductModel(databaseService.getDatabase());
              productModel.getProductById(id).then(resolve).catch(reject);
            }
          });
        }
      });
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM products WHERE id = ? OR product_id = ?';
      
      this.db.run(sql, [id, id], (err: any) => {
        if (err) {
          reject(err);
        } else {
          this.db.get('SELECT changes() as changes', [], (err2: any, row: any) => {
            if (err2) {
              reject(err2);
            } else {
              resolve(row.changes > 0);
            }
          });
        }
      });
    });
  }

  async getStatistics(): Promise<ProductStats> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_products,
          SUM(benefits_count) as total_benefits
        FROM products
      `;
      
      this.db.get(sql, [], (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          const stats: ProductStats = {
            total_products: row.total_products || 0,
            total_benefits: row.total_benefits || 0,
            organized_date: new Date().toISOString().split('T')[0] || new Date().toISOString(),
            hierarchy: "Brand → Industry → Products",
            notes: "Forza Products Management System Database"
          };
          resolve(stats);
        }
      });
    });
  }

  async getBrandIndustryCounts(): Promise<BrandIndustryCounts> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT brand, industry, COUNT(*) as count FROM products GROUP BY brand, industry';
      
      this.db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const counts: BrandIndustryCounts = {};
          
          rows.forEach(row => {
            if (!counts[row.brand]) {
              counts[row.brand] = {};
            }
            if (!counts[row.brand]) {
              counts[row.brand] = {};
            }
            counts[row.brand][row.industry] = row.count;
          });
          
          resolve(counts);
        }
      });
    });
  }

  private parseProduct(row: any): Product {
    return {
      id: row.id,
      product_id: row.product_id,
      name: row.name,
      full_name: row.full_name,
      description: row.description,
      brand: row.brand,
      industry: row.industry,
      chemistry: row.chemistry,
      url: row.url,
      image: row.image,
      benefits: JSON.parse(row.benefits || '[]'),
      applications: JSON.parse(row.applications || '[]'),
      technical: JSON.parse(row.technical || '[]'),
      sizing: row.sizing ? JSON.parse(row.sizing) : undefined,
      published: Boolean(row.published),
      benefits_count: row.benefits_count || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
      last_edited: row.last_edited
    };
  }
}
