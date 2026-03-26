import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productBrands } from '@/lib/db/schema';
import { insertProductBrandSchema } from '@/lib/db/validations';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const brands = await db.query.productBrands.findMany({
      orderBy: asc(productBrands.name),
    });
    return NextResponse.json(brands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = insertProductBrandSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    const [newBrand] = await db.insert(productBrands).values(result.data).returning();
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

