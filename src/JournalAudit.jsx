import React, { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Trash2,
  Upload,
} from "lucide-react";
import ToolPulse from "./ToolPulse";

const t = (lang, ja, zh, en) => (lang === "ja" ? ja : lang === "zh" ? zh : en);
const aliases = {
  date: ["取引日", "日付", "伝票日付", "発生日", "date", "transactiondate"],
  debitAccount: [
    "借方勘定科目",
    "借方科目",
    "借方勘定",
    "debitaccount",
    "debit",
  ],
  debitAmount: ["借方金額", "借方金額円", "debitamount", "debitvalue"],
  creditAccount: [
    "貸方勘定科目",
    "貸方科目",
    "貸方勘定",
    "creditaccount",
    "credit",
  ],
  creditAmount: ["貸方金額", "貸方金額円", "creditamount", "creditvalue"],
  description: ["摘要", "取引内容", "備考", "メモ", "description", "memo"],
  tax: ["税区分", "消費税区分", "税率", "taxcategory", "taxtype", "taxrate"],
};

const cleanHeader = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[\s_()（）・￥¥]/g, "");
const numberValue = (value) => {
  const parsed = Number(String(value || "").replace(/[￥¥,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const source = String(text || "").replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"' && quoted && source[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[i + 1] === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function findColumn(headers, names) {
  const normalized = headers.map(cleanHeader);
  return normalized.findIndex((header) =>
    names.some((name) => header === cleanHeader(name)),
  );
}

export function analyzeJournalCsv(text) {
  const csv = parseCsv(text);
  if (csv.length < 2) throw new Error("NO_ROWS");
  const required = [
    "date",
    "debitAccount",
    "debitAmount",
    "creditAccount",
    "creditAmount",
  ];
  const headerIndex = csv.slice(0, 12).findIndex((row) => {
    const located = Object.fromEntries(
      Object.entries(aliases).map(([key, names]) => [
        key,
        findColumn(row, names),
      ]),
    );
    return required.every((key) => located[key] >= 0);
  });
  if (headerIndex < 0) throw new Error(`MISSING:${required.join(",")}`);
  const columns = Object.fromEntries(
    Object.entries(aliases).map(([key, names]) => [
      key,
      findColumn(csv[headerIndex], names),
    ]),
  );
  const missing = required.filter((key) => columns[key] < 0);
  if (missing.length) throw new Error(`MISSING:${missing.join(",")}`);

  const entries = csv.slice(headerIndex + 1).map((cells, index) => ({
    row: index + headerIndex + 2,
    date: cells[columns.date] || "",
    debitAccount: cells[columns.debitAccount] || "",
    debitAmount: numberValue(cells[columns.debitAmount]),
    creditAccount: cells[columns.creditAccount] || "",
    creditAmount: numberValue(cells[columns.creditAmount]),
    description:
      columns.description >= 0 ? cells[columns.description] || "" : "",
    tax: columns.tax >= 0 ? cells[columns.tax] || "" : "",
  }));
  const issues = [];
  const seen = new Map();
  const add = (entry, severity, code, message) =>
    issues.push({ row: entry.row, severity, code, message });
  const reviewAccounts =
    /仮払金|仮受金|雑費|現金|役員貸付金|役員借入金|交際費|suspense|cash|director/i;
  entries.forEach((entry) => {
    if (!entry.date) add(entry, "high", "missing_date", "取引日がありません");
    if (!entry.debitAccount || !entry.creditAccount)
      add(entry, "high", "missing_account", "借方または貸方科目がありません");
    if (Math.abs(entry.debitAmount - entry.creditAmount) > 0.5)
      add(entry, "high", "unbalanced", "借方金額と貸方金額が一致しません");
    if (entry.debitAmount <= 0 || entry.creditAmount <= 0)
      add(entry, "high", "invalid_amount", "金額がゼロまたは不正です");
    if (!entry.description)
      add(entry, "medium", "missing_description", "摘要が空欄です");
    if (!entry.tax) add(entry, "medium", "missing_tax", "税区分が空欄です");
    if (
      reviewAccounts.test(`${entry.debitAccount} ${entry.creditAccount}`) &&
      Math.max(entry.debitAmount, entry.creditAmount) >= 100000
    )
      add(entry, "medium", "review_account", "要確認科目の高額取引です");
    const key = [
      entry.date,
      entry.debitAccount,
      entry.debitAmount,
      entry.creditAccount,
      entry.creditAmount,
      entry.description,
    ].join("|");
    if (seen.has(key))
      add(
        entry,
        "medium",
        "duplicate",
        `重複候補（${seen.get(key)}行目と同内容）`,
      );
    else seen.set(key, entry.row);
  });
  const totals = entries.reduce(
    (acc, entry) => ({
      debit: acc.debit + entry.debitAmount,
      credit: acc.credit + entry.creditAmount,
    }),
    { debit: 0, credit: 0 },
  );
  const accounts = new Map();
  entries.forEach((entry) => {
    if (entry.debitAccount)
      accounts.set(
        entry.debitAccount,
        (accounts.get(entry.debitAccount) || 0) + entry.debitAmount,
      );
    if (entry.creditAccount)
      accounts.set(
        entry.creditAccount,
        (accounts.get(entry.creditAccount) || 0) + entry.creditAmount,
      );
  });
  const accountSummary = [...accounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const dates = entries
    .map((entry) => entry.date)
    .filter(Boolean)
    .sort();
  return {
    entries,
    issues,
    totals,
    accountSummary,
    period: dates.length ? `${dates[0]} – ${dates[dates.length - 1]}` : "—",
    risk: issues.some((issue) => issue.severity === "high")
      ? "high"
      : issues.length
        ? "watch"
        : "clear",
  };
}

const yen = (value) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);

export default function JournalAudit({ lang }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const issueLabels = useMemo(
    () => ({
      missing_date: t(lang, "取引日なし", "缺少交易日期", "Missing date"),
      missing_account: t(
        lang,
        "勘定科目なし",
        "缺少会计科目",
        "Missing account",
      ),
      unbalanced: t(lang, "貸借不一致", "借贷不平衡", "Out of balance"),
      invalid_amount: t(lang, "金額不正", "金额异常", "Invalid amount"),
      missing_description: t(
        lang,
        "摘要なし",
        "缺少摘要",
        "Missing description",
      ),
      missing_tax: t(
        lang,
        "税区分なし",
        "缺少税务分类",
        "Missing tax category",
      ),
      review_account: t(
        lang,
        "高額・要確認科目",
        "大额 / 待确认科目",
        "High-value review account",
      ),
      duplicate: t(lang, "重複候補", "疑似重复", "Possible duplicate"),
    }),
    [lang],
  );

  const loadFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError(
        t(
          lang,
          "CSVファイルを選択してください。",
          "请选择 CSV 文件。",
          "Choose a CSV file.",
        ),
      );
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError(
        t(
          lang,
          "15MB以下のCSVを選択してください。",
          "请选择不超过 15MB 的 CSV。",
          "Choose a CSV up to 15MB.",
        ),
      );
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      let text = new TextDecoder("utf-8").decode(buffer);
      if (text.includes("�"))
        text = new TextDecoder("shift_jis").decode(buffer);
      setReport(analyzeJournalCsv(text));
      setFileName(file.name);
      setError("");
    } catch (problem) {
      setReport(null);
      setError(
        problem.message.startsWith("MISSING:")
          ? t(
              lang,
              "必要な列を認識できません。日付・借方科目・借方金額・貸方科目・貸方金額を含めてください。",
              "无法识别必要列，请包含日期、借方科目、借方金额、贷方科目和贷方金额。",
              "Required columns were not found. Include date, debit account/amount and credit account/amount.",
            )
          : t(
              lang,
              "仕訳データを読み取れませんでした。CSV形式を確認してください。",
              "无法读取分录数据，请确认 CSV 格式。",
              "The journal could not be read. Check the CSV format.",
            ),
      );
    }
  };

  const downloadReport = () => {
    const header = "row,severity,issue,message\n";
    const body = report.issues
      .map((issue) =>
        [issue.row, issue.severity, issueLabels[issue.code], issue.message]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", header, body], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "sundata-journal-review.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="dailyCard dailyCardWide journalAudit" id="tax-check">
      <div className="dailyCardHead">
        <span className="dailyIcon rose">
          <FileSpreadsheet />
        </span>
        <div>
          <b>JOURNAL REVIEW</b>
          <h3>
            {t(
              lang,
              "仕訳データ・税務チェック",
              "会计分录与税务检查",
              "Journal & tax review",
            )}
          </h3>
        </div>
      </div>
      {!report ? (
        <>
          <button
            className="journalDrop"
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              loadFile(event.dataTransfer.files[0]);
            }}
          >
            <Upload />
            <strong>
              {t(
                lang,
                "仕訳CSVを選択・ドロップ",
                "选择或拖入会计分录 CSV",
                "Choose or drop a journal CSV",
              )}
            </strong>
            <span>
              {t(
                lang,
                "UTF-8 / Shift-JIS・15MBまで・外部送信なし",
                "支持 UTF-8 / Shift-JIS，最大 15MB，不上传服务器",
                "UTF-8 / Shift-JIS · up to 15MB · never uploaded",
              )}
            </span>
          </button>
          <input
            ref={fileRef}
            className="visuallyHidden"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => loadFile(event.target.files[0])}
          />
          <div className="journalColumns">
            <strong>
              {t(lang, "対応列", "支持的列", "Supported columns")}
            </strong>
            <span>
              {t(
                lang,
                "取引日・借方勘定科目・借方金額・貸方勘定科目・貸方金額・摘要・税区分",
                "日期、借方科目、借方金额、贷方科目、贷方金额、摘要、税务分类",
                "Date, debit account/amount, credit account/amount, description and tax category",
              )}
            </span>
          </div>
          {error && (
            <p className="inlineError" role="alert">
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="journalReport">
          <div className="journalReportHead">
            <div>
              <span>{t(lang, "分析対象", "分析文件", "Analyzed file")}</span>
              <strong>{fileName}</strong>
              <small>{report.period}</small>
            </div>
            <div className="journalReportActions">
              <button type="button" onClick={downloadReport}>
                <Download />
                {t(lang, "指摘CSV", "导出问题 CSV", "Export issues")}
              </button>
              <button
                type="button"
                className="ghostAction"
                onClick={() => {
                  setReport(null);
                  setFileName("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <Trash2 />
                {t(lang, "別のファイル", "更换文件", "Replace")}
              </button>
            </div>
          </div>
          <div className="journalMetrics">
            <div>
              <span>{t(lang, "仕訳行", "分录行数", "Entries")}</span>
              <strong>{report.entries.length.toLocaleString()}</strong>
            </div>
            <div>
              <span>{t(lang, "借方合計", "借方合计", "Total debit")}</span>
              <strong>{yen(report.totals.debit)}</strong>
            </div>
            <div>
              <span>{t(lang, "貸方合計", "贷方合计", "Total credit")}</span>
              <strong>{yen(report.totals.credit)}</strong>
            </div>
            <div className={report.risk}>
              <span>{t(lang, "要確認", "待确认", "Findings")}</span>
              <strong>{report.issues.length}</strong>
            </div>
          </div>
          <div className={`journalVerdict ${report.risk}`}>
            {report.risk === "clear" ? <CheckCircle2 /> : <AlertTriangle />}
            <div>
              <strong>
                {report.risk === "clear"
                  ? t(
                      lang,
                      "主要な形式エラーは見つかりませんでした",
                      "未发现主要格式问题",
                      "No major structural issues found",
                    )
                  : t(
                      lang,
                      "確認が必要な仕訳があります",
                      "发现需要确认的分录",
                      "Some entries need review",
                    )}
              </strong>
              <span>
                {t(
                  lang,
                  "自動判定は税務判断や申告内容を保証するものではありません。",
                  "自动检查不构成税务意见，也不保证申报结果。",
                  "Automated checks are not tax advice and do not validate a tax return.",
                )}
              </span>
            </div>
          </div>
          <div className="journalReportGrid">
            <section>
              <h4>{t(lang, "指摘一覧", "问题列表", "Findings")}</h4>
              {report.issues.length ? (
                <div className="journalIssueList">
                  {report.issues.slice(0, 30).map((issue, index) => (
                    <div key={`${issue.row}-${issue.code}-${index}`}>
                      <span className={issue.severity}>
                        {issue.severity === "high"
                          ? t(lang, "重要", "重要", "High")
                          : t(lang, "確認", "确认", "Review")}
                      </span>
                      <strong>{issueLabels[issue.code]}</strong>
                      <small>
                        {t(
                          lang,
                          `${issue.row}行目`,
                          `第 ${issue.row} 行`,
                          `Row ${issue.row}`,
                        )}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="journalEmpty">
                  {t(
                    lang,
                    "指摘はありません。",
                    "没有发现问题。",
                    "No findings.",
                  )}
                </p>
              )}
            </section>
            <section>
              <h4>
                {t(lang, "科目別取引額 上位", "科目交易额排行", "Top accounts")}
              </h4>
              <div className="accountBars">
                {report.accountSummary.map(([name, amount]) => (
                  <div key={name}>
                    <span>{name}</span>
                    <div>
                      <i
                        style={{
                          width: `${Math.max(4, report.accountSummary[0][1] ? (amount / report.accountSummary[0][1]) * 100 : 4)}%`,
                        }}
                      />
                    </div>
                    <strong>{yen(amount)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
      <div className="journalGuidance">
        <a
          href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6621.htm"
          target="_blank"
          rel="noreferrer"
        >
          {t(
            lang,
            "国税庁：帳簿の記載事項と保存",
            "日本国税厅：账簿记录与保存",
            "NTA: bookkeeping requirements",
          )}
        </a>
        <a
          href="https://www.nta.go.jp/law/joho-zeikaishaku/sonota/jirei/02.htm"
          target="_blank"
          rel="noreferrer"
        >
          {t(
            lang,
            "電子帳簿保存法",
            "电子账簿保存制度",
            "Electronic record retention",
          )}
        </a>
      </div>
      <ToolPulse
        toolId="journal-tax-review"
        tool={t(
          lang,
          "仕訳データ・税務チェック",
          "会计分录与税务检查",
          "Journal & tax review",
        )}
        lang={lang}
      />
    </article>
  );
}
