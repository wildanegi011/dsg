import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productTypes } from '@/lib/db/schema';
import { insertProductTypeSchema } from '@/lib/db/validations';
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = insertProductTypeSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    const [newType] = await db.insert(productTypes).values(result.data).returning();
    return NextResponse.json(newType, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

