import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type ProductWithUpvotes = Prisma.ProductGetPayload<{
  include: { upvotes: true };
}>;

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json([]);

  const products: ProductWithUpvotes[] = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 20,
    include: { upvotes: true },
  });

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      upvoteCount: p.upvotes.length,
    }))
  );
}
