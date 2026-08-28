import Link from "next/link";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { StatusStrip } from "@/components/StatusStrip";

type ProductWithStats = Prisma.ProductGetPayload<{
  include: { upvotes: true; comments: true };
}>;

export default async function SubmissionsSlot() {
  const session = await auth();
  if (!session?.user) return null;

  const products: ProductWithStats[] = await prisma.product.findMany({
    where: { createdById: session.user.id },
    include: { upvotes: true, comments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="rounded-card border border-steel bg-panel p-4">
      <h2 className="font-display text-lg font-semibold">Your submissions</h2>
      <div className="mt-3 flex flex-col gap-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="flex items-center justify-between rounded-card border border-steel p-3 hover:border-dim"
          >
            <div>
              <div className="font-medium">{p.name}</div>
              <StatusStrip launchesAt={p.launchesAt} />
            </div>
            <span className="font-mono text-xs text-dim">
              ▲{p.upvotes.length} · {p.comments.length} comments
            </span>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-dim">
            You haven't launched anything yet.
          </p>
        )}
      </div>
    </div>
  );
}
