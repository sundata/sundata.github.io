import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { preload, removeBackground } from "@imgly/background-removal";
import {
  Upload,
  ShieldCheck,
  Download,
  Printer,
  Heart,
  Languages,
  ChevronDown,
  RotateCcw,
  ZoomIn,
  Move,
  Check,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Lock,
  ArrowRight,
  Info,
  X,
  Menu,
  Share2,
} from "lucide-react";
import "./style.css";
import UtilityTools from "./UtilityTools";

const preset = (group, ja, en, w, h, face = "正面・無帽・均一な背景") => ({
  group,
  ja,
  en,
  w,
  h,
  face,
  bg: "#fff",
});
const specs = {
  jpPassport: preset(
    "Japan",
    "日本｜パスポート",
    "Japan · Passport",
    35,
    45,
    "頭頂〜あご 32–36mm",
  ),
  resume: preset("Japan", "日本｜履歴書", "Japan · Résumé", 30, 40),
  mynumber: preset("Japan", "日本｜マイナンバー", "Japan · My Number", 35, 45),
  license: preset(
    "Japan",
    "日本｜運転免許証",
    "Japan · Driver's license",
    24,
    30,
  ),
  residence: preset(
    "Japan",
    "日本｜在留カード",
    "Japan · Residence card",
    30,
    40,
  ),
  jpVisa: preset("Japan", "日本｜査証・ビザ", "Japan · Visa", 45, 45),
  usPassport: preset(
    "Americas",
    "アメリカ｜パスポート",
    "United States · Passport",
    51,
    51,
    "頭部 25–35mm",
  ),
  usVisa: preset("Americas", "アメリカ｜ビザ", "United States · Visa", 51, 51),
  canadaPassport: preset(
    "Americas",
    "カナダ｜パスポート",
    "Canada · Passport",
    50,
    70,
  ),
  canadaVisa: preset("Americas", "カナダ｜ビザ", "Canada · Visa", 35, 45),
  mexicoPassport: preset(
    "Americas",
    "メキシコ｜パスポート",
    "Mexico · Passport",
    35,
    45,
  ),
  brazilPassport: preset(
    "Americas",
    "ブラジル｜パスポート",
    "Brazil · Passport",
    50,
    70,
  ),
  argentinaPassport: preset(
    "Americas",
    "アルゼンチン｜パスポート",
    "Argentina · Passport",
    40,
    40,
  ),
  schengen: preset(
    "Europe",
    "シェンゲン｜ビザ",
    "Schengen · Visa",
    35,
    45,
    "頭部 32–36mm",
  ),
  ukPassport: preset(
    "Europe",
    "イギリス｜パスポート",
    "United Kingdom · Passport",
    35,
    45,
  ),
  germanyId: preset(
    "Europe",
    "ドイツ｜パスポート・ID",
    "Germany · Passport / ID",
    35,
    45,
  ),
  franceId: preset(
    "Europe",
    "フランス｜パスポート・ID",
    "France · Passport / ID",
    35,
    45,
  ),
  italyId: preset(
    "Europe",
    "イタリア｜パスポート・ID",
    "Italy · Passport / ID",
    35,
    45,
  ),
  spainId: preset(
    "Europe",
    "スペイン｜パスポート・ID",
    "Spain · Passport / ID",
    32,
    26,
  ),
  russiaPassport: preset(
    "Europe",
    "ロシア｜国内パスポート",
    "Russia · Internal passport",
    35,
    45,
  ),
  chinaPassport: preset("Asia", "中国｜パスポート", "China · Passport", 33, 48),
  chinaVisa: preset("Asia", "中国｜ビザ", "China · Visa", 33, 48),
  koreaPassport: preset(
    "Asia",
    "韓国｜パスポート",
    "South Korea · Passport",
    35,
    45,
  ),
  indiaPassport: preset(
    "Asia",
    "インド｜パスポート",
    "India · Passport",
    35,
    45,
  ),
  indiaVisa: preset("Asia", "インド｜ビザ", "India · Visa", 51, 51),
  singaporePassport: preset(
    "Asia",
    "シンガポール｜パスポート",
    "Singapore · Passport",
    35,
    45,
  ),
  malaysiaPassport: preset(
    "Asia",
    "マレーシア｜パスポート",
    "Malaysia · Passport",
    35,
    50,
  ),
  indonesiaPassport: preset(
    "Asia",
    "インドネシア｜パスポート",
    "Indonesia · Passport",
    40,
    60,
  ),
  thailandPassport: preset(
    "Asia",
    "タイ｜パスポート",
    "Thailand · Passport",
    35,
    45,
  ),
  vietnamPassport: preset(
    "Asia",
    "ベトナム｜パスポート",
    "Vietnam · Passport",
    40,
    60,
  ),
  philippinesPassport: preset(
    "Asia",
    "フィリピン｜パスポート",
    "Philippines · Passport",
    35,
    45,
  ),
  hkPassport: preset(
    "Asia",
    "香港｜パスポート",
    "Hong Kong · Passport",
    40,
    50,
  ),
  taiwanPassport: preset(
    "Asia",
    "台湾｜パスポート",
    "Taiwan · Passport",
    35,
    45,
  ),
  australiaPassport: preset(
    "Oceania",
    "オーストラリア｜パスポート",
    "Australia · Passport",
    35,
    45,
  ),
  nzPassport: preset(
    "Oceania",
    "ニュージーランド｜パスポート",
    "New Zealand · Passport",
    35,
    45,
  ),
  uaeVisa: preset("Middle East", "UAE｜ビザ", "UAE · Visa", 43, 55),
  saudiVisa: preset(
    "Middle East",
    "サウジアラビア｜ビザ",
    "Saudi Arabia · Visa",
    51,
    51,
  ),
  israelPassport: preset(
    "Middle East",
    "イスラエル｜パスポート",
    "Israel · Passport",
    35,
    45,
  ),
  turkeyPassport: preset(
    "Middle East",
    "トルコ｜パスポート",
    "Türkiye · Passport",
    50,
    60,
  ),
  southAfricaPassport: preset(
    "Africa",
    "南アフリカ｜パスポート",
    "South Africa · Passport",
    35,
    45,
  ),
  egyptPassport: preset(
    "Africa",
    "エジプト｜パスポート",
    "Egypt · Passport",
    40,
    60,
  ),
  nigeriaPassport: preset(
    "Africa",
    "ナイジェリア｜パスポート",
    "Nigeria · Passport",
    35,
    45,
  ),
  custom: preset(
    "Custom",
    "カスタムサイズ",
    "Custom size",
    35,
    45,
    "幅と高さを指定",
  ),
};

