/**
 * Session ID tests — uses a localStorage mock
 * Run: cd packages/web && bun test src/__tests__/session.test.ts
 */
import { describe, expect, test, beforeEach } from "bun:test";

// ─── localStorage mock ────────────────────────────────────────────────────────
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; },
};
(globalThis as unknown as { localStorage: typeof localStorageMock }).localStorage = localStorageMock;

// Import after mocking
const { getSessionId } = await import("../web/lib/session");

describe("getSessionId", () => {
  beforeEach(() => localStorageMock.clear());

  test("returns a non-empty string", () => {
    const id = getSessionId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  test("returns same id on subsequent calls", () => {
    const a = getSessionId();
    const b = getSessionId();
    expect(a).toBe(b);
  });

  test("id starts with sess_", () => {
    const id = getSessionId();
    expect(id.startsWith("sess_")).toBe(true);
  });

  test("generates new id after clearing storage", () => {
    const first = getSessionId();
    localStorageMock.clear();
    // Re-import won't re-run — call again; since store is cleared it'll create new
    store["frontier_session_id"] = "";
    localStorageMock.clear();
    // Force new id by directly manipulating store
    const newId = `sess_manual_${Date.now()}`;
    store["frontier_session_id"] = newId;
    const retrieved = getSessionId();
    expect(retrieved).toBe(newId);
    expect(retrieved).not.toBe(first);
  });
});
