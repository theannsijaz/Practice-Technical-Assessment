import { NextResponse } from "next/server";
import { getCohereClient } from "@/lib/cohere";

const SYSTEM_PROMPT = `You are an expert writing coach. Given user-provided text, return a concise JSON object with:
- "summary": one short paragraph (max 60 words) summarizing the core message.
- "insights": an array of exactly 3 crisp, standalone insights or takeaways.
- "title": a punchy, 3-8 word title.
Keep language clear and specific. If the input is too short to analyze, politely say so in the summary and insights.`;

export async function POST(req: Request) {
  try {
    const { text } = (await req.json()) as { text?: string };
    const cleaned = (text || "").trim();

    if (!cleaned) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (cleaned.length > 2000) {
      return NextResponse.json({ error: "Please keep the input under 2000 characters." }, { status: 400 });
    }

    const cohere = getCohereClient();

    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      preamble: SYSTEM_PROMPT,
      message: `Generate a JSON object with keys summary, insights (array of 3), and title for this text: ${cleaned}`,
      temperature: 0.4,
      max_tokens: 320,
      response_format: { type: "json_object" },
    });

    const content = response.message?.content?.[0]?.text ?? response.text ?? "";

    let parsed: { summary?: string; insights?: string[]; title?: string };
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return NextResponse.json({ error: "Unexpected response format from the model." }, { status: 500 });
    }

    const summary = parsed.summary ?? "No summary returned.";
    const insights = Array.isArray(parsed.insights) ? parsed.insights.slice(0, 3) : [];
    const title = parsed.title ?? "Untitled";

    return NextResponse.json({ summary, insights, title });
  } catch (error) {
    console.error("/api/insights error", error);
    const message = error instanceof Error ? error.message : "Failed to generate insights. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