const backgrounds = [
  { color: "transparent", ja: "透明", en: "Transparent", use: "PNG cutout" },
  { color: "#ffffff", ja: "純白", en: "Pure white", use: "Passport / visa" },
  { color: "#f5f5f2", ja: "オフホワイト", en: "Off-white", use: "ID / résumé" },
  { color: "#e7e7e7", ja: "ライトグレー", en: "Light gray", use: "UK / EU" },
  { color: "#dcecf3", ja: "淡いブルー", en: "Pale blue", use: "Asia / ID" },
  {
    color: "#b9d8ea",
    ja: "証明写真ブルー",
    en: "ID blue",
    use: "China / Asia",
  },
  { color: "#438bc4", ja: "ブルー", en: "Blue", use: "Official ID" },
  {
    color: "#d92e3a",
    ja: "証明写真レッド",
    en: "ID red",
    use: "China / certificates",
  },
  { color: "#7d1f29", ja: "ダークレッド", en: "Dark red", use: "Certificates" },
  { color: "#eeeeee", ja: "ニュートラル", en: "Neutral", use: "General" },
];
const specGroups = [
  "Japan",
  "Americas",
  "Europe",
  "Asia",
  "Oceania",
  "Middle East",
  "Africa",
  "Custom",
];
const t = {
  ja: {
    nav1: "作成する",
    nav2: "対応サイズ",
    nav3: "使い方",
    privacy: "プライバシー",
    apps: "アプリ",
    donate: "応援する",
    eyebrow: "100% 無料・登録不要・写真は端末内で処理",
    title: "証明写真を、\n自分で正しく。",
    sub: "パスポート、履歴書、ビザなど。写真を選ぶだけで、規格に合わせて調整・印刷できます。",
    start: "写真を選んで始める",
    how: "使い方を見る",
    trust1: "アップロードなし",
    trust2: "透かしなし",
    trust3: "高画質ダウンロード",
    maker: "証明写真をつくる",
    makerSub: "写真と用途を選んで、枠に合わせて調整してください。",
    step1: "1  用途",
    step2: "2  写真",
    step3: "3  調整",
    choose: "写真を選択",
    drop: "またはここにドラッグ＆ドロップ",
    local: "写真はサーバーへ送信されません",
    zoom: "拡大",
    rotate: "回転",
    bright: "明るさ",
    contrast: "コントラスト",
    reset: "リセット",
    guide: "ガイド",
    bg: "背景色",
    download: "1枚をダウンロード",
    print: "印刷用シート",
    ready: "写真を追加すると、ここにプレビューが表示されます",
    tip: "正面を向き、無表情で、顔に影のない写真を選びましょう。",
    free: "すべて無料です。",
    freeSub:
      "もし役に立ったら、コーヒー一杯分の応援でこのサイトを支えてください。",
    support: "開発を応援する",
    why: "なぜ、このツール？",
    whySub: "証明写真づくりで、本当に必要なものだけ。",
    c1: "端末内で完結",
    c1s: "写真はブラウザ内だけで処理。サーバーに保存も送信もしません。",
    c2: "隠れた料金なし",
    c2s: "編集も高画質ダウンロードも印刷用シートも、すべて無料です。",
    c3: "日英・主要規格",
    c3s: "日本の各種証明写真と海外パスポート・ビザの代表規格に対応。",
    note: "最終的な受理を保証するものではありません。申請先の最新要件も確認してください。",
    close: "閉じる",
  },
  en: {
    nav1: "Create",
    nav2: "Photo sizes",
    nav3: "How it works",
    privacy: "Privacy",
    apps: "Apps",
    donate: "Support us",
    eyebrow: "100% free · No account · Processed on your device",
    title: "ID photos,\ndone right by you.",
    sub: "For passports, résumés, visas and more. Pick a photo, fit it to the official frame, and print.",
    start: "Choose a photo",
    how: "See how it works",
    trust1: "No uploads",
    trust2: "No watermark",
    trust3: "High-res download",
    maker: "Create your ID photo",
    makerSub: "Choose a use and photo, then align it with the guide.",
    step1: "1  Use",
    step2: "2  Photo",
    step3: "3  Adjust",
    choose: "Choose photo",
    drop: "or drag & drop here",
    local: "Your photo never leaves this device",
    zoom: "Zoom",
    rotate: "Rotate",
    bright: "Brightness",
    contrast: "Contrast",
    reset: "Reset",
    guide: "Guide",
    bg: "Background",
    download: "Download single photo",
    print: "Printable sheet",
    ready: "Your preview will appear here",
    tip: "Use a front-facing, neutral photo with even light and no facial shadows.",
    free: "Everything is free.",
    freeSub:
      "If this saved you time, a small tip helps keep the site online and independent.",
    support: "Support development",
    why: "Why this tool?",
    whySub: "Only what you actually need to make an ID photo.",
    c1: "Private by design",
    c1s: "Your photo is processed in your browser—never uploaded or stored.",
    c2: "No hidden fees",
    c2s: "Editing, high-resolution downloads and printable sheets are all free.",
    c3: "Japanese & global sizes",
    c3s: "Popular Japanese IDs plus major international passport and visa formats.",
    note: "This tool cannot guarantee acceptance. Always confirm the latest rules with the issuing authority.",
    close: "Close",
  },
};

