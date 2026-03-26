import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products, productBrands, productTypes } from './schema';
import { z } from 'zod';

// -- PRODUCT BRANDS --
export const insertProductBrandSchema = createInsertSchema(productBrands, {
  name: (schema) => schema.min(1, 'Name is required'),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateProductBrandSchema = insertProductBrandSchema.partial();


// -- PRODUCT TYPES --
export const insertProductTypeSchema = createInsertSchema(productTypes, {
  name: (schema) => schema.min(1, 'Name is required'),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateProductTypeSchema = insertProductTypeSchema.partial();


// -- PRODUCTS --
export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.min(1, 'Name is required'),
  brandId: z.number().int().positive('Brand ID must be valid'),
  typeId: z.number().int().positive('Type ID must be valid'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  price: z.union([z.number(), z.string()]).refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Price must be positive'),
  description: z.string().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateProductSchema = insertProductSchema.partial();

// Types derived from Zod schemas for TypeScript usage
export type InsertProductBrand = z.infer<typeof insertProductBrandSchema>;
export type UpdateProductBrand = z.infer<typeof updateProductBrandSchema>;

export type InsertProductType = z.infer<typeof insertProductTypeSchema>;
export type UpdateProductType = z.infer<typeof updateProductTypeSchema>;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
