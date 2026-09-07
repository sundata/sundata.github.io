import React, { useRef, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Presentation,
  Upload,
} from "lucide-react";
import { parsePageSelection } from "./toolLogic";
import ToolPulse from "./ToolPulse";

const t = (lang, ja, zh, en) => (lang === "ja" ? ja : lang === "zh" ? zh : en);
const formatSize = (bytes) =>
  bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function groupPdfTextItems(items, tolerance = 4) {
  const lines = [];
  [...items]
    .filter((item) => item.str?.trim())
    .sort(
      (a, b) =>
        b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4],
    )
    .forEach((item) => {
      const y = item.transform[5];
      let line = lines.find(
        (candidate) => Math.abs(candidate.y - y) <= tolerance,
      );
      if (!line) {
        line = { y, items: [] };
        lines.push(line);
      }
      line.items.push({
        text: item.str.trim(),
        x: item.transform[4],
        width: item.width || 0,
      });
    });
  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => {
      const sorted = line.items.sort((a, b) => a.x - b.x);
      return sorted
        .map((item, index) => {
          if (!index) return item.text;
          const previous = sorted[index - 1];
          const gap = item.x - (previous.x + previous.width);
          return `${gap > 18 ? "\t" : " "}${item.text}`;
        })
        .join("");
    });
}

const downloadBlob = (blob, filename) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1200);
};

async function openPdf(file) {
  const moduleUrl = new URL("./vendor/pdf.mjs", window.location.href).href;
  const { getDocument, GlobalWorkerOptions } = await import(
    /* @vite-ignore */ moduleUrl
  );
  GlobalWorkerOptions.workerSrc = new URL(
    "./vendor/pdf.worker.mjs",
    window.location.href,
  ).href;
  return getDocument({ data: await file.arrayBuffer() }).promise;
}

async function extractPages(pdf, pages) {
  const output = [];
  for (const pageNumber of pages) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    output.push({ pageNumber, lines: groupPdfTextItems(content.items) });
  }
  return output;
}

