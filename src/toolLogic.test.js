import { describe, expect, it } from "vitest";
import {
  millimetresToPixels,
  parsePageOrder,
  parsePageSelection,
  safeImageDimension,
} from "./toolLogic";
describe("measurement conversion", () => {
  it("converts 35 × 45 mm at 300 DPI", () =>
    expect(millimetresToPixels(35, 45, 300)).toEqual({
      width: 413,
      height: 531,
    }));
  it("rejects invalid measurements", () =>
    expect(millimetresToPixels(-1, 45, 300)).toEqual({ width: 0, height: 0 }));
});
describe("PDF page expressions", () => {
  it("expands and deduplicates extraction ranges", () =>
    expect(parsePageSelection("5, 1, 3-5", 8)).toEqual([1, 3, 4, 5]));
  it("rejects invalid extraction", () => {
    expect(parsePageSelection("", 5)).toEqual([]);
    expect(parsePageSelection("4-2", 5)).toEqual([]);
    expect(parsePageSelection("6", 5)).toEqual([]);
  });
  it("preserves order and reverse ranges", () =>
    expect(parsePageOrder("3, 1, 5-4", 5)).toEqual([3, 1, 5, 4]));
  it("rejects duplicate pages", () =>
    expect(parsePageOrder("1, 1", 5)).toEqual([]));
});
describe("image bounds", () => {
  it("clamps unsafe dimensions", () => {
    expect(safeImageDimension(-5)).toBe(1);
    expect(safeImageDimension(99999)).toBe(12000);
    expect(safeImageDimension("nope")).toBe(1);
  });
});
