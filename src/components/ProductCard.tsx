import Link from "next/link";
import { StatusStrip } from "./StatusStrip";
import { UpvoteButton } from "./UpvoteButton";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  launchesAt: Date;
  upvoteCount: number;
  upvotedByMe: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <div className="flex items-start gap-4 rounded-card border border-steel bg-panel p-4">
      <UpvoteButton
        productId={product.id}
        initialCount={product.upvoteCount}
        initialUpvoted={product.upvotedByMe}
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-lg font-medium text-paper hover:text-signal"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-dim">{product.tagline}</p>
        <div className="mt-2">
          <StatusStrip launchesAt={product.launchesAt} />
        </div>
      </div>
    </div>
  );
}