export default function OfficeConverter({ lang, onSuccess }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [format, setFormat] = useState("docx");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const chooseFile = async (selected) => {
    setError("");
    setFile(null);
    if (
      !selected ||
      selected.type !== "application/pdf" ||
      selected.size > 50 * 1048576
    ) {
      setError(
        t(
          lang,
          "50MB以下のPDFを選択してください。",
          "请选择不超过 50MB 的 PDF。",
          "Choose a PDF up to 50MB.",
        ),
      );
      return;
    }
    try {
      const pdf = await openPdf(selected);
      if (pdf.numPages > 100) throw new Error("pages");
      setFile(selected);
      setPageCount(pdf.numPages);
      setPages(`1-${pdf.numPages}`);
    } catch {
      setError(
        t(
          lang,
          "PDFを読み取れませんでした。暗号化されていないファイルをお試しください。",
          "无法读取 PDF，请使用未加密文件。",
          "The PDF could not be read. Try an unencrypted file.",
        ),
      );
    }
  };

  const convert = async () => {
    if (!file || busy) return;
    const selection = parsePageSelection(pages, pageCount);
    if (!selection.length) {
      setError(
        t(
          lang,
          "有効なページ範囲を入力してください。",
          "请输入有效的页码范围。",
          "Enter a valid page range.",
        ),
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const pdf = await openPdf(file);
      const base = file.name.replace(/\.pdf$/i, "");
      if (format === "docx") {
        setProgress(
          t(lang, "テキストを抽出中…", "正在提取文字…", "Extracting text…"),
        );
        const [{ Document, Packer, Paragraph, TextRun, PageBreak }, extracted] =
          await Promise.all([import("docx"), extractPages(pdf, selection)]);
        const children = [];
        extracted.forEach((page, index) => {
          if (index)
            children.push(new Paragraph({ children: [new PageBreak()] }));
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${t(lang, "ページ", "第", "Page")} ${page.pageNumber}`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 220 },
            }),
          );
          page.lines.forEach((line) =>
            children.push(
              new Paragraph({ text: line || " ", spacing: { after: 100 } }),
            ),
          );
        });
        const blob = await Packer.toBlob(
          new Document({ sections: [{ children }] }),
        );
        downloadBlob(blob, `${base}.docx`);
      } else if (format === "xlsx") {
        setProgress(
          t(lang, "表の行を解析中…", "正在分析表格行…", "Analyzing rows…"),
        );
        const [{ utils, writeFile }, extracted] = await Promise.all([
          import("xlsx"),
          extractPages(pdf, selection),
        ]);
        const workbook = utils.book_new();
        extracted.forEach((page) => {
          const rows = page.lines.map((line) =>
            line.split("\t").map((cell) => cell.trim()),
          );
          const sheet = utils.aoa_to_sheet(rows.length ? rows : [[""]]);
          const widths = rows.reduce(
            (result, row) =>
              row.map((cell, index) => ({
                wch: Math.min(
                  60,
                  Math.max(result[index]?.wch || 8, String(cell).length + 2),
                ),
              })),
            [],
          );
          sheet["!cols"] = widths;
          utils.book_append_sheet(
            workbook,
            sheet,
            `${t(lang, "ページ", "页", "Page")} ${page.pageNumber}`.slice(
              0,
              31,
            ),
          );
        });
        writeFile(workbook, `${base}.xlsx`, { compression: true });
      } else {
        const { default: PptxGenJS } = await import("pptxgenjs");
        const pptx = new PptxGenJS();
        pptx.layout = "LAYOUT_WIDE";
        pptx.author = "SunData Tools";
        for (let index = 0; index < selection.length; index += 1) {
          const pageNumber = selection[index];
          setProgress(
            `${t(lang, "ページ", "页面", "Page")} ${index + 1} / ${selection.length}`,
          );
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.7 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          }).promise;
          const data = canvas.toDataURL("image/jpeg", 0.9);
          const slide = pptx.addSlide();
          slide.background = { color: "FFFFFF" };
          const ratio = Math.min(
            13.333 / viewport.width,
            7.5 / viewport.height,
          );
          const width = viewport.width * ratio;
          const height = viewport.height * ratio;
          slide.addImage({
            data,
            x: (13.333 - width) / 2,
            y: (7.5 - height) / 2,
            w: width,
            h: height,
          });
          canvas.width = 1;
          canvas.height = 1;
        }
        await pptx.writeFile({ fileName: `${base}.pptx` });
      }
      setProgress(
        t(lang, "変換が完了しました。", "转换完成。", "Conversion complete."),
      );
      onSuccess?.();
    } catch (cause) {
      console.error(cause);
      setError(
        t(
          lang,
          "変換できませんでした。PDFの内容またはページ範囲を確認してください。",
          "转换失败，请检查 PDF 内容或页码范围。",
          "Conversion failed. Check the PDF and page range.",
        ),
      );
      setProgress("");
    } finally {
      setBusy(false);
    }
  };

  const choices = [
    [
      "docx",
      FileText,
      "Word",
      t(
        lang,
        "文字・段落を抽出",
        "提取文字与段落",
        "Extract text & paragraphs",
      ),
    ],
    [
      "xlsx",
      FileSpreadsheet,
      "Excel",
      t(lang, "行と列を推定", "推测表格行列", "Detect rows & columns"),
    ],
    [
      "pptx",
      Presentation,
      "PowerPoint",
      t(
        lang,
        "各ページをスライド化",
        "每页生成一张幻灯片",
        "One slide per page",
      ),
    ],
  ];

  return (
    <article className="pdfToolCard officeConverter" id="pdf-office">
      <div className="utilityTitle">
        <FileText />
        <div>
          <b>
            {t(lang, "PDFをOfficeに変換", "PDF 转 Office", "PDF to Office")}
          </b>
          <span>
            {t(
              lang,
              "Word・Excel・PowerPointから選択",
              "选择 Word、Excel 或 PowerPoint",
              "Choose Word, Excel or PowerPoint",
            )}
          </span>
        </div>
      </div>
      <div
        className="officeChoices"
        role="radiogroup"
        aria-label={t(lang, "出力形式", "输出格式", "Output format")}
      >
        {choices.map(([value, Icon, name, note]) => (
          <button
            type="button"
            role="radio"
            aria-checked={format === value}
            className={format === value ? "active" : ""}
            key={value}
            onClick={() => setFormat(value)}
          >
            <Icon />
            <span>
              <strong>{name}</strong>
              <small>{note}</small>
            </span>
          </button>
        ))}
      </div>
      <button
        className="utilityDrop"
        type="button"
        onClick={() => {
          inputRef.current.value = "";
          inputRef.current.click();
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          chooseFile(event.dataTransfer.files[0]);
        }}
      >
        <Upload />
        <span>
          {file
            ? `${file.name} · ${pageCount} ${t(lang, "ページ", "页", "pages")} · ${formatSize(file.size)}`
            : t(
                lang,
                "PDFを選択・ドロップ",
                "选择或拖入 PDF",
                "Choose or drop a PDF",
              )}
        </span>
      </button>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="application/pdf"
        onChange={(event) => chooseFile(event.target.files[0])}
      />
      <label className="pdfLevel">
        {t(lang, "変換するページ", "转换页码", "Pages to convert")}
        <input
          type="text"
          value={pages}
          disabled={!file}
          placeholder="1, 3-5"
          onChange={(event) => setPages(event.target.value)}
        />
      </label>
      <p className="officeNote">
        {format === "docx"
          ? t(
              lang,
              "文字PDF向け。複雑なレイアウトや画像は完全には再現されません。",
              "适合文字型 PDF，复杂排版和图片可能无法完整还原。",
              "Best for text PDFs; complex layout and images may not be fully reproduced.",
            )
          : format === "xlsx"
            ? t(
                lang,
                "罫線のない表や複雑な結合セルは変換後に調整が必要です。",
                "无边框表格或复杂合并单元格可能需要转换后调整。",
                "Borderless tables and merged cells may need adjustment after conversion.",
              )
            : t(
                lang,
                "見た目を優先し、各PDFページを高画質画像として配置します。",
                "优先保持外观，每个 PDF 页面会作为高质量图片放入幻灯片。",
                "Preserves appearance by placing each PDF page as a high-quality slide image.",
              )}
      </p>
      {progress && (
        <div className="toolResult" aria-live="polite">
          {progress}
        </div>
      )}
      {error && (
        <p className="toolError" role="alert">
          {error}
        </p>
      )}
      <button
        className="utilityAction"
        type="button"
        disabled={!file || busy}
        onClick={convert}
      >
        <Download />
        {busy
          ? t(lang, "変換中…", "转换中…", "Converting…")
          : t(
              lang,
              `${format.toUpperCase()}で保存`,
              `保存为 ${format.toUpperCase()}`,
              `Save as ${format.toUpperCase()}`,
            )}
      </button>
      <ToolPulse
        toolId="pdf-office"
        tool={t(lang, "PDFをOfficeに変換", "PDF 转 Office", "PDF to Office")}
        lang={lang}
      />
    </article>
  );
}
