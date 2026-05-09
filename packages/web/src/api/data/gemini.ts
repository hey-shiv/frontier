/**
 * Gemini provider — uses Google's generateContent REST API.
 * Model: gemini-2.0-flash (free tier, generous rate limits).
 */

export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxOutputTokens = 1200
): Promise<string> {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens,
      responseMimeType: "text/plain",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });

  if (res.status === 429) throw new Error("RATE_LIMIT:gemini");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Gemini: empty response");
  return text;
}
