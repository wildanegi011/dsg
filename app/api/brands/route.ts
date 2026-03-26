import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productBrands } from '@/lib/db/schema';
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
