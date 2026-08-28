import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { StatusStrip } from "./StatusStrip";
import { UpvoteButton } from "./UpvoteButton";

const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    upvotes: true,
    createdBy: { select: { name: true } },
    comments: {
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    },
  },
});

export type ProductWithRelations = Prisma.ProductGetPayload<
  typeof productWithRelations
>;

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations> {
  const product = await prisma.product.findUnique({
    where: { slug },
    ...productWithRelations,
  });
  if (!product) notFound();
  return product;
}

export async function ProductDetail({
  product,
  compact = false,
}: {
  product: ProductWithRelations;
  compact?: boolean;
}) {
  const session = await auth();
  const upvotedByMe = session
    ? product.upvotes.some((u) => u.userId === session.user.id)
    : false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <UpvoteButton
          productId={product.id}
          initialCount={product.upvotes.length}
          initialUpvoted={upvotedByMe}
        />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold">{product.name}</h1>
          <p className="mt-1 text-dim">{product.tagline}</p>
          <div className="mt-2 flex items-center gap-3">
            <StatusStrip launchesAt={product.launchesAt} />
            <span className="text-xs text-dim">
              by {product.createdBy.name}
            </span>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <p className="text-sm leading-relaxed text-paper/90">
            {product.description}
          </p>
          <a
            href={product.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="w-fit rounded-card border border-steel px-4 py-2 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Visit website →
          </a>
        </>
      )}
    </div>
  );
}
