import React, { useRef, useState } from "react";
import { Download, QrCode, ShieldCheck } from "lucide-react";
import ToolPulse from "./ToolPulse";

const copy = {
  ja: {
    eyebrow: "QR TOOL",
    title: "QRコードを作成",
    sub: "URLや短いテキストからQRコードを作成します。入力内容は外部へ送信されません。",
    label: "URLまたはテキスト",
    placeholder: "https://example.com",
    size: "画像サイズ",
    create: "QRコードを作成",
    download: "PNGで保存",
    empty: "URLまたはテキストを入力してください。",
    tooLong: "入力は1,000文字以内にしてください。",
    ready: "作成したQRコードがここに表示されます",
    privacy: "ブラウザ内で生成",
  },
  en: {
    eyebrow: "QR TOOL",
    title: "Create a QR code",
    sub: "Turn a URL or short text into a QR code. Your input is never sent anywhere.",
    label: "URL or text",
    placeholder: "https://example.com",
    size: "Image size",
    create: "Create QR code",
    download: "Download PNG",
    empty: "Enter a URL or text.",
    tooLong: "Keep the input under 1,000 characters.",
    ready: "Your QR code will appear here",
    privacy: "Generated in your browser",
  },
};

let qrPromise;
const loadQrCode = () => {
  if (window.QRCode) return Promise.resolve(window.QRCode);
  if (!qrPromise) {
    qrPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./vendor/qrcode.min.js";
      script.onload = () => resolve(window.QRCode);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return qrPromise;
};

export default function QrTool({ lang }) {
  const L = copy[lang];
  const renderTarget = useRef();
  const [value, setValue] = useState("");
  const [size, setSize] = useState(512);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const createQr = async () => {
    const content = value.trim();
    if (!content) {
      setError(L.empty);
      return;
    }
    if (content.length > 1000) {
      setError(L.tooLong);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const QRCode = await loadQrCode();
      renderTarget.current.replaceChildren();
      new QRCode(renderTarget.current, {
        text: content,
        width: size,
        height: size,
        colorDark: "#102e27",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      const canvas = renderTarget.current.querySelector("canvas");
      const generatedImage = renderTarget.current.querySelector("img");
      setImage(canvas?.toDataURL("image/png") || generatedImage?.src || "");
    } catch (cause) {
      console.error(cause);
      setError(lang === "ja" ? "QRコードを作成できませんでした。入力を短くしてお試しください。" : "We couldn't create the QR code. Try shorter input.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "sundata-qr-code.png";
    link.click();
  };

  return (
    <section className="qrTool" id="qr-tool">
      <div className="sectionHead"><span>{L.eyebrow}</span><h2>{L.title}</h2><p>{L.sub}</p></div>
      <div className="qrWorkspace">
        <div className="qrControls">
          <label>{L.label}<textarea value={value} maxLength={1000} rows={5} placeholder={L.placeholder} onChange={(event) => { setValue(event.target.value); setError(""); }} /></label>
          <div className="qrMeta"><label>{L.size}<select value={size} onChange={(event) => setSize(Number(event.target.value))}><option value="256">256 × 256</option><option value="512">512 × 512</option><option value="1024">1024 × 1024</option></select></label><span>{value.length} / 1000</span></div>
          {error && <p className="toolError" role="alert">{error}</p>}
          <button className="utilityAction" disabled={busy} onClick={createQr}><QrCode />{busy ? "…" : L.create}</button>
        </div>
        <div className="qrPreview">
          <div ref={renderTarget} className="qrRender" aria-hidden="true" />
          {image ? <img src={image} alt={lang === "ja" ? "生成されたQRコード" : "Generated QR code"} /> : <div className="qrEmpty"><QrCode /><span>{L.ready}</span></div>}
          <span className="qrPrivacy"><ShieldCheck />{L.privacy}</span>
          <button className="qrDownload" disabled={!image} onClick={download}><Download />{L.download}</button>
        </div>
      </div>
      <ToolPulse tool={L.title} lang={lang} />
    </section>
  );
}
