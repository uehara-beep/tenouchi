// @ts-nocheck
"use client";
import { useState } from "react";
interface DiscoverPageProps { theme: any; }
export function DiscoverPage({ theme }: DiscoverPageProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{q:string,a:string}[]>([]);
  const search = async () => {
    if (!query.trim() || loading) return;
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/search", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({query}) });
      const json = await res.json();
      if (json.result) { setResult(json.result); setHistory(prev => [{q:query,a:json.result},...prev].slice(0,10)); }
      else setResult("検索結果が見つかりませんでした");
    } catch { setResult("検索エラーが発生しました"); }
    setLoading(false);
  };
  const accent = theme?.accent || "#4A9EFF";
  return (
    <div style={{ padding:"70px 16px 100px" }}>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:5, fontFamily:"'Orbitron',sans-serif", color:accent, opacity:0.8, marginBottom:16 }}>SEARCH</div>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && search()} placeholder="検索..." style={{ flex:1, padding:"12px 16px", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:14, outline:"none" }} />
        <button onClick={search} disabled={loading} style={{ padding:"12px 20px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${accent},${theme?.accent2||"#7B61FF"})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity:loading?0.5:1 }}>
          {loading?"...":"検索"}
        </button>
      </div>
      {result && (
        <div style={{ padding:"16px 18px", borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", marginBottom:16 }}>
          <div style={{ fontSize:10, opacity:0.4, letterSpacing:3, fontFamily:"'Orbitron',sans-serif", marginBottom:8 }}>RESULT</div>
          <div style={{ fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{result}</div>
        </div>
      )}
      {history.length > 0 && !result && (
        <>
          <div style={{ fontSize:10, opacity:0.4, letterSpacing:3, fontFamily:"'Orbitron',sans-serif", marginBottom:12 }}>HISTORY</div>
          {history.map((h,i) => (
            <div key={i} onClick={() => {setQuery(h.q);setResult(h.a);}} style={{ padding:"12px 16px", borderRadius:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", marginBottom:6, cursor:"pointer" }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{h.q}</div>
              <div style={{ fontSize:11, opacity:0.4, marginTop:4 }}>{h.a.slice(0,60)}...</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
