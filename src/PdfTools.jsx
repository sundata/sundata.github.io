import React, { useRef, useState } from "react";
import {
  Download,
  FileArchive,
  FileImage,
  Files,
  Merge,
  Scissors,
  Upload,
  X,
} from "lucide-react";
import { parsePageOrder, parsePageSelection } from "./toolLogic";
import ToolPulse from "./ToolPulse";

const words = {
  ja: {
    eyebrow: "PDF TOOLS",
    title: "PDF・ファイルツール",
    sub: "ファイルはアップロードされません。処理はこの端末内で完結します。",
    compress: "PDFを圧縮",
    compressSub: "各ページを最適化して、共有しやすいPDFを作ります。",
    choosePdf: "PDFファイルを選択",
    quality: "圧縮レベル",
    balanced: "おすすめ",
    smaller: "小さく",
    smallest: "最小",
    run: "圧縮して保存",
    processing: "処理中…",
    original: "元のサイズ",
    result: "圧縮後",
    note: "圧縮後の文字は画像化されるため、検索やコピーができない場合があります。",
    images: "画像をPDFに変換",
    imagesSub: "複数の画像を選択順に並べ、1つのPDFにまとめます。",
    chooseImages: "画像を選択（複数可）",
    makePdf: "PDFを作成して保存",
    selected: "枚の画像を選択中",
    clear: "選択を解除",
    error: "処理できませんでした。別のファイルでお試しください。",
    invalidPdf: "100MB以下のPDFファイルを選択してください。",
    invalidImages: "画像を30枚まで選択してください。",
    alreadySmall:
      "このPDFはすでに最適化されています。より強い圧縮レベルをお試しください。",
    page: "ページ",
    drop: "またはここにドロップ",
    created: "作成後",
    merge: "PDFを結合",
    mergeSub: "複数のPDFを選択順に1つへまとめます。",
    choosePdfs: "PDFを選択（複数可）",
    mergeRun: "結合して保存",
    pdfSelected: "個のPDFを選択中",
    split: "PDFページを抽出",
    splitSub: "必要なページだけを新しいPDFとして保存します。",
    pages: "抽出するページ",
    pagesHint: "例：1, 3-5, 8",
    splitRun: "ページを抽出して保存",
    invalidPages: "存在するページ番号を入力してください。",
    pageCount: "ページ",
    organize: "PDFページを整理",
    organizeSub: "希望するページ順だけを指定して、並べ替えや削除を行います。",
    order: "新しいページ順",
    orderHint: "例：3, 1, 2, 5-8",
    organizeRun: "整理したPDFを保存",
  },
  en: {
    eyebrow: "PDF TOOLS",
    title: "PDF & file tools",
    sub: "Nothing is uploaded. Processing stays on this device.",
    compress: "Compress PDF",
    compressSub: "Optimize every page into a PDF that's easier to share.",
    choosePdf: "Choose a PDF file",
    quality: "Compression level",
    balanced: "Recommended",
    smaller: "Smaller",
    smallest: "Smallest",
    run: "Compress & download",
    processing: "Processing…",
    original: "Original",
    result: "Compressed",
    note: "Text is rasterized during compression and may no longer be searchable or selectable.",
    images: "Images to PDF",
    imagesSub: "Combine multiple images into one PDF in the order selected.",
    chooseImages: "Choose images (multiple)",
    makePdf: "Create & download PDF",
    selected: "images selected",
    clear: "Clear selection",
    error: "We couldn't process that file. Please try another one.",
    invalidPdf: "Choose a PDF file up to 100 MB.",
    invalidImages: "Choose up to 30 image files.",
    alreadySmall:
      "This PDF is already optimized. Try a stronger compression level.",
    page: "Page",
    drop: "or drop it here",
    created: "Created",
    merge: "Merge PDFs",
    mergeSub: "Combine multiple PDFs into one in the order selected.",
    choosePdfs: "Choose PDFs (multiple)",
    mergeRun: "Merge & download",
    pdfSelected: "PDFs selected",
    split: "Extract PDF pages",
    splitSub: "Save only the pages you need as a new PDF.",
    pages: "Pages to extract",
    pagesHint: "Example: 1, 3-5, 8",
    splitRun: "Extract & download",
    invalidPages: "Enter page numbers that exist in the PDF.",
    pageCount: "pages",
    organize: "Organize PDF pages",
    organizeSub:
      "Reorder pages or remove unwanted ones by entering the desired order.",
    order: "New page order",
    orderHint: "Example: 3, 1, 2, 5-8",
    organizeRun: "Save organized PDF",
  },
};

