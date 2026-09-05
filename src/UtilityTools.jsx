import React, { useMemo, useRef, useState } from "react";
import {
  Download,
  FileImage,
  Maximize2,
  Minimize2,
  RefreshCw,
  Upload,
} from "lucide-react";

const copy = {
  ja: {
    title: "無料の写真ツール",
    sub: "アップロード不要。すべて端末内で処理します。",
    compress: "画像を圧縮・変換",
    calc: "mm・px・DPI 計算",
    pick: "画像を選択",
    quality: "画質",
    width: "幅",
    height: "高さ",
    format: "形式",
    save: "変換して保存",
    original: "元サイズ",
    result: "変換後",
    mmw: "幅 (mm)",
    mmh: "高さ (mm)",
    dpi: "DPI",
    pixels: "必要なピクセル",
    reset: "リセット",
  },
  en: {
    title: "Free photo utilities",
    sub: "No uploads. Everything runs on your device.",
    compress: "Compress & convert image",
    calc: "mm · px · DPI calculator",
    pick: "Choose image",
    quality: "Quality",
    width: "Width",
    height: "Height",
    format: "Format",
    save: "Convert & download",
    original: "Original",
    result: "Estimated",
    mmw: "Width (mm)",
    mmh: "Height (mm)",
    dpi: "DPI",
    pixels: "Required pixels",
    reset: "Reset",
  },
};

export default function UtilityTools({ lang, onSuccess }) {
  const L = copy[lang];
  const input = useRef();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("image");
  const [originalBytes, setOriginalBytes] = useState(0);
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState("image/jpeg");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [estimate, setEstimate] = useState(0);
  const [mmW, setMmW] = useState(35);
  const [mmH, setMmH] = useState(45);
  const [dpi, setDpi] = useState(300);
  const px = useMemo(
    () => ({
      w: Math.round((mmW / 25.4) * dpi),
      h: Math.round((mmH / 25.4) * dpi),
    }),
    [mmW, mmH, dpi],
  );
  const choose = (file) => {
    if (!file?.type.startsWith("image/")) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setImage(img);
      setWidth(img.width);
      setHeight(img.height);
      setOriginalBytes(file.size);
      setName(file.name.replace(/\.[^.]+$/, ""));
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  };
  const convert = () => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    const context = canvas.getContext("2d");
    if (format === "image/jpeg") {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        setEstimate(blob.size);
        const a = document.createElement("a");
        a.download = `${name}.${format.split("/")[1].replace("jpeg", "jpg")}`;
        a.href = URL.createObjectURL(blob);
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        onSuccess?.();
      },
      format,
      quality / 100,
    );
  };
  const size = (n) =>
    n
      ? n > 1048576
        ? `${(n / 1048576).toFixed(1)} MB`
        : `${Math.round(n / 1024)} KB`
      : "—";
  return (
    <section className="utilities" id="tools">
      <div className="sectionHead">
        <span>FREE UTILITIES</span>
        <h2>{L.title}</h2>
        <p>{L.sub}</p>
      </div>
      <div className="utilityGrid">
        <article>
          <div className="utilityTitle">
            <Minimize2 />
            <div>
              <b>{L.compress}</b>
              <span>JPG · PNG · WebP</span>
            </div>
          </div>
          <button className="utilityDrop" onClick={() => { input.current.value = ""; input.current.click(); }}>
            <Upload />
            <span>{image ? `${name} · ${size(originalBytes)}` : L.pick}</span>
          </button>
          <input
            ref={input}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => choose(e.target.files[0])}
          />
          <div className="utilityFields">
            <label>
              {L.width}
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(+e.target.value)}
              />
            </label>
            <label>
              {L.height}
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(+e.target.value)}
              />
            </label>
            <label>
              {L.format}
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </label>
          </div>
          <label className="quality">
            {L.quality} <b>{quality}%</b>
            <input
              type="range"
              min="20"
              max="100"
              value={quality}
              onChange={(e) => setQuality(+e.target.value)}
            />
          </label>
          <div className="sizeCompare">
            <span>
              {L.original}: <b>{size(originalBytes)}</b>
            </span>
            <span>
              {L.result}: <b>{size(estimate)}</b>
            </span>
          </div>
          <button className="utilityAction" disabled={!image} onClick={convert}>
            <Download />
            {L.save}
          </button>
        </article>
        <article>
          <div className="utilityTitle">
            <Maximize2 />
            <div>
              <b>{L.calc}</b>
              <span>Print & online applications</span>
            </div>
          </div>
          <div className="utilityFields calc">
            <label>
              {L.mmw}
              <input
                type="number"
                value={mmW}
                onChange={(e) => setMmW(+e.target.value)}
              />
            </label>
            <label>
              {L.mmh}
              <input
                type="number"
                value={mmH}
                onChange={(e) => setMmH(+e.target.value)}
              />
            </label>
            <label>
              {L.dpi}
              <select value={dpi} onChange={(e) => setDpi(+e.target.value)}>
                <option>72</option>
                <option>150</option>
                <option>300</option>
                <option>600</option>
              </select>
            </label>
          </div>
          <div className="pixelResult">
            <FileImage />
            <span>{L.pixels}</span>
            <strong>
              {px.w} × {px.h} px
            </strong>
            <small>
              {mmW} × {mmH} mm @ {dpi} DPI
            </small>
          </div>
          <button
            className="utilityReset"
            onClick={() => {
              setMmW(35);
              setMmH(45);
              setDpi(300);
            }}
          >
            <RefreshCw />
            {L.reset}
          </button>
        </article>
      </div>
    </section>
  );
}
