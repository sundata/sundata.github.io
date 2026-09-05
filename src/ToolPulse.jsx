import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

const empty = { ok: 0, normal: 0, ng: 0, selected: "" };

export default function ToolPulse({ tool, lang }) {
  const key = `sundata-pulse:${tool}`;
  const [pulse, setPulse] = useState(empty);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved) setPulse({ ...empty, ...saved });
    } catch { /* local feedback is optional */ }
  }, [key]);

  const react = (kind) => {
    const next = { ...pulse };
    if (next.selected === kind) {
      next[kind] = Math.max(0, next[kind] - 1);
      next.selected = "";
    } else {
      if (next.selected) next[next.selected] = Math.max(0, next[next.selected] - 1);
      next[kind] += 1;
      next.selected = kind;
    }
    setPulse(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const comment = () => {
    window.dispatchEvent(new CustomEvent("sundata:feedback", { detail: { tool } }));
    document.querySelector("#feedback")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const options = [
    ["ok", "🌱", lang === "ja" ? "いいね" : "Nice"],
    ["normal", "🙂", lang === "ja" ? "ふつう" : "Okay"],
    ["ng", "🫠", lang === "ja" ? "困った" : "Annoying"],
  ];

  return <div className="toolPulse" aria-label={lang === "ja" ? `${tool}のフィードバック` : `Feedback for ${tool}`}><div className="pulseButtons">{options.map(([kind, emoji, label]) => <button type="button" key={kind} className={pulse.selected === kind ? `selected ${kind}` : kind} aria-pressed={pulse.selected === kind} onClick={() => react(kind)}><span aria-hidden="true">{emoji}</span><b>{label}</b><small>{pulse[kind]}</small></button>)}</div><button type="button" className="pulseComment" onClick={comment}><MessageCircle />{lang === "ja" ? "このツールにコメント" : "Comment on this tool"}</button><span className="pulseLocal">{lang === "ja" ? "この端末の記録" : "On this device"}</span></div>;
}
