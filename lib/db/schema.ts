import { pgTable, text, timestamp, decimal, serial, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const productBrands = pgTable('product_brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productTypes = pgTable('product_types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  brandId: integer('brand_id')
    .references(() => productBrands.id, { onDelete: 'cascade' })
    .notNull(),
  typeId: integer('type_id')
    .references(() => productTypes.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  brand: one(productBrands, {
    fields: [products.brandId],
    references: [productBrands.id],
  }),
  type: one(productTypes, {
    fields: [products.typeId],
    references: [productTypes.id],
  }),
}));

export const productBrandsRelations = relations(productBrands, ({ many }) => ({
  products: many(products),
}));

export const productTypesRelations = relations(productTypes, ({ many }) => ({
  products: many(products),
}));
