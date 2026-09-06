import React, { useMemo, useState } from "react";
import {
  Braces,
  CheckCircle2,
  Clipboard,
  Clock3,
  Code2,
  ExternalLink,
  Fingerprint,
  Landmark,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import ToolPulse from "./ToolPulse";
import JournalAudit from "./JournalAudit";

const cleanNumber = (value) => value.toUpperCase().replace(/[^0-9T]/g, "");

const localText = (lang, ja, zh, en) =>
  lang === "ja" ? ja : lang === "zh" ? zh : en;

export function buildBusinessLookupUrl(value, kind = "corporate") {
  const digits = cleanNumber(value).replace(/^T/, "");
  if (!/^\d{13}$/.test(digits)) return "";
  return kind === "invoice"
    ? `https://www.invoice-kohyo.nta.go.jp/regno-search/detail?selRegNo=${digits}`
    : `https://info.gbiz.go.jp/hojin/ichiran?hojinBango=${digits}`;
}

export function isValidCorporateNumber(value) {
  const digits = cleanNumber(value).replace(/^T/, "");
  if (!/^\d{13}$/.test(digits)) return false;
  const base = digits.slice(1);
  let sum = 0;
  for (let i = 0; i < 12; i += 1)
    sum += Number(base[i]) * ((12 - i) % 2 === 0 ? 2 : 1);
  return Number(digits[0]) === 9 - (sum % 9);
}

const CopyButton = ({ value, lang }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      className="iconAction"
      disabled={!value}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
    >
      <Clipboard />
      {done
        ? lang === "ja"
          ? "コピー済み"
          : "Copied"
        : lang === "ja"
          ? "コピー"
          : "Copy"}
    </button>
  );
};

function JsonTool({ lang }) {
  const [input, setInput] = useState('{"name":"SunData","private":true}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const run = (minify) => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, minify ? 0 : 2));
      setError("");
    } catch (e) {
      setOutput("");
      setError(e.message);
    }
  };
  return (
    <article className="dailyCard dailyCardWide">
      <div className="dailyCardHead">
        <span className="dailyIcon mint">
          <Braces />
        </span>
        <div>
          <b>JSON</b>
          <h3>{lang === "ja" ? "整形・検証" : "Format & validate"}</h3>
        </div>
      </div>
      <div className="codeGrid">
        <label>
          <span>{lang === "ja" ? "入力" : "Input"}</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck="false"
          />
        </label>
        <label>
          <span>{lang === "ja" ? "結果" : "Result"}</span>
          <textarea value={output} readOnly spellCheck="false" />
        </label>
      </div>
      {error && (
        <p className="inlineError" role="alert">
          {error}
        </p>
      )}
      <div className="toolActions">
        <button onClick={() => run(false)}>
          {lang === "ja" ? "整形" : "Format"}
        </button>
        <button className="ghostAction" onClick={() => run(true)}>
          {lang === "ja" ? "圧縮" : "Minify"}
        </button>
        <CopyButton value={output} lang={lang} />
      </div>
      <ToolPulse toolId="json" tool="JSON" lang={lang} />
    </article>
  );
}

function EncoderTool({ lang }) {
  const [mode, setMode] = useState("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const run = (decode) => {
    try {
      const result =
        mode === "base64"
          ? decode
            ? new TextDecoder().decode(
                Uint8Array.from(atob(input.trim()), (c) => c.charCodeAt(0)),
              )
            : btoa(String.fromCharCode(...new TextEncoder().encode(input)))
          : decode
            ? decodeURIComponent(input)
            : encodeURIComponent(input);
      setOutput(result);
      setError("");
    } catch {
      setOutput("");
      setError(
        lang === "ja"
          ? "入力内容を確認してください。"
          : "Check the input and try again.",
      );
    }
  };
  return (
    <article className="dailyCard">
      <div className="dailyCardHead">
        <span className="dailyIcon blue">
          <Code2 />
        </span>
        <div>
          <b>ENCODER</b>
          <h3>Base64 / URL</h3>
        </div>
      </div>
      <div className="segmented">
        <button
          className={mode === "base64" ? "active" : ""}
          onClick={() => {
            setMode("base64");
            setOutput("");
          }}
        >
          Base64
        </button>
        <button
          className={mode === "url" ? "active" : ""}
          onClick={() => {
            setMode("url");
            setOutput("");
          }}
        >
          URL
        </button>
      </div>
      <label className="stackField">
        <span>{lang === "ja" ? "テキスト" : "Text"}</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <label className="stackField">
        <span>{lang === "ja" ? "結果" : "Result"}</span>
        <textarea value={output} readOnly />
      </label>
      {error && <p className="inlineError">{error}</p>}
      <div className="toolActions">
        <button onClick={() => run(false)}>
          {lang === "ja" ? "エンコード" : "Encode"}
        </button>
        <button className="ghostAction" onClick={() => run(true)}>
          {lang === "ja" ? "デコード" : "Decode"}
        </button>
        <CopyButton value={output} lang={lang} />
      </div>
      <ToolPulse toolId="base64-url" tool="Base64 / URL" lang={lang} />
    </article>
  );
}

