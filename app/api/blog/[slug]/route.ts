import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error obteniendo post:', error);
    return NextResponse.json(
      { error: 'Error al obtener artículo' },
      { status: 500 }
    );
  }
}
