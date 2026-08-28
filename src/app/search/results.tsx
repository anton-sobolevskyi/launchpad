import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type ProductWithUpvotes = Prisma.ProductGetPayload<{
  include: { upvotes: true };
}>;

export async function SearchResults({ query }: { query: string }) {
  const products: ProductWithUpvotes[] = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { tagline: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { upvotes: true },
    take: 20,
  });

  if (products.length === 0) {
    return <p className="text-sm text-dim">No launches match “{query}”.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.slug}`}
          className="flex items-center justify-between rounded-card border border-steel p-3 hover:border-dim"
        >
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-dim">{p.tagline}</div>
          </div>
          <span className="font-mono text-sm text-dim">
            ▲ {p.upvotes.length}
          </span>
        </Link>
      ))}
    </div>
  );
}