function IdTimeTool({ lang }) {
  const [uuid, setUuid] = useState(() => crypto.randomUUID());
  const [timestamp, setTimestamp] = useState(() =>
    Math.floor(Date.now() / 1000),
  );
  const date = useMemo(() => {
    const n = Number(timestamp);
    const d = new Date(String(timestamp).length > 10 ? n : n * 1000);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [timestamp]);
  return (
    <article className="dailyCard">
      <div className="dailyCardHead">
        <span className="dailyIcon coral">
          <Fingerprint />
        </span>
        <div>
          <b>GENERATORS</b>
          <h3>{lang === "ja" ? "UUID・時刻変換" : "UUID & timestamp"}</h3>
        </div>
      </div>
      <div className="miniTool">
        <span>UUID v4</span>
        <code>{uuid}</code>
        <div className="toolActions">
          <button onClick={() => setUuid(crypto.randomUUID())}>
            <RefreshCw />
            {lang === "ja" ? "再生成" : "New"}
          </button>
          <CopyButton value={uuid} lang={lang} />
        </div>
      </div>
      <div className="miniTool">
        <span>Unix timestamp</span>
        <div className="timestampRow">
          <input
            inputMode="numeric"
            value={timestamp}
            onChange={(e) =>
              setTimestamp(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <button onClick={() => setTimestamp(Math.floor(Date.now() / 1000))}>
            <Clock3 />
            NOW
          </button>
        </div>
        <output>
          {date
            ? `${date.toLocaleString(lang === "ja" ? "ja-JP" : "en-US")} · ${date.toISOString()}`
            : lang === "ja"
              ? "有効な値を入力"
              : "Enter a valid value"}
        </output>
      </div>
      <ToolPulse
        toolId="uuid-timestamp"
        tool={lang === "ja" ? "UUID・時刻変換" : "UUID & timestamp"}
        lang={lang}
      />
    </article>
  );
}

function NumberCheck({ lang }) {
  const [mode, setMode] = useState("name");
  const [companyName, setCompanyName] = useState("");
  const [value, setValue] = useState("");
  const normalized = cleanNumber(value);
  const digits = normalized.replace(/^T/, "");
  const invoice = normalized.startsWith("T");
  const lengthValid = /^\d{13}$/.test(digits);
  const checksum = lengthValid && isValidCorporateNumber(digits);
  const status = !value
    ? "idle"
    : !lengthValid
      ? "bad"
      : checksum
        ? "good"
        : invoice
          ? "neutral"
          : "bad";
  const messages = {
    idle: localText(
      lang,
      "番号を入力すると形式を確認します。",
      "输入编号后即可检查格式。",
      "Enter a number to check its format.",
    ),
    bad: localText(
      lang,
      "桁数またはチェックデジットが一致しません。",
      "位数或校验位不正确。",
      "Length or check digit does not match.",
    ),
    good: localText(
      lang,
      "13桁とチェックデジットは有効です。",
      "13 位数字及校验位有效。",
      "The 13 digits and check digit are valid.",
    ),
    neutral: localText(
      lang,
      "登録番号の形式は有効です。個人事業者番号は法人番号の計算対象外です。",
      "登记编号格式有效；个体经营者编号不适用法人编号校验规则。",
      "The registration-number format is valid. Sole-proprietor numbers do not use the corporate checksum.",
    ),
  };
  const corporateUrl = buildBusinessLookupUrl(value, "corporate");
  const invoiceUrl = buildBusinessLookupUrl(value, "invoice");
  return (
    <article className="dailyCard dailyCardWide businessCard" id="number-check">
      <div className="dailyCardHead">
        <span className="dailyIcon gold">
          <Landmark />
        </span>
        <div>
          <b>JAPAN BUSINESS</b>
          <h3>
            {localText(
              lang,
              "法人・インボイス検索",
              "日本企业与发票登记查询",
              "Company & invoice lookup",
            )}
          </h3>
        </div>
      </div>
      <div
        className="businessLookupTabs"
        role="tablist"
        aria-label={localText(lang, "検索方法", "查询方式", "Search method")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "name"}
          className={mode === "name" ? "active" : ""}
          onClick={() => setMode("name")}
        >
          {localText(lang, "会社名から探す", "按公司名查找", "Search by name")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "number"}
          className={mode === "number" ? "active" : ""}
          onClick={() => setMode("number")}
        >
          {localText(lang, "番号から探す", "按编号查找", "Search by number")}
        </button>
      </div>
      {mode === "name" ? (
        <form
          className="businessLookupForm"
          method="post"
          action="https://info.gbiz.go.jp/hojin/FreewordSearch"
          target="_blank"
        >
          <input type="hidden" name="activeSearchTab" value="freeword" />
          <input type="hidden" name="gamenSeniFlg" value="false" />
          <input type="hidden" name="gamen" value="1" />
          <label className="stackField">
            <span>
              {localText(
                lang,
                "会社名・法人名（曖昧検索）",
                "公司名 / 法人名称（模糊查询）",
                "Company or organization name",
              )}
            </span>
            <input
              name="searchWord"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder={localText(
                lang,
                "例：サンダータ",
                "例如：SunData",
                "e.g. SunData",
              )}
              maxLength="100"
            />
          </label>
          <button
            type="submit"
            className="businessSearchButton"
            disabled={!companyName.trim()}
          >
            {localText(
              lang,
              "gBizINFOで候補を検索",
              "在 gBizINFO 中搜索候选企业",
              "Find matches on gBizINFO",
            )}
            <ExternalLink />
          </button>
          <p className="toolNote">
            {localText(
              lang,
              "法人名・法人番号・所在地などの候補を経済産業省の公式サイトで確認できます。",
              "可在日本经济产业省官方 gBizINFO 中核对企业名称、法人编号和地址等候选结果。",
              "Review matching names, corporate numbers and addresses on the official METI service.",
            )}
          </p>
        </form>
      ) : (
        <div className="businessLookupForm">
          <label className="stackField">
            <span>
              {localText(
                lang,
                "法人番号（13桁）または登録番号（T＋13桁）",
                "法人编号（13 位）或发票登记编号（T＋13 位）",
                "13-digit corporate number or T + 13 digits",
              )}
            </span>
            <input
              value={value}
              onChange={(event) =>
                setValue(cleanNumber(event.target.value).slice(0, 14))
              }
              placeholder="T1234567890123"
              inputMode="text"
            />
          </label>
          <div className={`numberStatus ${status}`}>
            {status === "good" && <CheckCircle2 />}
            {status === "neutral" && <ShieldAlert />}
            {messages[status]}
          </div>
          <div className="businessResultActions">
            {checksum && (
              <a href={corporateUrl} target="_blank" rel="noreferrer">
                {localText(
                  lang,
                  "法人情報を表示",
                  "查看企业资料",
                  "Open company profile",
                )}
                <ExternalLink />
              </a>
            )}
            {lengthValid && (
              <a href={invoiceUrl} target="_blank" rel="noreferrer">
                {localText(
                  lang,
                  "インボイス登録を確認",
                  "确认发票登记状态",
                  "Check invoice registration",
                )}
                <ExternalLink />
              </a>
            )}
          </div>
          <p className="toolNote">
            {localText(
              lang,
              "形式判定は補助機能です。実在・所在地・登録状態はリンク先の公式情報で最終確認してください。",
              "格式判断仅供辅助；企业是否存在、地址及登记状态请以官方查询结果为准。",
              "Format checks are only a guide. Confirm existence, address and registration status in the official result.",
            )}
          </p>
        </div>
      )}
      <div className="officialLinks">
        <a
          href="https://www.houjin-bangou.nta.go.jp/"
          target="_blank"
          rel="noreferrer"
        >
          {localText(
            lang,
            "国税庁 法人番号公表サイト",
            "日本国税厅法人编号公示网站",
            "NTA corporate registry",
          )}
          <ExternalLink />
        </a>
        <a
          href="https://www.invoice-kohyo.nta.go.jp/"
          target="_blank"
          rel="noreferrer"
        >
          {localText(
            lang,
            "国税庁 インボイス公表サイト",
            "日本国税厅发票登记公示网站",
            "NTA invoice registry",
          )}
          <ExternalLink />
        </a>
      </div>
      <ToolPulse
        toolId="business-number"
        tool={
          lang === "ja"
            ? "法人・インボイス検索"
            : lang === "zh"
              ? "日本企业与发票登记查询"
              : "Company & invoice lookup"
        }
        lang={lang}
      />
    </article>
  );
}

export default function DailyTools({ lang }) {
  return (
    <section className="dailyTools" id="daily-tools">
      <div className="sectionHead dailyHead">
        <span>DAILY WORKBENCH</span>
        <h2>
          {lang === "ja" ? "IT・仕事の便利ツール" : "IT & work utilities"}
        </h2>
        <p>
          {lang === "ja"
            ? "貼り付けて、確認して、すぐ使う。入力内容はブラウザ内だけで処理します。"
            : "Paste, check and use. Your input stays in this browser."}
        </p>
      </div>
      <div className="categoryLabel">
        <Code2 />
        {lang === "ja" ? "開発・データ" : "Developer & data"}
      </div>
      <div className="dailyGrid">
        <JsonTool lang={lang} />
        <EncoderTool lang={lang} />
        <IdTimeTool lang={lang} />
      </div>
      <div className="categoryLabel businessLabel">
        <Landmark />
        {lang === "ja" ? "日本の事業者向け" : "For businesses in Japan"}
      </div>
      <div className="dailyGrid businessGrid">
        <NumberCheck lang={lang} />
        <JournalAudit lang={lang} />
      </div>
    </section>
  );
}
