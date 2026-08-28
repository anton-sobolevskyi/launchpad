import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0E1116",
          color: "#E8EAED",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#FF6B35",
            }}
          />
          <span style={{ fontSize: 24, color: "#8891A0" }}>
            Launchpad launch
          </span>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 24 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 32, color: "#8891A0", marginTop: 16 }}>
          {product.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
