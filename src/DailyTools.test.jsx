import { describe, expect, it } from "vitest";
import { isValidCorporateNumber } from "./DailyTools.jsx";

describe("Japanese corporate number validation", () => {
  it("accepts the official NTA check-digit example", () => {
    expect(isValidCorporateNumber("8700110005901")).toBe(true);
    expect(isValidCorporateNumber("T8700110005901")).toBe(true);
  });

  it("rejects incorrect length and check digits", () => {
    expect(isValidCorporateNumber("700110005901")).toBe(false);
    expect(isValidCorporateNumber("9700110005901")).toBe(false);
  });
});
