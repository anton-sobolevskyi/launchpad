import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { ProductCard } from "@/components/ProductCard";

type ProductWithUpvotes = Prisma.ProductGetPayload<{
  include: { upvotes: true };
}>;

// Revalidate the feed every minute — trending order shifts as upvotes land,
// but it doesn't need to be computed on every single request.
export const revalidate = 60;

export default async function FeedPage() {
  const session = await auth();

  const products: ProductWithUpvotes[] = await prisma.product.findMany({
    orderBy: [{ launchesAt: "desc" }],
    include: { upvotes: true },
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Today's launches</h1>
        <p className="mt-1 text-sm text-dim">
          Fresh products from makers, ranked by upvotes.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={{
              id: p.id,
              slug: p.slug,
              name: p.name,
              tagline: p.tagline,
              launchesAt: p.launchesAt,
              upvoteCount: p.upvotes.length,
              upvotedByMe: session
                ? p.upvotes.some((u) => u.userId === session.user.id)
                : false,
            }}
          />
        ))}
        {products.length === 0 && (
          <p className="text-dim">
            Nothing launched yet.{" "}
            <a href="/submit" className="text-signal">
              Be the first
            </a>
            .
          </p>
        )}
      </div>
    </main>
  );
}
