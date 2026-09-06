import { describe, expect, it } from "vitest";
import { analyzeJournalCsv, parseCsv } from "./JournalAudit.jsx";

describe("journal CSV parser", () => {
  it("handles quoted commas and newlines", () => {
    expect(parseCsv('日付,摘要\n2026-01-01,"広告, SNS"')).toEqual([
      ["日付", "摘要"],
      ["2026-01-01", "広告, SNS"],
    ]);
  });

  it("creates totals, account summaries and findings", () => {
    const report = analyzeJournalCsv(
      [
        "取引日,借方勘定科目,借方金額,貸方勘定科目,貸方金額,摘要,税区分",
        "2026-01-05,消耗品費,1100,現金,1100,文具,課税10%",
        "2026-01-05,消耗品費,1100,現金,1100,文具,課税10%",
        "2026-01-06,雑費,150000,現金,149000,,",
      ].join("\n"),
    );
    expect(report.entries).toHaveLength(3);
    expect(report.totals).toEqual({ debit: 152200, credit: 151200 });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "duplicate",
        "unbalanced",
        "missing_description",
        "missing_tax",
        "review_account",
      ]),
    );
    expect(report.risk).toBe("high");
  });

  it("rejects files without required bookkeeping columns", () => {
    expect(() => analyzeJournalCsv("日付,摘要\n2026-01-01,文具")).toThrow(
      /MISSING/,
    );
  });

  it("finds a supported header after accounting-software metadata rows", () => {
    const report = analyzeJournalCsv(
      [
        "仕訳帳エクスポート",
        "会計期間,2026年度",
        "発生日,借方科目,借方金額(円),貸方科目,貸方金額(円),メモ,消費税区分",
        "2026/04/01,普通預金,50000,売上高,50000,入金,課税10%",
      ].join("\n"),
    );
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].row).toBe(4);
    expect(report.risk).toBe("clear");
  });
});
