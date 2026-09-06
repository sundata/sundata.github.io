import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  doc,
  getDoc,
  increment,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db, ensureAnonymousUser } from "./firebase";

const empty = { ok: 0, normal: 0, ng: 0 };

function encodeToolId(tool) {
  return encodeURIComponent(tool).replaceAll("%", "_").slice(0, 120);
}

export default function ToolPulse({ tool, toolId, lang }) {
  const [pulse, setPulse] = useState(empty);
  const [selected, setSelected] = useState("");
  const [pending, setPending] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const id = toolId || encodeToolId(tool);
    const totalsRef = doc(db, "toolVotes", id);
    let stopTotals = () => {};
    let cancelled = false;

    ensureAnonymousUser()
      .then(async (user) => {
        if (cancelled) return;
        stopTotals = onSnapshot(
          totalsRef,
          (snapshot) => {
            setPulse({ ...empty, ...(snapshot.data() || {}) });
            setOnline(true);
          },
          () => setOnline(false),
        );

        const voterRef = doc(db, "toolVotes", id, "voters", user.uid);
        const voter = await getDoc(voterRef);
        if (!cancelled && voter.exists()) setSelected(voter.data().kind || "");
      })
      .catch(() => setOnline(false));

    return () => {
      cancelled = true;
      stopTotals();
    };
  }, [tool, toolId]);

  const react = async (kind) => {
    if (pending || selected) return;
    setPending(true);
    try {
      const user = await ensureAnonymousUser();
      const id = toolId || encodeToolId(tool);
      const totalsRef = doc(db, "toolVotes", id);
      const voterRef = doc(db, "toolVotes", id, "voters", user.uid);

      const savedKind = await runTransaction(db, async (transaction) => {
        const voter = await transaction.get(voterRef);
        if (voter.exists()) return voter.data().kind || "";
        transaction.set(voterRef, { kind });
        transaction.set(totalsRef, { [kind]: increment(1) }, { merge: true });
        return kind;
      });
      setSelected(savedKind);
      setOnline(true);
    } catch {
      setOnline(false);
    } finally {
      setPending(false);
    }
  };

  const comment = () => {
    window.dispatchEvent(
      new CustomEvent("sundata:feedback", { detail: { tool } }),
    );
    document
      .querySelector("#feedback")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const options = [
    ["ok", "🌱", lang === "ja" ? "いいね" : "Nice"],
    ["normal", "🙂", lang === "ja" ? "ふつう" : "Okay"],
    ["ng", "🫠", lang === "ja" ? "困った" : "Annoying"],
  ];

  return (
    <div
      className="toolPulse"
      aria-label={
        lang === "ja" ? `${tool}のフィードバック` : `Feedback for ${tool}`
      }
    >
      <div className="pulseButtons">
        {options.map(([kind, emoji, label]) => (
          <button
            type="button"
            key={kind}
            disabled={pending || Boolean(selected)}
            className={selected === kind ? `selected ${kind}` : kind}
            aria-pressed={selected === kind}
            onClick={() => react(kind)}
          >
            <span aria-hidden="true">{emoji}</span>
            <b>{label}</b>
            <small>{online ? pulse[kind] : "–"}</small>
          </button>
        ))}
      </div>
      <button type="button" className="pulseComment" onClick={comment}>
        <MessageCircle />
        {lang === "ja" ? "このツールにコメント" : "Comment on this tool"}
      </button>
      <span className="pulseLocal">
        {online
          ? lang === "ja"
            ? "みんなの集計"
            : "All visitors"
          : lang === "ja"
            ? "集計に接続できません"
            : "Count unavailable"}
      </span>
    </div>
  );
}
