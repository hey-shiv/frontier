/**
 * safeParseJsonArray helper tests
 * Run: cd packages/web && bun test src/__tests__/safe-parse.test.ts
 */
import { describe, expect, test } from "bun:test";

// Inline the helper (mirrors what api/index.ts exports)
function safeParseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

describe("safeParseJsonArray", () => {
  test("returns array as-is", () => {
    expect(safeParseJsonArray(["a", "b"])).toEqual(["a", "b"]);
  });

  test("parses valid JSON string", () => {
    expect(safeParseJsonArray('["OpenAI","DeepMind"]')).toEqual(["OpenAI", "DeepMind"]);
  });

  test("returns [] for empty array", () => {
    expect(safeParseJsonArray([])).toEqual([]);
  });

  test("returns [] for null JSON string", () => {
    expect(safeParseJsonArray("null")).toEqual([]);
  });

  test("returns [] for malformed JSON", () => {
    expect(safeParseJsonArray("{not valid}")).toEqual([]);
  });

  test("returns [] for undefined", () => {
    expect(safeParseJsonArray(undefined)).toEqual([]);
  });

  test("returns [] for null", () => {
    expect(safeParseJsonArray(null)).toEqual([]);
  });

  test("returns [] for number", () => {
    expect(safeParseJsonArray(42)).toEqual([]);
  });

  test("returns [] for object JSON string", () => {
    expect(safeParseJsonArray('{"key":"value"}')).toEqual([]);
  });
});
