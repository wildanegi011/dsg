import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { insertProductSchema } from '@/lib/db/validations';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        brand: true,
        type: true,
      },
      orderBy: desc(products.createdAt),
    });
    return NextResponse.json(allProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = insertProductSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      ...result.data,
      price: Number(result.data.price)
    }).returning();


    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
