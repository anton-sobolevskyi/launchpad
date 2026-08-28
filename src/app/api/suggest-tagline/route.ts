import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "X-Title": "Launchpad",
  },
});

export async function POST(req: Request) {
  const { name, description } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      "Set OPENROUTER_API_KEY to enable AI tagline suggestions.",
      { status: 501 }
    );
  }

  const result = streamText({
    model: openrouter("openrouter/free"),
    system:
      "You write short, punchy product taglines for a Product Hunt-style launch site. " +
      "Reply with exactly one tagline, under 12 words, no quotation marks, no period.",
    prompt: `Product name: ${name}\nDescription: ${description}\n\nTagline:`,
  });

  return result.toTextStreamResponse();
}