let jsPdfPromise;
const loadJsPdf = () => {
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (!jsPdfPromise) {
    jsPdfPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./vendor/jspdf.umd.min.js";
      script.onload = () => resolve(window.jspdf.jsPDF);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return jsPdfPromise;
};

let pdfLibPromise;
const loadPdfLib = () => {
  if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
  if (!pdfLibPromise) {
    pdfLibPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./vendor/pdf-lib.min.js";
      script.onload = () => resolve(window.PDFLib);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return pdfLibPromise;
};

const readableSize = (bytes) => {
  if (!bytes) return "—";
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const downloadBlob = (blob, filename) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1200);
};

const readImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    image.src = url;
  });

export default function PdfTools({ lang, onSuccess }) {
  const L = words[lang];
  const pdfInput = useRef();
  const imageInput = useRef();
  const mergeInput = useRef();
  const splitInput = useRef();
  const organizeInput = useRef();
  const [pdf, setPdf] = useState(null);
  const [images, setImages] = useState([]);
  const [level, setLevel] = useState("balanced");
  const [busy, setBusy] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [imageOutputSize, setImageOutputSize] = useState(0);
  const [progress, setProgress] = useState("");
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [splitPages, setSplitPages] = useState("1");
  const [splitPageCount, setSplitPageCount] = useState(0);
  const [mergeResult, setMergeResult] = useState("");
  const [splitResult, setSplitResult] = useState("");
  const [organizeFile, setOrganizeFile] = useState(null);
  const [organizeOrder, setOrganizeOrder] = useState("");
  const [organizePageCount, setOrganizePageCount] = useState(0);
  const [organizeResult, setOrganizeResult] = useState("");
  const [error, setError] = useState("");

  const choosePdfFile = (file) => {
    setOutputSize(0);
    setProgress("");
    if (!file || file.type !== "application/pdf" || file.size > 100 * 1048576) {
      setPdf(null);
      setError(L.invalidPdf);
      return;
    }
    setError("");
    setPdf(file);
  };

  const chooseImages = (files) => {
    const selected = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/"),
    );
    setImageOutputSize(0);
    if (!selected.length || selected.length > 30) {
      setImages([]);
      setError(L.invalidImages);
      return;
    }
    setError("");
    setImages(selected);
  };

  const chooseMergeFiles = (files) => {
    const selected = Array.from(files || []).filter(
      (file) => file.type === "application/pdf",
    );
    setMergeResult("");
    if (
      selected.length < 2 ||
      selected.length > 20 ||
      selected.some((file) => file.size > 100 * 1048576)
    ) {
      setMergeFiles([]);
      setError(
        lang === "ja"
          ? "100MB以下のPDFを2〜20個選択してください。"
          : "Choose 2–20 PDF files up to 100 MB each.",
      );
      return;
    }
    setError("");
    setMergeFiles(selected);
  };

  const chooseSplitFile = async (file) => {
    setSplitResult("");
    if (!file || file.type !== "application/pdf" || file.size > 100 * 1048576) {
      setSplitFile(null);
      setSplitPageCount(0);
      setError(L.invalidPdf);
      return;
    }
    try {
      const { PDFDocument } = await loadPdfLib();
      const source = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: false,
      });
      setSplitFile(file);
      setSplitPageCount(source.getPageCount());
      setSplitPages(`1-${source.getPageCount()}`);
      setError("");
    } catch {
      setSplitFile(null);
      setSplitPageCount(0);
      setError(L.error);
    }
  };

  const chooseOrganizeFile = async (file) => {
    setOrganizeResult("");
    if (!file || file.type !== "application/pdf" || file.size > 100 * 1048576) {
      setOrganizeFile(null);
      setOrganizePageCount(0);
      setError(L.invalidPdf);
      return;
    }
    try {
      const { PDFDocument } = await loadPdfLib();
      const source = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: false,
      });
      const count = source.getPageCount();
      setOrganizeFile(file);
      setOrganizePageCount(count);
      setOrganizeOrder(`1-${count}`);
      setError("");
    } catch {
      setOrganizeFile(null);
      setOrganizePageCount(0);
      setError(L.error);
    }
  };

  const compressPdf = async () => {
    if (!pdf || busy) return;
    setBusy("compress");
    setError("");
    setOutputSize(0);
    try {
      const pdfModuleUrl = new URL("./vendor/pdf.mjs", window.location.href)
        .href;
      const [{ getDocument, GlobalWorkerOptions }, JsPDF] = await Promise.all([
        import(/* @vite-ignore */ pdfModuleUrl),
        loadJsPdf(),
      ]);
      GlobalWorkerOptions.workerSrc = new URL(
        "./vendor/pdf.worker.mjs",
        window.location.href,
      ).href;
      const source = await pdf.arrayBuffer();
      const pdfDocument = await getDocument({ data: source }).promise;
      const settings = {
        balanced: { scale: 1.35, quality: 0.72 },
        smaller: { scale: 1.05, quality: 0.56 },
        smallest: { scale: 0.8, quality: 0.42 },
      }[level];
      let result;
      for (let index = 1; index <= pdfDocument.numPages; index += 1) {
        setProgress(`${L.page} ${index} / ${pdfDocument.numPages}`);
        const page = await pdfDocument.getPage(index);
        const viewport = page.getViewport({ scale: settings.scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport })
          .promise;
        const orientation =
          viewport.width > viewport.height ? "landscape" : "portrait";
        if (!result) {
          result = new JsPDF({
            orientation,
            unit: "pt",
            format: [viewport.width, viewport.height],
            compress: true,
          });
        } else {
          result.addPage([viewport.width, viewport.height], orientation);
        }
        result.addImage(
          canvas.toDataURL("image/jpeg", settings.quality),
          "JPEG",
          0,
          0,
          viewport.width,
          viewport.height,
          undefined,
          "FAST",
        );
        canvas.width = 1;
        canvas.height = 1;
      }
      const blob = result.output("blob");
      setOutputSize(blob.size);
      if (blob.size >= pdf.size) {
        setError(L.alreadySmall);
        return;
      }
      downloadBlob(blob, `${pdf.name.replace(/\.pdf$/i, "")}-compressed.pdf`);
      onSuccess?.();
    } catch (cause) {
      console.error(cause);
      setError(L.error);
    } finally {
      setBusy("");
      setProgress("");
    }
  };

  const imagesToPdf = async () => {
    if (!images.length || busy) return;
    setBusy("images");
    setError("");
    try {
      const JsPDF = await loadJsPdf();
      let result;
      for (const file of images) {
        const image = await readImage(file);
        const maxSide = 1800;
        const ratio = Math.min(
          1,
          maxSide / Math.max(image.naturalWidth, image.naturalHeight),
        );
        const width = Math.round(image.naturalWidth * ratio);
        const height = Math.round(image.naturalHeight * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        const orientation = width > height ? "landscape" : "portrait";
        if (!result)
          result = new JsPDF({
            orientation,
            unit: "px",
            format: [width, height],
            compress: true,
          });
        else result.addPage([width, height], orientation);
        result.addImage(
          canvas.toDataURL("image/jpeg", 0.86),
          "JPEG",
          0,
          0,
          width,
          height,
          undefined,
          "FAST",
        );
      }
      downloadBlob(result.output("blob"), "images.pdf");
      setImageOutputSize(result.output("arraybuffer").byteLength);
      onSuccess?.();
    } catch (cause) {
      console.error(cause);
      setError(L.error);
    } finally {
      setBusy("");
    }
  };

  const mergePdfs = async () => {
    if (mergeFiles.length < 2 || busy) return;
    setBusy("merge");
    setError("");
    setMergeResult("");
    try {
      const { PDFDocument } = await loadPdfLib();
      const output = await PDFDocument.create();
      let totalPages = 0;
      for (let index = 0; index < mergeFiles.length; index += 1) {
        setProgress(`${index + 1} / ${mergeFiles.length}`);
        const source = await PDFDocument.load(
          await mergeFiles[index].arrayBuffer(),
          { ignoreEncryption: false },
        );
        const copied = await output.copyPages(source, source.getPageIndices());
        copied.forEach((page) => output.addPage(page));
        totalPages += copied.length;
      }
      const bytes = await output.save({ useObjectStreams: true });
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        "merged.pdf",
      );
      setMergeResult(
        `${totalPages} ${L.pageCount} · ${readableSize(bytes.length)}`,
      );
      onSuccess?.();
    } catch (cause) {
      console.error(cause);
      setError(L.error);
    } finally {
      setBusy("");
      setProgress("");
    }
  };

  const extractPages = async () => {
    if (!splitFile || busy) return;
    setBusy("split");
    setError("");
    setSplitResult("");
    try {
      const { PDFDocument } = await loadPdfLib();
      const source = await PDFDocument.load(await splitFile.arrayBuffer(), {
        ignoreEncryption: false,
      });
      const selected = parsePageSelection(splitPages, source.getPageCount());
      if (!selected.length) {
        setError(L.invalidPages);
        return;
      }
      const output = await PDFDocument.create();
      const copied = await output.copyPages(
        source,
        selected.map((page) => page - 1),
      );
      copied.forEach((page) => output.addPage(page));
      const bytes = await output.save({ useObjectStreams: true });
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        `${splitFile.name.replace(/\.pdf$/i, "")}-pages.pdf`,
      );
      setSplitResult(
        `${copied.length} ${L.pageCount} · ${readableSize(bytes.length)}`,
      );
      onSuccess?.();
    } catch (cause) {
      console.error(cause);
      setError(L.error);
    } finally {
      setBusy("");
    }
  };

  const organizePages = async () => {
    if (!organizeFile || busy) return;
    setBusy("organize");
    setError("");
    setOrganizeResult("");
    try {
      const { PDFDocument } = await loadPdfLib();
      const source = await PDFDocument.load(await organizeFile.arrayBuffer(), {
        ignoreEncryption: false,
      });
      const order = parsePageOrder(organizeOrder, source.getPageCount());
      if (!order.length) {
        setError(L.invalidPages);
        return;
      }
      const output = await PDFDocument.create();
      const copied = await output.copyPages(
        source,
        order.map((page) => page - 1),
      );
      copied.forEach((page) => output.addPage(page));
      const bytes = await output.save({ useObjectStreams: true });
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        `${organizeFile.name.replace(/\.pdf$/i, "")}-organized.pdf`,
      );
      setOrganizeResult(
        `${copied.length} ${L.pageCount} · ${readableSize(bytes.length)}`,
      );
      onSuccess?.();
    } catch (cause) {
      console.error(cause);
      setError(L.error);
    } finally {
      setBusy("");
    }
  };

  return (
    <section className="pdfTools" id="pdf-tools">
      <div className="sectionHead">
        <span>{L.eyebrow}</span>
        <h2>{L.title}</h2>
        <p>{L.sub}</p>
      </div>
      <div className="pdfToolGrid">
        <article className="pdfToolCard">
          <div className="utilityTitle">
            <FileArchive />
            <div>
              <b>{L.compress}</b>
              <span>{L.compressSub}</span>
            </div>
          </div>
          <button
            className="utilityDrop"
            onClick={() => {
              pdfInput.current.value = "";
              pdfInput.current.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              choosePdfFile(event.dataTransfer.files[0]);
            }}
          >
            <Upload />
            <span>
              {pdf
                ? `${pdf.name} · ${readableSize(pdf.size)}`
                : `${L.choosePdf} · ${L.drop}`}
            </span>
          </button>
          <input
            ref={pdfInput}
            hidden
            type="file"
            accept="application/pdf"
            onChange={(event) => choosePdfFile(event.target.files[0])}
          />
          <label className="pdfLevel">
            {L.quality}
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="balanced">{L.balanced}</option>
              <option value="smaller">{L.smaller}</option>
              <option value="smallest">{L.smallest}</option>
            </select>
          </label>
          <div className="sizeCompare">
            <span>
              {L.original}: <b>{readableSize(pdf?.size)}</b>
            </span>
            <span>
              {L.result}: <b>{readableSize(outputSize)}</b>
            </span>
          </div>
          <p className="pdfNote">{L.note}</p>
          {progress && (
            <div className="toolProgress" aria-live="polite">
              <span
                style={{
                  width: `${(Number(progress.match(/\d+/)?.[0]) / Number(progress.match(/\/ (\d+)/)?.[1])) * 100}%`,
                }}
              />
              {progress}
            </div>
          )}
          <button
            className="utilityAction"
            disabled={!pdf || busy}
            onClick={compressPdf}
          >
            <Download />
            {busy === "compress" ? L.processing : L.run}
          </button>
          <ToolPulse toolId="pdf-compress" tool={L.compress} lang={lang} />
        </article>
        <article className="pdfToolCard">
          <div className="utilityTitle">
            <Files />
            <div>
              <b>{L.images}</b>
              <span>{L.imagesSub}</span>
            </div>
          </div>
          <button
            className="utilityDrop"
            onClick={() => {
              imageInput.current.value = "";
              imageInput.current.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              chooseImages(event.dataTransfer.files);
            }}
          >
            <FileImage />
            <span>
              {images.length
                ? `${images.length} ${L.selected}`
                : `${L.chooseImages} · ${L.drop}`}
            </span>
          </button>
          <input
            ref={imageInput}
            hidden
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => chooseImages(event.target.files)}
          />
          {images.length > 0 && (
            <div className="imageFileList">
              {images.slice(0, 5).map((file) => (
                <span key={`${file.name}-${file.lastModified}`}>
                  {file.name}
                </span>
              ))}
              {images.length > 5 && <span>+{images.length - 5}</span>}
              <button
                onClick={() => {
                  setImages([]);
                  imageInput.current.value = "";
                }}
              >
                <X />
                {L.clear}
              </button>
            </div>
          )}
          {imageOutputSize > 0 && (
            <div className="sizeCompare">
              <span>
                {L.created}: <b>{readableSize(imageOutputSize)}</b>
              </span>
            </div>
          )}
          <button
            className="utilityAction imagePdfAction"
            disabled={!images.length || busy}
            onClick={imagesToPdf}
          >
            <Download />
            {busy === "images" ? L.processing : L.makePdf}
          </button>
          <ToolPulse toolId="images-to-pdf" tool={L.images} lang={lang} />
        </article>
        <article className="pdfToolCard">
          <div className="utilityTitle">
            <Merge />
            <div>
              <b>{L.merge}</b>
              <span>{L.mergeSub}</span>
            </div>
          </div>
          <button
            className="utilityDrop"
            onClick={() => {
              mergeInput.current.value = "";
              mergeInput.current.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              chooseMergeFiles(event.dataTransfer.files);
            }}
          >
            <Files />
            <span>
              {mergeFiles.length
                ? `${mergeFiles.length} ${L.pdfSelected}`
                : `${L.choosePdfs} · ${L.drop}`}
            </span>
          </button>
          <input
            ref={mergeInput}
            hidden
            type="file"
            accept="application/pdf"
            multiple
            onChange={(event) => chooseMergeFiles(event.target.files)}
          />
          {mergeFiles.length > 0 && (
            <div className="imageFileList numberedFiles">
              {mergeFiles.map((file, index) => (
                <span key={`${file.name}-${file.lastModified}`}>
                  {index + 1}. {file.name}
                </span>
              ))}
            </div>
          )}
          {mergeResult && <div className="toolResult">{mergeResult}</div>}
          <button
            className="utilityAction imagePdfAction"
            disabled={mergeFiles.length < 2 || busy}
            onClick={mergePdfs}
          >
            <Download />
            {busy === "merge" ? L.processing : L.mergeRun}
          </button>
          <ToolPulse toolId="pdf-merge" tool={L.merge} lang={lang} />
        </article>
        <article className="pdfToolCard">
          <div className="utilityTitle">
            <Scissors />
            <div>
              <b>{L.split}</b>
              <span>{L.splitSub}</span>
            </div>
          </div>
          <button
            className="utilityDrop"
            onClick={() => {
              splitInput.current.value = "";
              splitInput.current.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              chooseSplitFile(event.dataTransfer.files[0]);
            }}
          >
            <Upload />
            <span>
              {splitFile
                ? `${splitFile.name} · ${splitPageCount} ${L.pageCount}`
                : `${L.choosePdf} · ${L.drop}`}
            </span>
          </button>
          <input
            ref={splitInput}
            hidden
            type="file"
            accept="application/pdf"
            onChange={(event) => chooseSplitFile(event.target.files[0])}
          />
          <label className="pdfLevel">
            {L.pages}
            <input
              type="text"
              value={splitPages}
              placeholder={L.pagesHint}
              disabled={!splitFile}
              onChange={(event) => setSplitPages(event.target.value)}
            />
          </label>
          {splitResult && <div className="toolResult">{splitResult}</div>}
          <button
            className="utilityAction imagePdfAction"
            disabled={!splitFile || busy}
            onClick={extractPages}
          >
            <Download />
            {busy === "split" ? L.processing : L.splitRun}
          </button>
          <ToolPulse toolId="pdf-extract" tool={L.split} lang={lang} />
        </article>
        <article className="pdfToolCard organizeCard">
          <div className="utilityTitle">
            <Files />
            <div>
              <b>{L.organize}</b>
              <span>{L.organizeSub}</span>
            </div>
          </div>
          <button
            className="utilityDrop"
            onClick={() => {
              organizeInput.current.value = "";
              organizeInput.current.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              chooseOrganizeFile(event.dataTransfer.files[0]);
            }}
          >
            <Upload />
            <span>
              {organizeFile
                ? `${organizeFile.name} · ${organizePageCount} ${L.pageCount}`
                : `${L.choosePdf} · ${L.drop}`}
            </span>
          </button>
          <input
            ref={organizeInput}
            hidden
            type="file"
            accept="application/pdf"
            onChange={(event) => chooseOrganizeFile(event.target.files[0])}
          />
          <label className="pdfLevel">
            {L.order}
            <input
              type="text"
              value={organizeOrder}
              placeholder={L.orderHint}
              disabled={!organizeFile}
              onChange={(event) => setOrganizeOrder(event.target.value)}
            />
          </label>
          {organizeResult && <div className="toolResult">{organizeResult}</div>}
          <button
            className="utilityAction imagePdfAction"
            disabled={!organizeFile || busy}
            onClick={organizePages}
          >
            <Download />
            {busy === "organize" ? L.processing : L.organizeRun}
          </button>
          <ToolPulse toolId="pdf-organize" tool={L.organize} lang={lang} />
        </article>
      </div>
      {error && (
        <p className="toolError" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
