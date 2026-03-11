import { NextRequest, NextResponse } from "next/server";

function checkAuth(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
  }

  const { messages, clientContext } = await req.json();

  const systemPrompt = `You are a senior web developer helping build a client's website. You're working inside a CRM workspace.

CLIENT CONTEXT:
- Name: ${clientContext.name}
- Company: ${clientContext.company}
- Goal: ${clientContext.goal || "Not specified"}
- Style: ${clientContext.style || "Not specified"}
- Typography: ${clientContext.typography || "Not specified"}
- Sections: ${(clientContext.sections || []).join(", ") || "Not specified"}
- Colors: ${(clientContext.colors || []).join(", ") || "Not specified"}
- Audience: ${clientContext.audience || "Not specified"}

Your job:
1. Help the admin iterate on the website design and code
2. When asked to build or modify, provide the full HTML/CSS code
3. Use Tailwind CSS via CDN for styling
4. Match the client's brand colors, typography style, and overall mood
5. Keep responses focused and actionable
6. When providing code, wrap it in a code block

Be concise. The admin wants results, not explanations.`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("OpenRouter error:", res.status, body);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Workspace AI error:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
