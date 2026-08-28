import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { email: "alice@example.com", name: "Alice Johnson", passwordHash },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { email: "bob@example.com", name: "Bob Chen", passwordHash },
  });

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const products = [
    {
      slug: "pixel-forge",
      name: "Pixel Forge",
      tagline: "Design system tooling that ships tokens straight to code",
      description:
        "Pixel Forge syncs your Figma design tokens directly into typed CSS variables and Tailwind config, so design and code never drift.",
      websiteUrl: "https://example.com/pixel-forge",
      launchesAt: hourAgo,
      createdById: alice.id,
    },
    {
      slug: "querybird",
      name: "QueryBird",
      tagline: "Natural language to SQL, reviewed before it runs",
      description:
        "QueryBird lets your team ask questions in plain English and generates auditable SQL you approve before execution — no more blind trust in AI-written queries.",
      websiteUrl: "https://example.com/querybird",
      launchesAt: now,
      createdById: bob.id,
    },
    {
      slug: "driftwatch",
      name: "DriftWatch",
      tagline: "Catch API contract drift before your frontend does",
      description:
        "DriftWatch diffs your OpenAPI spec on every deploy and flags breaking changes before they reach production clients.",
      websiteUrl: "https://example.com/driftwatch",
      launchesAt: dayAhead,
      createdById: alice.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
