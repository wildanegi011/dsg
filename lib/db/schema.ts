import { pgTable, text, timestamp, real, bigint, bigserial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const productBrands = pgTable('product_brands', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const productTypes = pgTable('product_types', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  stock: bigint('stok', { mode: 'number' }).notNull(),
  brandId: bigint('product_brand_id', { mode: 'number' })
    .references(() => productBrands.id, { onDelete: 'cascade' })
    .notNull(),
  typeId: bigint('product_type_id', { mode: 'number' })
    .references(() => productTypes.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
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

