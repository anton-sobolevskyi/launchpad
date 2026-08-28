import { Modal } from "@/components/Modal";
import { getProductBySlug, ProductDetail } from "@/components/ProductDetail";

export default async function ProductModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <Modal>
      <ProductDetail product={product} compact />
    </Modal>
  );
}
