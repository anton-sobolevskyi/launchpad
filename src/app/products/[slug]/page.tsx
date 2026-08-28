import type { Metadata } from "next";
import { getProductBySlug, ProductDetail } from "@/components/ProductDetail";
import { CommentSection } from "@/components/CommentSection";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: `${product.name} — Launchpad`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <ProductDetail product={product} />
      <div className="mt-10 border-t border-steel pt-6">
        <CommentSection
          productId={product.id}
          comments={product.comments.map((c) => ({
            id: c.id,
            content: c.content,
            authorName: c.user.name,
          }))}
        />
      </div>
    </main>
  );
}
