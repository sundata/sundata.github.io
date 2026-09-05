import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Code2 as Github, Lightbulb, Mail, MessageSquareText, Send } from "lucide-react";

export default function Feedback({ lang }) {
  const [type, setType] = useState("request"); const [title, setTitle] = useState(""); const [detail, setDetail] = useState(""); const [copied, setCopied] = useState(false);
  const labels = { request: lang === "ja" ? "欲しいツール" : "Tool request", problem: lang === "ja" ? "使いにくい点" : "Usability issue", idea: lang === "ja" ? "その他の提案" : "Other idea" };
  const body = useMemo(() => `${labels[type]}\n\n${detail.trim()}\n\n---\nSubmitted from SunData Tools`, [detail, type, lang]);
  const ready = title.trim().length >= 3 && detail.trim().length >= 10;
  const githubUrl = `https://github.com/sundata/sundata.github.io/issues/new?title=${encodeURIComponent(`[${labels[type]}] ${title.trim()}`)}&body=${encodeURIComponent(body)}`;
  const mailUrl = `mailto:work.sundata@gmail.com?subject=${encodeURIComponent(`[SunData Tools] ${labels[type]}: ${title.trim()}`)}&body=${encodeURIComponent(body)}`;
  useEffect(() => {
    const prefill = (event) => {
      setType("problem");
      setTitle(lang === "ja" ? `${event.detail.tool}について` : `About ${event.detail.tool}`);
      setDetail("");
    };
    window.addEventListener("sundata:feedback", prefill);
    return () => window.removeEventListener("sundata:feedback", prefill);
  }, [lang]);
  return <section className="feedback" id="feedback"><div className="feedbackIntro"><span><MessageSquareText/> COMMUNITY FEEDBACK</span><h2>{lang === "ja" ? "次の便利ツールを、一緒につくる。" : "Help shape the next useful tool."}</h2><p>{lang === "ja" ? "欲しい機能、使いにくかった点、小さな違和感まで教えてください。GitHubでは公開で進捗を追えます。メールならアカウント不要です。" : "Tell us what you need, what felt awkward, or what should work better. Track public requests on GitHub, or email us without an account."}</p><div className="feedbackPromises"><span><CheckCircle2/> {lang === "ja" ? "投稿前は外部送信なし" : "Nothing sent before you submit"}</span><span><Lightbulb/> {lang === "ja" ? "短いアイデアでも歓迎" : "Small ideas are welcome"}</span></div></div><div className="feedbackForm"><fieldset><legend>{lang === "ja" ? "種類" : "Type"}</legend><div className="feedbackTypes">{Object.keys(labels).map(key=><button type="button" className={type===key?"active":""} onClick={()=>setType(key)} key={key}>{labels[key]}</button>)}</div></fieldset><label><span>{lang === "ja" ? "タイトル" : "Title"}</span><input maxLength="80" value={title} onChange={e=>setTitle(e.target.value)} placeholder={lang === "ja" ? "例：画像にモザイクをかけたい" : "e.g. Add an image blur tool"}/></label><label><span>{lang === "ja" ? "詳しく教えてください" : "Tell us more"}</span><textarea maxLength="1000" value={detail} onChange={e=>setDetail(e.target.value)} placeholder={lang === "ja" ? "何をしたいか、どこが不便だったかを書いてください。" : "What are you trying to do, and what was inconvenient?"}/><small>{detail.length} / 1000</small></label><div className="feedbackActions"><a className={!ready?"disabled":""} aria-disabled={!ready} href={ready?githubUrl:undefined} target="_blank" rel="noreferrer"><Github/>GitHub<Send/></a><a className={!ready?"disabled secondary":"secondary"} aria-disabled={!ready} href={ready?mailUrl:undefined}><Mail/>{lang === "ja" ? "メールで送る" : "Send email"}</a><button disabled={!ready} onClick={async()=>{await navigator.clipboard.writeText(`${title}\n\n${body}`);setCopied(true);window.setTimeout(()=>setCopied(false),1300);}}>{copied?(lang === "ja"?"コピー済み":"Copied"):(lang === "ja"?"内容をコピー":"Copy text")}</button></div>{!ready&&<p className="formHint">{lang === "ja" ? "タイトル3文字以上、詳細10文字以上で送信できます。" : "Enter at least 3 characters for the title and 10 for details."}</p>}</div></section>;
}
