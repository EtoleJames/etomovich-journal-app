export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * POST /api/ai/analyze
 * Expects JSON payload: { text: string }
 * Returns an analysis including sentiment, key themes, and writing suggestions.
 */
export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required for analysis." }, { status: 400 });
    }

    // Prepare the prompt for the OpenAI API.
    const prompt = `Analyze the following journal entry for sentiment, key themes, and provide 2 writing suggestions to improve it:
    
    Entry: """${text}"""
    
    Please provide your answer in JSON format with keys "sentiment", "themes", and "suggestions".`;

    // Call the OpenAI Chat Completion API.
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // use a stable model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error", await response.text());
      return NextResponse.json({ error: "Failed to analyze text." }, { status: 500 });
    }

    const result = await response.json();
    // Extract the content from the completion response.
    const aiOutput = result.choices[0].message.content;
    // For simplicity, we assume the model output is valid JSON.
    const analysis = JSON.parse(aiOutput);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("AI Analysis error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
