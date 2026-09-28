import React from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

const content = {
  ja: {
    eyebrow: "PRACTICAL GUIDES",
    title: "変換する前に知っておきたいこと",
    intro:
      "ただファイルを小さくするだけでなく、用途に合う形式と設定を選べるように、実際の処理方法と失敗しやすい点をまとめました。",
    articles: [
      {
        title: "JPG・PNG・WebPの選び方",
        body: "写真はJPG、透過画像や図版はPNG、ウェブ共有で容量を抑えたい場合はWebPが基本です。JPGへ変換すると透明部分は白になります。画質を下げる前に縦横サイズを用途に合わせると、見た目を保ちながら容量を減らしやすくなります。",
        points: ["写真：JPG", "透過・図版：PNG", "ウェブ共有：WebP"],
        href: "/guides/image-compression.html",
      },
      {
        title: "PDF圧縮で変わるもの",
        body: "このサイトのPDF圧縮は、各ページを画像として再構成する方式です。スキャン資料や写真中心のPDFには効果がありますが、文字検索、コピー、フォーム、リンクなどは失われる場合があります。契約書の原本や電子署名付きPDFは、複製を残してから処理してください。",
        points: ["写真中心のPDF向け", "文字検索は失われる場合あり", "原本は必ず保存"],
        href: "/guides/pdf-compression.html",
      },
      {
        title: "PDFからOfficeへ変換するときの限界",
        body: "PDFは完成したページの見た目を保存する形式で、WordやExcelの元データ構造は持っていません。変換結果は再編集の出発点として使い、表のセル、段組み、フォント、改ページを確認してください。複雑な帳票ほど手直しが必要です。",
        points: ["レイアウトを必ず確認", "表や段組みは要修正", "機密文書は端末内で処理"],
        href: "/guides/pdf-office-conversion.html",
      },
      {
        title: "端末内処理とは",
        body: "画像とPDFはブラウザのメモリ内で読み込み、変換後のファイルもブラウザから直接保存します。SunDataのサーバーへファイル本体を送信しません。共有端末では、作業後にダウンロード履歴や保存先も確認してください。",
        points: ["ファイルをアップロードしない", "アカウント登録なし", "処理後はブラウザを閉じて完了"],
        href: "/about.html",
      },
    ],
    faqTitle: "よくある質問",
    faqs: [
      ["無料版に回数制限はありますか？", "現在、主要な画像・PDFツールに回数制限や有料ダウンロードはありません。大きなファイルは端末性能により処理できない場合があります。"],
      ["変換したファイルは保存されますか？", "サイト運営者のサーバーには保存されません。ダウンロード後の保存場所は、ブラウザと端末の設定に従います。"],
      ["結果が元ファイルより大きくなることはありますか？", "あります。すでに最適化された画像やPDFは、再変換で容量が増える場合があります。その場合は元ファイルを使うか、寸法・画質を調整してください。"],
      ["公的書類にそのまま使えますか？", "提出先ごとに寸法、背景、容量、更新時期などが異なります。ツールの設定に加えて、必ず提出先の最新要件を確認してください。"],
    ],
    editorial: "内容は実装仕様と実機での動作確認に基づき、SunDataサービス株式会社が作成・更新しています。最終更新：2026年9月28日",
    more: "詳しいガイドを読む",
  },
  zh: {
    eyebrow: "实用指南",
    title: "转换文件前需要了解的事情",
    intro: "我们根据工具实际的处理方式，说明不同格式的差异、适用场景和容易出错的地方，帮助你在文件大小和质量之间做出选择。",
    articles: [
      { title: "如何选择 JPG、PNG 和 WebP", body: "照片通常适合 JPG，透明图片和图表适合 PNG，网页分享可优先考虑 WebP。转换成 JPG 时透明区域会变成白色。先缩小到实际需要的尺寸，通常比单纯降低画质更有效。", points: ["照片：JPG", "透明图片和图表：PNG", "网页分享：WebP"], href: "/en/guides/image-compression.html" },
      { title: "PDF 压缩会改变什么", body: "本站会把 PDF 的每一页绘制成图片，再生成新的 PDF。它适合扫描件和照片较多的资料，但可搜索文字、表单和链接可能消失。合同和签名文件请务必保留原件。", points: ["适合扫描件和照片", "可能失去文字搜索", "始终保留原件"], href: "/en/guides/pdf-compression.html" },
      { title: "PDF 转 Office 的限制", body: "PDF 保存的是页面最终外观，并不保存原来的 Word 或 Excel 结构。转换结果应作为重新编辑的起点，并检查表格、分栏、字体和分页。复杂表单通常需要手动调整。", points: ["检查页面布局", "表格可能需要修复", "文件在设备内处理"], href: "/en/guides/pdf-office-conversion.html" },
      { title: "什么是设备内处理", body: "图片和 PDF 会读入浏览器内存，结果由浏览器直接下载，文件本身不会发送到 SunData 服务器。在共用设备上完成操作后，请检查下载目录和浏览器记录。", points: ["不上传文件", "无需注册账号", "完成后关闭页面"], href: "/en/about.html" },
    ],
    faqTitle: "常见问题",
    faqs: [
      ["免费版有次数限制吗？", "目前主要图片和 PDF 工具没有次数限制，也没有付费下载。超大文件可能会受到设备可用内存限制。"],
      ["转换后的文件会被保存吗？", "文件不会保存在 SunData 服务器。下载后的保存位置和保留时间由浏览器及设备设置决定。"],
      ["转换后文件可能变大吗？", "可能。已经优化过的文件重新编码后可能变大，此时可保留原文件，或降低尺寸、画质后再试。"],
      ["结果可以直接用于官方申请吗？", "不同机构的尺寸、背景、大小和时效要求可能变化，请务必确认接收机构公布的最新条件。"],
    ],
    editorial: "内容由 SunData服务株式会社根据工具实际实现和设备测试编写、维护。最后更新：2026年9月28日。",
    more: "阅读详细指南",
  },
  en: {
    eyebrow: "PRACTICAL GUIDES",
    title: "What to know before converting a file",
    intro:
      "These notes explain what each conversion actually changes, so you can choose a format and setting that fits the job instead of simply chasing the smallest file.",
    articles: [
      {
        title: "Choosing JPG, PNG or WebP",
        body: "JPG is usually best for photographs, PNG for transparency and diagrams, and WebP for smaller web-ready images. Transparent areas become white when converted to JPG. Resizing to the dimensions you actually need often saves more space than aggressively lowering quality.",
        points: ["Photos: JPG", "Transparency and diagrams: PNG", "Web sharing: WebP"],
        href: "/en/guides/image-compression.html",
      },
      {
        title: "What PDF compression changes",
        body: "SunData compresses a PDF by rendering each page and rebuilding it as an image-based PDF. This works well for scans and photo-heavy documents, but searchable text, selection, forms and links may be lost. Keep the original when working with contracts or signed documents.",
        points: ["Best for scans and photos", "Searchable text may be lost", "Always keep the original"],
        href: "/en/guides/pdf-compression.html",
      },
      {
        title: "Limits of PDF-to-Office conversion",
        body: "A PDF stores the finished appearance of a page, not the original Word or Excel structure. Treat the converted file as a starting point and review tables, columns, fonts and page breaks. Complex forms and multi-column layouts usually need manual cleanup.",
        points: ["Review the layout", "Tables may need repair", "Files stay on your device"],
        href: "/en/guides/pdf-office-conversion.html",
      },
      {
        title: "What on-device processing means",
        body: "Images and PDFs are read into your browser's memory and the result is downloaded directly from the browser. The file itself is not sent to a SunData server. On a shared device, remember to review the download folder and browser history when you finish.",
        points: ["No file upload", "No account required", "Close the tab when finished"],
        href: "/en/about.html",
      },
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      ["Are there usage limits?", "The main image and PDF tools currently have no usage limit or paid download. Very large files may be limited by the memory available on your device."],
      ["Do you store converted files?", "No file is stored on a SunData server. After download, the location and retention of the file depend on your browser and device settings."],
      ["Can a converted file become larger?", "Yes. A file that is already optimized can grow after re-encoding. In that case, keep the original or reduce dimensions or quality before trying again."],
      ["Can I use the result for an official application?", "Requirements vary by authority and can change. Check the latest dimensions, background, file size and recency rules from the organization receiving the file."],
    ],
    editorial: "Written and maintained by SunData Service Co., Ltd. from the implemented behavior and hands-on testing of these tools. Last updated: September 28, 2026.",
    more: "Read the full guide",
  },
};

export default function KnowledgeHub({ lang }) {
  const L = content[lang] || content.en;
  return (
    <section className="knowledgeHub" id="guides">
      <div className="sectionHead">
        <span>{L.eyebrow}</span>
        <h2>{L.title}</h2>
        <p>{L.intro}</p>
      </div>
      <div className="knowledgeGrid">
        {L.articles.map((article) => (
          <article key={article.title}>
            <BookOpen />
            <h3>{article.title}</h3>
            <p>{article.body}</p>
            <ul>
              {article.points.map((point) => (
                <li key={point}><CheckCircle2 />{point}</li>
              ))}
            </ul>
            <a href={article.href}>{L.more}<ArrowRight /></a>
          </article>
        ))}
      </div>
      <div className="knowledgeFaq">
        <h3>{L.faqTitle}</h3>
        {L.faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <p className="editorialNote">{L.editorial}</p>
    </section>
  );
}
