import React from "react";
import { ArrowRight, Check, CodeXml, Coffee, Mail, PackageCheck, ShieldCheck } from "lucide-react";

export default function SourceSupport({ lang }) {
  const plans = lang === "ja" ? [
    ["個人ライセンス", "¥980〜", ["学習・個人プロジェクト", "ソースコード一式", "セットアップガイド"]],
    ["商用ライセンス", "¥2,980〜", ["1つの商用プロジェクト", "ロゴ・文言の変更可", "更新版を割引提供"]],
    ["カスタマイズ", "見積り", ["機能追加・デザイン変更", "公開・申請サポート", "日本語・中国語対応"]],
  ] : [
    ["Personal license", "from ¥980", ["Learning and personal projects", "Complete source code", "Setup guide"]],
    ["Commercial license", "from ¥2,980", ["One commercial project", "Branding changes allowed", "Discounted updates"]],
    ["Customization", "Quote", ["Features and design changes", "Launch support", "Japanese and Chinese support"]],
  ];
  return <section className="sourceSupport" id="source-support"><div className="sourceLead"><span><CodeXml/> DEVELOPER SUPPORT</span><h2>{lang === "ja" ? "小さく買って、すぐ開発を始める。" : "Buy small. Start building fast."}</h2><p>{lang === "ja" ? "このサイトの便利ツールやアプリのソースコードを、手頃な価格で提供します。学習、個人制作、事業の試作に活用できます。" : "Affordable source code for selected tools and apps—ready for learning, personal work and business prototypes."}</p><div className="licenseNotice"><ShieldCheck/>{lang === "ja" ? "著作権はSunDataに帰属します。購入物そのものの再販売・再配布は禁止です。" : "Copyright remains with SunData. Reselling or redistributing the purchased source itself is not allowed."}</div></div><div className="licenseGrid">{plans.map(([name,price,items],index)=><article className={index===1?"recommended":""} key={name}>{index===1&&<em>{lang === "ja" ? "おすすめ" : "POPULAR"}</em>}<PackageCheck/><h3>{name}</h3><strong>{price}</strong><ul>{items.map(item=><li key={item}><Check/>{item}</li>)}</ul></article>)}</div><div className="sourceActions"><a href="https://ko-fi.com/sundata#" target="_blank" rel="noreferrer"><Coffee/>{lang === "ja" ? "販売・支援ページを見る" : "Visit shop & support"}<ArrowRight/></a><a className="sourceMail" href={`mailto:work.sundata@gmail.com?subject=${encodeURIComponent("SunData source code license inquiry")}`}><Mail/>{lang === "ja" ? "購入・カスタマイズを相談" : "Ask about a license"}</a></div><p className="sourceFootnote">{lang === "ja" ? "各商品ページには、動作環境・含まれるファイル・ライセンス・更新条件を明記します。決済後は非公開ダウンロードまたは限定GitHubリポジトリで納品します。" : "Each listing will clearly state requirements, included files, license and update terms. Delivery uses a private download or limited GitHub repository."}</p></section>;
}
