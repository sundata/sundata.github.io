import { describe, expect, it } from "vitest";
import { groupPdfTextItems } from "./OfficeConverter.jsx";

describe("PDF text layout grouping", () => {
  it("groups text by line and separates distant columns", () => {
    const lines = groupPdfTextItems([
      { str: "Amount", transform: [1, 0, 0, 1, 220, 700], width: 45 },
      { str: "Item", transform: [1, 0, 0, 1, 20, 700], width: 30 },
      { str: "Coffee", transform: [1, 0, 0, 1, 20, 680], width: 45 },
      { str: "500", transform: [1, 0, 0, 1, 220, 680], width: 20 },
    ]);
    expect(lines).toEqual(["Item\tAmount", "Coffee\t500"]);
  });

  it("keeps nearby words in one sentence", () => {
    const lines = groupPdfTextItems([
      { str: "SunData", transform: [1, 0, 0, 1, 20, 700], width: 50 },
      { str: "Tools", transform: [1, 0, 0, 1, 75, 702], width: 30 },
    ]);
    expect(lines).toEqual(["SunData Tools"]);
  });
});
