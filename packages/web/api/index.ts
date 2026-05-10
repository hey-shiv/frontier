import app from "../src/api/index.js";

export default async function handler(req: Request | any, res?: any) {
  if (!res) {
    return app.fetch(req);
  }

  const request = await toWebRequest(req);
  const response = await app.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function toWebRequest(req: any): Promise<Request> {
  const url = new URL(req.url ?? "/", `https://${req.headers?.host ?? "localhost"}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers ?? {})) {
    if (Array.isArray(value)) headers.set(key, value.join(", "));
    else if (value != null) headers.set(key, String(value));
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? await readNodeBody(req) : undefined,
  });
}

async function readNodeBody(req: AsyncIterable<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
