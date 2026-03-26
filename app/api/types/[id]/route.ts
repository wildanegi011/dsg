import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productTypes } from '@/lib/db/schema';
import { updateProductTypeSchema } from '@/lib/db/validations';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const type = await db.query.productTypes.findFirst({
      where: eq(productTypes.id, parseInt(id)),
    });

    if (!type) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json(type);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateProductTypeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    const [updatedType] = await db
      .update(productTypes)
      .set(result.data)
      .where(eq(productTypes.id, parseInt(id)))
      .returning();

    if (!updatedType) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json(updatedType);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deletedType] = await db
      .delete(productTypes)
      .where(eq(productTypes.id, parseInt(id)))
      .returning();

    if (!deletedType) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Type deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