function App() {
  const [lang, setLang] = useState("ja"),
    [spec, setSpec] = useState("jpPassport"),
    [img, setImg] = useState(null),
    [zoom, setZoom] = useState(1),
    [rot, setRot] = useState(0),
    [bright, setBright] = useState(100),
    [contrast, setContrast] = useState(100),
    [bg, setBg] = useState("#f5f5f2"),
    [drag, setDrag] = useState(false),
    [pos, setPos] = useState({ x: 0, y: 0 }),
    [donate, setDonate] = useState(false),
    [menu, setMenu] = useState(false),
    [camera, setCamera] = useState(false),
    [cameraError, setCameraError] = useState(""),
    [facing, setFacing] = useState("user"),
    [cutout, setCutout] = useState(null),
    [removing, setRemoving] = useState(false),
    [backgroundOn, setBackgroundOn] = useState(false),
    [backgroundError, setBackgroundError] = useState(""),
    [modelProgress, setModelProgress] = useState(0),
    [modelReady, setModelReady] = useState(false),
    [eraseMode, setEraseMode] = useState(false),
    [brushSize, setBrushSize] = useState(36),
    [cutoutVersion, setCutoutVersion] = useState(0);
  const canvas = useRef(),
    file = useRef(),
    pointer = useRef(),
    video = useRef(),
    stream = useRef();
  const L = t[lang],
    S = specs[spec];
  const load = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    const im = new Image();
    im.onload = () => {
      setImg(im);
      setCutout(null);
      setBackgroundOn(false);
      setZoom(1);
      setPos({ x: 0, y: 0 });
    };
    im.src = URL.createObjectURL(f);
  };
  const applyBackground = async (color) => {
    setBg(color);
    setBackgroundError("");
    if (cutout) {
      setBackgroundOn(true);
      return;
    }
    if (!img || removing) return;
    setRemoving(true);
    try {
      const config = {
        model: "isnet_quint8",
        device: navigator.gpu ? "gpu" : "cpu",
        progress: (_key, current, total) =>
          setModelProgress(total ? Math.round((current / total) * 100) : 0),
      };
      const result = await removeBackground(img.src, config);
      const cleaned = await cleanTransparency(result);
      const transparent = new Image();
      transparent.onload = () => {
        const editable = document.createElement("canvas");
        editable.width = transparent.width;
        editable.height = transparent.height;
        editable.getContext("2d").drawImage(transparent, 0, 0);
        setCutout(editable);
        setBackgroundOn(true);
        setRemoving(false);
      };
      transparent.onerror = () => {
        setRemoving(false);
        setBackgroundError(
          lang === "ja"
            ? "背景処理に失敗しました"
            : "Background removal failed",
        );
      };
      transparent.src = URL.createObjectURL(cleaned);
    } catch {
      setRemoving(false);
      setBackgroundError(
        lang === "ja"
          ? "背景処理モデルを読み込めませんでした。通信状態を確認してください。"
          : "Could not load the background model. Check your connection.",
      );
    }
  };
  const cleanTransparency = (blob) =>
    new Promise((resolve) => {
      const source = new Image();
      source.onload = () => {
        const c = document.createElement("canvas");
        c.width = source.width;
        c.height = source.height;
        const context = c.getContext("2d", { willReadFrequently: true });
        context.drawImage(source, 0, 0);
        const pixels = context.getImageData(0, 0, c.width, c.height);
        for (let i = 3; i < pixels.data.length; i += 4) {
          const alpha = pixels.data[i];
          pixels.data[i] =
            alpha < 48 ? 0 : Math.min(255, ((alpha - 48) * 255) / 170);
        }
        context.putImageData(pixels, 0, 0);
        c.toBlob(resolve, "image/png");
        URL.revokeObjectURL(source.src);
      };
      source.src = URL.createObjectURL(blob);
    });
  const eraseAt = (event, element) => {
    if (!eraseMode || !cutout) return;
    const rect = element.getBoundingClientRect();
    const outputX =
      ((event.clientX - rect.left) / rect.width) * canvas.current.width;
    const outputY =
      ((event.clientY - rect.top) / rect.height) * canvas.current.height;
    const centeredX = outputX - canvas.current.width / 2 - pos.x;
    const centeredY = outputY - canvas.current.height / 2 - pos.y;
    const angle = (-rot * Math.PI) / 180;
    const rotatedX = centeredX * Math.cos(angle) - centeredY * Math.sin(angle);
    const rotatedY = centeredX * Math.sin(angle) + centeredY * Math.cos(angle);
    const scale =
      Math.max(
        canvas.current.width / cutout.width,
        canvas.current.height / cutout.height,
      ) * zoom;
    const sourceX = rotatedX / scale + cutout.width / 2;
    const sourceY = rotatedY / scale + cutout.height / 2;
    const context = cutout.getContext("2d");
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(sourceX, sourceY, brushSize / scale, 0, Math.PI * 2);
    context.fill();
    context.restore();
    setCutoutVersion((value) => value + 1);
  };
  const startManualErase = () => {
    if (!img) return;
    if (!cutout) {
      const editable = document.createElement("canvas");
      editable.width = img.naturalWidth || img.width;
      editable.height = img.naturalHeight || img.height;
      editable.getContext("2d").drawImage(img, 0, 0);
      setCutout(editable);
    }
    setBg("transparent");
    setBackgroundOn(true);
    setEraseMode(true);
    setCutoutVersion((value) => value + 1);
  };
  useEffect(() => {
    if (!img || modelReady) return;
    const warmup = () =>
      preload({
        model: "isnet_quint8",
        device: navigator.gpu ? "gpu" : "cpu",
        progress: (_key, current, total) =>
          setModelProgress(total ? Math.round((current / total) * 100) : 0),
      })
        .then(() => setModelReady(true))
        .catch(() => {});
    const timer = window.setTimeout(warmup, 500);
    return () => window.clearTimeout(timer);
  }, [img, modelReady]);
  const stopCamera = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setCamera(false);
  };
  const startCamera = async (nextFacing = facing) => {
    setCamera(true);
    setCameraError("");
    stream.current?.getTracks().forEach((track) => track.stop());
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextFacing } },
        audio: false,
      });
      stream.current = media;
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = media;
          video.current.play();
        }
      });
    } catch {
      setCameraError(
        lang === "ja"
          ? "カメラを利用できません。ブラウザのカメラ許可を確認してください。"
          : "Camera unavailable. Please check your browser permission.",
      );
    }
  };
  const switchCamera = () => {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    startCamera(next);
  };
  const takePhoto = () => {
    const v = video.current;
    if (!v?.videoWidth) return;
    const capture = document.createElement("canvas");
    capture.width = v.videoWidth;
    capture.height = v.videoHeight;
    const context = capture.getContext("2d");
    if (facing === "user") {
      context.translate(capture.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(v, 0, 0);
    const photo = new Image();
    photo.onload = () => {
      setImg(photo);
      setCutout(null);
      setBackgroundOn(false);
      setZoom(1);
      setPos({ x: 0, y: 0 });
      stopCamera();
    };
    photo.src = capture.toDataURL("image/jpeg", 0.95);
  };
  useEffect(
    () => () => stream.current?.getTracks().forEach((t) => t.stop()),
    [],
  );
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const x = c.getContext("2d"),
      w = 600,
      h = Math.round((600 * S.h) / S.w);
    c.width = w;
    c.height = h;
    if (bg === "transparent") {
      x.clearRect(0, 0, w, h);
    } else {
      x.fillStyle = bg;
      x.fillRect(0, 0, w, h);
    }
    const source = backgroundOn && cutout ? cutout : img;
    if (source) {
      x.save();
      x.filter = `brightness(${bright}%) contrast(${contrast}%)`;
      x.translate(w / 2 + pos.x, h / 2 + pos.y);
      x.rotate((rot * Math.PI) / 180);
      const scale = Math.max(w / source.width, h / source.height) * zoom;
      x.drawImage(
        source,
        (-source.width * scale) / 2,
        (-source.height * scale) / 2,
        source.width * scale,
        source.height * scale,
      );
      x.restore();
    }
  }, [
    img,
    cutout,
    cutoutVersion,
    backgroundOn,
    zoom,
    rot,
    bright,
    contrast,
    bg,
    pos,
    spec,
  ]);
  const down = (sheet = false) => {
    if (!img) return;
    if (!sheet) {
      const a = document.createElement("a");
      a.download = `id-photo-${S.w}x${S.h}mm.png`;
      a.href = canvas.current.toDataURL("image/png");
      a.click();
      window.setTimeout(() => setDonate(true), 700);
      return;
    }
    const c = document.createElement("canvas"),
      x = c.getContext("2d");
    c.width = 1800;
    c.height = 1200;
    x.fillStyle = "white";
    x.fillRect(0, 0, c.width, c.height);
    const ph = 960,
      pw = (ph * S.w) / S.h,
      g = 40;
    for (
      let i = 0;
      i <
      Math.floor((c.width - g) / (pw + g)) *
        Math.floor((c.height - g) / (ph + g));
      i++
    ) {
      const cols = Math.floor((c.width - g) / (pw + g)),
        xx = g + (i % cols) * (pw + g),
        yy = g + Math.floor(i / cols) * (ph + g);
      x.drawImage(canvas.current, xx, yy, pw, ph);
    }
    const a = document.createElement("a");
    a.download = "id-photo-print-sheet-4x6.png";
    a.href = c.toDataURL();
    a.click();
    window.setTimeout(() => setDonate(true), 700);
  };
  const go = () =>
    document.querySelector("#maker").scrollIntoView({ behavior: "smooth" });
  return (
    <>
      <header>
        <a className="logo" href="#">
          <span>◉</span> SHOMEI <small>証明写真</small>
        </a>
        <nav className={menu ? "open" : ""} onClick={() => setMenu(false)}>
          <a href="#maker">{L.nav1}</a>
          <a href="#sizes">{L.nav2}</a>
          <a href="#how">{L.nav3}</a>
          <a href="./apps.html">{L.apps}</a>
          <a href="#privacy">{L.privacy}</a>
        </nav>
        <div className="actions">
          <button
            className="lang"
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
          >
            <Languages size={17} />
            {lang === "ja" ? "EN" : "日本語"}
          </button>
          <button className="tipbtn" onClick={() => setDonate(true)}>
            <Heart size={16} />
            {L.donate}
          </button>
          <button
            className="menubtn"
            aria-label="Menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="heroCopy">
            <div className="pill">
              <ShieldCheck size={15} />
              {L.eyebrow}
            </div>
            <h1>
              {L.title.split("\n").map((v, i) => (
                <React.Fragment key={v}>
                  {v}
                  {!i && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p>{L.sub}</p>
            <div className="heroBtns">
              <button
                className="primary"
                onClick={() => {
                  go();
                  setTimeout(() => file.current?.click(), 600);
                }}
              >
                {L.start}
                <ArrowRight size={18} />
              </button>
              <button
                className="secondary"
                onClick={() =>
                  document
                    .querySelector("#how")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                {L.how}
              </button>
            </div>
            <div className="trust">
              <span>
                <Lock />
                {L.trust1}
              </span>
              <span>
                <Check />
                {L.trust2}
              </span>
              <span>
                <Download />
                {L.trust3}
              </span>
            </div>
          </div>
          <div className="heroArt">
            <div className="arch">
              <div className="portrait">
                <div className="hair"></div>
                <div className="head"></div>
                <div className="neck"></div>
                <div className="body"></div>
              </div>
              <div className="scan"></div>
            </div>
            <div className="float f1">
              <Check />
              35 × 45 mm
            </div>
            <div className="float f2">
              <ShieldCheck />
              {lang === "ja" ? "端末内で処理" : "On-device"}
            </div>
          </div>
        </section>
        <section className="maker" id="maker">
          <div className="sectionHead">
            <span>PHOTO MAKER</span>
            <h2>{L.maker}</h2>
            <p>{L.makerSub}</p>
          </div>
          <div className="workspace">
            <aside>
              <label>{L.step1}</label>
              <div className="select">
                <select value={spec} onChange={(e) => setSpec(e.target.value)}>
                  {specGroups.map((group) => (
                    <optgroup label={group} key={group}>
                      {Object.entries(specs)
                        .filter(([, v]) => v.group === group)
                        .map(([k, v]) => (
                          <option value={k} key={k}>
                            {v[lang]} — {v.w}×{v.h} mm
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown />
              </div>
              <div className="specCard">
                <b>
                  {S.w} × {S.h} mm
                </b>
                <span>{S.face}</span>
                <small>
                  {lang === "ja" ? "推奨 300 dpi" : "Recommended 300 dpi"}
                </small>
              </div>
              <label>{L.step2}</label>
              <div
                className={"drop " + (drag ? "over" : "")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  load(e.dataTransfer.files[0]);
                }}
                onClick={() => file.current.click()}
              >
                <input
                  ref={file}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => load(e.target.files[0])}
                />
                <div>
                  <Upload />
                  <b>{L.choose}</b>
                  <span>{L.drop}</span>
                </div>
              </div>
              <button className="cameraButton" onClick={() => startCamera()}>
                <Camera />
                {lang === "ja" ? "カメラで撮影" : "Take a photo"}
              </button>
              <p className="local">
                <Lock />
                {L.local}
              </p>
            </aside>
            <div className="preview">
              <div
                className={`canvasWrap ${eraseMode ? "erasing" : ""}`}
                onPointerDown={(e) => {
                  if (!img) return;
                  if (eraseMode) {
                    pointer.current = { erasing: true };
                    eraseAt(e, e.currentTarget);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    return;
                  }
                  pointer.current = {
                    x: e.clientX,
                    y: e.clientY,
                    p: { ...pos },
                  };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (pointer.current?.erasing) {
                    eraseAt(e, e.currentTarget);
                    return;
                  }
                  if (pointer.current)
                    setPos({
                      x: pointer.current.p.x + e.clientX - pointer.current.x,
                      y: pointer.current.p.y + e.clientY - pointer.current.y,
                    });
                }}
                onPointerUp={() => (pointer.current = null)}
              >
                <canvas ref={canvas} />
                {!img && (
                  <div className="empty">
                    <ImageIcon />
                    <b>{L.ready}</b>
                    <span>{L.tip}</span>
                  </div>
                )}
                {img && (
                  <div className="faceGuide">
                    <div></div>
                    <span>
                      {S.w} × {S.h} mm
                    </span>
                  </div>
                )}
              </div>
            </div>
            <aside className="controls">
              <label>{L.step3}</label>
              {[
                [L.zoom, zoom, 0.7, 2.2, 0.01, setZoom, ZoomIn],
                [L.rotate, rot, -15, 15, 1, setRot, Move],
                [L.bright, bright, 70, 130, 1, setBright, Sparkles],
                [L.contrast, contrast, 70, 130, 1, setContrast, Sparkles],
              ].map(([n, v, min, max, st, set, I]) => (
                <div className="control" key={n}>
                  <div>
                    <span>{n}</span>
                    <b>
                      {Math.round(v)}
                      {n === L.rotate ? "°" : n === L.zoom ? "×" : "%"}
                    </b>
                  </div>
                  <input
                    type="range"
                    value={v}
                    min={min}
                    max={max}
                    step={st}
                    onChange={(e) => set(+e.target.value)}
                  />
                </div>
              ))}
              <div className="backgroundLabel">{L.bg}</div>
              <button
                className="personOnlyButton"
                onClick={() => applyBackground("transparent")}
                disabled={!img || removing}
              >
                <Sparkles />
                {removing
                  ? lang === "ja"
                    ? "人物を認識しています…"
                    : "Detecting person…"
                  : lang === "ja"
                    ? "人物以外をすべて削除"
                    : "Remove everything except person"}
              </button>
              <button
                className="manualEraseButton"
                onClick={startManualErase}
                disabled={!img || removing}
              >
                <span>⌫</span>
                {lang === "ja"
                  ? "自動処理なしで直接消す"
                  : "Erase manually without AI"}
              </button>
              <div className="backgroundGrid">
                {backgrounds.map((item) => (
                  <button
                    key={item.color}
                    className={
                      backgroundOn && bg === item.color ? "active" : ""
                    }
                    onClick={() => applyBackground(item.color)}
                    disabled={!img || removing}
                    title={`${item[lang]} · ${item.use}`}
                  >
                    <i
                      className={
                        item.color === "transparent" ? "transparent" : ""
                      }
                      style={
                        item.color === "transparent"
                          ? undefined
                          : { background: item.color }
                      }
                    />
                    <span>{item[lang]}</span>
                  </button>
                ))}
              </div>
              {removing && (
                <p className="backgroundStatus">
                  <span />
                  {lang === "ja"
                    ? `人物を切り抜いています… ${modelProgress ? `${modelProgress}%` : ""}`
                    : `Removing background… ${modelProgress ? `${modelProgress}%` : ""}`}
                </p>
              )}
              {!removing && img && !modelReady && modelProgress > 0 && (
                <p className="modelWarmup">
                  {lang === "ja"
                    ? `背景処理を準備中 ${modelProgress}% — 編集はそのまま続けられます`
                    : `Preparing background tool ${modelProgress}% — you can keep editing`}
                </p>
              )}
              {backgroundOn && (
                <div className="cutoutTools">
                  <button
                    className={eraseMode ? "active" : ""}
                    onClick={() => setEraseMode(!eraseMode)}
                  >
                    {eraseMode
                      ? lang === "ja"
                        ? "✓ 消しゴムを完了"
                        : "✓ Finish erasing"
                      : lang === "ja"
                        ? "残りを手動で消す"
                        : "Erase remaining areas"}
                  </button>
                  {eraseMode && (
                    <label>
                      {lang === "ja" ? "ブラシ" : "Brush"}
                      <input
                        type="range"
                        min="12"
                        max="90"
                        value={brushSize}
                        onChange={(e) => setBrushSize(+e.target.value)}
                      />
                    </label>
                  )}
                  <button
                    className="originalToggle"
                    onClick={() => {
                      setEraseMode(false);
                      setBackgroundOn(false);
                      setCutout(null);
                      setCutoutVersion((value) => value + 1);
                      setBackgroundError("");
                    }}
                  >
                    {lang === "ja"
                      ? "元の背景に戻す"
                      : "Restore original background"}
                  </button>
                </div>
              )}
              {backgroundError && (
                <p className="backgroundError">{backgroundError}</p>
              )}
              <button
                className="reset"
                onClick={() => {
                  setZoom(1);
                  setRot(0);
                  setBright(100);
                  setContrast(100);
                  setPos({ x: 0, y: 0 });
                  setBackgroundOn(false);
                  setEraseMode(false);
                  setCutout(null);
                  setCutoutVersion((value) => value + 1);
                  setBg(S.bg || "#fff");
                  setBackgroundError("");
                }}
              >
                <RotateCcw />
                {L.reset}
              </button>
              <div className="dl">
                <button disabled={!img} onClick={() => down(false)}>
                  <Download />
                  {L.download}
                </button>
                <button disabled={!img} onClick={() => down(true)}>
                  <Printer />
                  {L.print}
                </button>
              </div>
            </aside>
          </div>
          <p className="notice">
            <Info />
            {L.note}
          </p>
        </section>
        <UtilityTools lang={lang} onSuccess={() => setDonate(true)} />
        <section className="why" id="how">
          <div className="sectionHead">
            <span>OUR PROMISE</span>
            <h2>{L.why}</h2>
            <p>{L.whySub}</p>
          </div>
          <div className="cards">
            {[
              [ShieldCheck, L.c1, L.c1s],
              [Heart, L.c2, L.c2s],
              [Camera, L.c3, L.c3s],
            ].map(([I, a, b], i) => (
              <article key={a}>
                <div className={"ico i" + i}>
                  <I />
                </div>
                <b>{a}</b>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="support">
          <div>
            <small>KEEP IT FREE</small>
            <h2>{L.free}</h2>
            <p>{L.freeSub}</p>
          </div>
          <button onClick={() => setDonate(true)}>
            <Heart />
            {L.support}
          </button>
        </section>
        <section className="shareBlock">
          <div>
            <Share2 />
            <div>
              <b>
                {lang === "ja" ? "無料ツールをシェア" : "Share this free tool"}
              </b>
              <span>
                {lang === "ja"
                  ? "必要としている人に届けてください"
                  : "Help someone who needs an ID photo"}
              </span>
            </div>
          </div>
          <div className="shareLinks">
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(lang === "ja" ? "無料・登録不要・写真をアップロードしない証明写真ツール SHOMEI" : "Free, private ID photo tools—no upload, account, watermark or paid download.")}&url=${encodeURIComponent("https://sundata.tech/")}`}
            >
              X
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://sundata.tech/")}`}
            >
              Facebook
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://sundata.tech/")}`}
            >
              LinkedIn
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.reddit.com/submit?url=${encodeURIComponent("https://sundata.tech/")}&title=${encodeURIComponent("Free and private ID photo tools")}`}
            >
              Reddit
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://sundata.tech/")}`}
            >
              LINE
            </a>
          </div>
        </section>
      </main>
      <section className="sizes" id="sizes">
        <div className="sectionHead">
          <span>PHOTO SIZES</span>
          <h2>
            {lang === "ja" ? "対応している写真サイズ" : "Supported photo sizes"}
          </h2>
          <p>
            {lang === "ja"
              ? "用途を選ぶだけで、正しい縦横比に設定します。"
              : "Choose a use and the correct aspect ratio is applied."}
          </p>
        </div>
        <div className="sizeGrid">
          {Object.entries(specs)
            .filter(([k]) => k !== "custom")
            .map(([k, v]) => (
              <button
                key={k}
                onClick={() => {
                  setSpec(k);
                  go();
                }}
              >
                <span>{v[lang]}</span>
                <b>
                  {v.w} × {v.h} mm
                </b>
                <ArrowRight />
              </button>
            ))}
        </div>
      </section>
      <section className="privacyBlock" id="privacy">
        <ShieldCheck />
        <div>
          <span>PRIVACY FIRST</span>
          <h2>
            {lang === "ja"
              ? "写真は、あなたの端末から出ません。"
              : "Your photo never leaves your device."}
          </h2>
          <p>
            {lang === "ja"
              ? "画像処理はブラウザ内で完結します。アップロード、アカウント、写真の保存、追跡用画像解析は行いません。ページを閉じると編集内容は消去されます。"
              : "All processing happens inside your browser. We do not upload, store, analyze, or attach your photo to an account. Your edit disappears when you close the page."}
          </p>
        </div>
      </section>
      <section className="aboutBlock" id="about">
        <div>
          <span>ABOUT & TRANSPARENCY</span>
          <h2>
            {lang === "ja" ? "無料であり続けるために" : "Built to stay free"}
          </h2>
          <p>
            {lang === "ja"
              ? "SHOMEIは、証明写真や日常の画像作業を、登録・透かし・有料ダウンロードなしで完了できるツール群です。写真はブラウザ内で処理され、サーバーには送信されません。"
              : "SHOMEI is a collection of tools for ID photos and everyday image tasks—without accounts, watermarks or paid downloads. Photos are processed in your browser and never sent to our server."}
          </p>
          <a href="mailto:work.sundata@gmail.com">
            work.sundata@gmail.com <ArrowRight />
          </a>
        </div>
        <div className="changeLog">
          <b>{lang === "ja" ? "更新履歴" : "What’s new"}</b>
          <ul>
            <li>
              <time>2026.07</time>
              {lang === "ja"
                ? "各国規格、背景削除、手動消しゴム"
                : "Global sizes, background removal and manual eraser"}
            </li>
            <li>
              <time>2026.07</time>
              {lang === "ja"
                ? "画像圧縮、形式変換、DPI計算"
                : "Compression, format conversion and DPI calculator"}
            </li>
            <li>
              <time>2026.07</time>
              {lang === "ja"
                ? "PWA・オフライン対応、SEOガイド"
                : "PWA, offline support and SEO guides"}
            </li>
          </ul>
        </div>
      </section>
      <footer>
        <a className="logo" href="#">
          <span>◉</span> SHOMEI
        </a>
        <p>© 2026 Shomei. Made with care in Japan.</p>
        <div>
          <a href="./apps.html">{L.apps}</a>
          <a href="./privacy-policy.html">{L.privacy}</a>
          <a href="./terms.html">Terms</a>
        </div>
      </footer>
      {donate && (
        <div className="modal" onClick={() => setDonate(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setDonate(false)}>
              <X />
            </button>
            <div className="heart">
              <Heart />
            </div>
            <h2>{L.free}</h2>
            <p>
              {lang === "ja"
                ? "このサイトは広告や有料ダウンロードなしで運営しています。お好きな方法で応援してください。"
                : "This site runs without ads or paid downloads. Choose any way you’d like to help."}
            </p>
            <div className="sundataIntro">
              <b>{lang === "ja" ? "無料ツールを応援" : "Support free tools"}</b>
              <span>
                {lang === "ja"
                  ? "無料・広告なし・プライバシー重視"
                  : "Free, ad-free and privacy-first."}
              </span>
              <p>
                {lang === "ja"
                  ? "ご支援はサーバー運営、機能改善、そして高画質ダウンロードを誰でも無料で使える環境の維持に役立てられます。"
                  : "Your support helps cover hosting, improve features, and keep high-quality downloads free for everyone."}
              </p>
            </div>
            <a href="https://ko-fi.com/sundata" target="_blank" rel="noreferrer">
              Ko-fi ·{" "}
              {lang === "ja" ? "無料ツールを応援" : "Support this free tool"}{" "}
              <ArrowRight />
            </a>
            <a
              href="https://buymeacoffee.com/tokyosun"
              target="_blank"
              rel="noreferrer"
            >
              Buy Me a Coffee ·{" "}
              {lang === "ja" ? "海外向け応援" : "International support"}{" "}
              <ArrowRight />
            </a>
            <small>
              {lang === "ja"
                ? "安全な外部決済サービスへ移動します"
                : "You will continue to a secure external payment service."}
            </small>
          </div>
        </div>
      )}
      {camera && (
        <div className="cameraModal" role="dialog" aria-modal="true">
          <div className="cameraPanel">
            <div className="cameraHead">
              <div>
                <b>{lang === "ja" ? "写真を撮影" : "Take a photo"}</b>
                <span>
                  {lang === "ja"
                    ? "顔をガイドの中央に合わせてください"
                    : "Center your face inside the guide"}
                </span>
              </div>
              <button onClick={stopCamera} aria-label="Close camera">
                <X />
              </button>
            </div>
            <div className={`cameraView ${facing === "user" ? "mirror" : ""}`}>
              <video ref={video} playsInline muted />
              {!cameraError && <div className="cameraGuide" />}
              {cameraError && <p className="cameraError">{cameraError}</p>}
            </div>
            <div className="cameraActions">
              <button onClick={switchCamera} disabled={!!cameraError}>
                <RotateCcw />
                {lang === "ja" ? "カメラ切替" : "Switch"}
              </button>
              <button
                className="shutter"
                onClick={takePhoto}
                disabled={!!cameraError}
                aria-label="Take photo"
              >
                <span />
              </button>
              <button onClick={stopCamera}>
                <X />
                {lang === "ja" ? "キャンセル" : "Cancel"}
              </button>
            </div>
            <small>
              <Lock />
              {lang === "ja"
                ? "撮影した写真も端末内だけで処理されます"
                : "Captured photos are processed only on this device"}
            </small>
          </div>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("./sw.js"),
  );
}
