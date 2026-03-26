import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productTypes } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const types = await db.query.productTypes.findMany({
      orderBy: asc(productTypes.name),
    });
    return NextResponse.json(types);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
