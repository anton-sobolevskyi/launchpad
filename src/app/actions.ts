"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function toggleUpvote(productId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Must be logged in to upvote");

  const existing = await prisma.upvote.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.upvote.delete({ where: { id: existing.id } });
  } else {
    await prisma.upvote.create({
      data: { userId: session.user.id, productId },
    });
  }

  revalidatePath("/");
  revalidatePath(`/products`);
}

export async function postComment(productId: string, content: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Must be logged in to comment");
  if (!content.trim()) return;

  await prisma.comment.create({
    data: { content: content.trim(), productId, userId: session.user.id },
  });

  revalidatePath(`/products`);
}

const submitSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().min(5, "Tagline must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  websiteUrl: z.string().url("Must be a valid URL"),
});

export interface SubmitFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function submitProduct(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to submit a product." };
  }

  const parsed = submitSchema.safeParse({
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    websiteUrl: formData.get("websiteUrl"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  const product = await prisma.product.create({
    data: { ...parsed.data, slug, createdById: session.user.id },
  });

  revalidatePath("/");
  redirect(`/products/${product.slug}`);
}
