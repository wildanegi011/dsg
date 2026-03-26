"use server"

import { db } from "@/lib/db"
import { products, productBrands, productTypes } from "@/lib/db/schema"
import { insertProductSchema, updateProductSchema } from "@/lib/db/validations"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  return await db.query.products.findMany({
    with: {
      brand: true,
      type: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  })
}

export async function getBrands() {
  return await db.query.productBrands.findMany({
    orderBy: (brands, { asc }) => [asc(brands.name)],
  })
}

export async function getProductTypes() {
  return await db.query.productTypes.findMany({
    orderBy: (types, { asc }) => [asc(types.name)],
  })
}

export async function createProduct(data: any) {
  const result = insertProductSchema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.message)
  }
  
  await db.insert(products).values({
    ...result.data,
    price: result.data.price?.toString() as string
  })
  revalidatePath("/products")
}

export async function updateProduct(id: number, data: any) {
  const result = updateProductSchema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.message)
  }
  
  await db.update(products).set({
    ...result.data,
    price: result.data.price?.toString()
  }).where(eq(products.id, id))
  revalidatePath("/products")
}


export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/products")
}
