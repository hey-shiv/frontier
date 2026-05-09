/**
 * Groq provider — uses Groq's OpenAI-compatible chat completions API.
 * Models: llama-3.3-70b-versatile and llama3-8b-8192 as fallback.
 * Groq free tier: generous RPM, excellent speed.
 */

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
];

export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  maxTokens = 1200
): Promise<string> {
  for (const model of GROQ_MODELS) {
    try {
      console.log(`[Groq] Trying: ${model}`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (res.status === 429) {
        console.warn(`[Groq] ${model}: rate limited, trying next`);
        continue;
      }
      if (!res.ok) {
        const text = await res.text();
        console.warn(`[Groq] ${model} HTTP ${res.status}: ${text.slice(0, 120)}, trying next`);
        continue;
      }

      const data = await res.json() as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content ?? "";
      if (content.length > 50) {
        console.log(`[Groq] Success: ${model}`);
        return content;
      }
      console.warn(`[Groq] ${model}: response too short, trying next`);
    } catch (e: any) {
      console.warn(`[Groq] ${model} failed: ${e.message?.slice(0, 100)}`);
    }
  }
  throw new Error("All Groq models exhausted");
}
