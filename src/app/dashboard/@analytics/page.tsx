import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function AnalyticsSlot() {
  const session = await auth();
  if (!session?.user) return null;

  const [totalUpvotes, totalComments, totalProducts] = await Promise.all([
    prisma.upvote.count({ where: { product: { createdById: session.user.id } } }),
    prisma.comment.count({ where: { product: { createdById: session.user.id } } }),
    prisma.product.count({ where: { createdById: session.user.id } }),
  ]);

  return (
    <div className="rounded-card border border-steel bg-panel p-4">
      <h2 className="font-mono text-xs uppercase tracking-wide text-dim">
        Lifetime stats
      </h2>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <dt className="font-mono text-2xl text-vapor">{totalProducts}</dt>
          <dd className="text-xs text-dim">launches</dd>
        </div>
        <div>
          <dt className="font-mono text-2xl text-vapor">{totalUpvotes}</dt>
          <dd className="text-xs text-dim">upvotes</dd>
        </div>
        <div>
          <dt className="font-mono text-2xl text-vapor">{totalComments}</dt>
          <dd className="text-xs text-dim">comments</dd>
        </div>
      </dl>
    </div>
  );
}
