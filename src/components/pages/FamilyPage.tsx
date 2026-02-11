// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
interface CalEvent { title:string; start:string; end:string; calendarName?:string; description?:string; }
interface FamilyEvent { id:string; title:string; date:string; category:string; person:string; notes:string; }
interface FamilyPageProps { theme:any; userId?:string; }
const CAT_LABELS: Record<string,string> = { birthday:"誕生日", anniversary:"記念日", school:"学校", other:"その他" };
const CAT_COLORS: Record<string,string> = { birthday:"#F472B6", anniversary:"#FBBF24", school:"#60A5FA", other:"#94A3B8" };
export function FamilyPage({ theme, userId }: FamilyPageProps) {
  const [calEvents, setCalEvents] = useState<CalEvent[]>([]);
  const [famEvents, setFamEvents] = useState<FamilyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:"", date:"", category:"birthday", person:"", notes:"" });
  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const [calRes, famRes] = await Promise.all([
        fetch("/api/lineworks?action=calendar").then(r=>r.json()).catch(()=>({events:[]})),
        (async () => {
          const { supabase } = await import("@/lib/supabase");
          const { data:{user} } = await supabase.auth.getUser();
          const uid = userId || user?.id;
          if (!uid) return { events:[] };
          return fetch(`/api/events?userId=${uid}`).then(r=>r.json()).catch(()=>({events:[]}));
        })()
      ]);
      if (calRes.events) setCalEvents(calRes.events);
      if (famRes.events) setFamEvents(famRes.events);
    } catch(e) { console.error(e); }
    setLoading(false);
  };
  const addEvent = async () => {
    if (!form.title || !form.date) return;
    const { supabase } = await import("@/lib/supabase");
    const { data:{user} } = await supabase.auth.getUser();
    const uid = userId || user?.id;
    const res = await fetch("/api/events", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({userId:uid,...form}) });
    const json = await res.json();
    if (json.event) { setFamEvents(prev => [...prev, json.event]); setForm({title:"",date:"",category:"birthday",person:"",notes:""}); setShowAdd(false); }
  };
  const deleteEvent = async (id:string) => {
    if (!confirm("削除しますか？")) return;
    await fetch("/api/events", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
    setFamEvents(prev => prev.filter(e => e.id !== id));
  };
  const accent = theme?.accent || "#4A9EFF";
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  // Upcoming calendar events
  const upcoming = calEvents.filter(e => {
    const d = e.start?.split("T")[0] || "";
    return d >= todayStr;
  }).slice(0, 10);
  // Sort family events by proximity to today
  const sortedFam = [...famEvents].sort((a,b) => {
    const da = new Date(a.date); const db = new Date(b.date);
    return da.getTime() - db.getTime();
  });
  return (
    <div style={{ padding:"70px 16px 100px" }}>
      {/* Calendar Events */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:5, fontFamily:"'Orbitron',sans-serif", color:accent, opacity:0.8 }}>SCHEDULE</div>
      </div>
      {loading ? (
        <div style={{ textAlign:"center", padding:40, opacity:0.3 }}>読み込み中...</div>
      ) : upcoming.length === 0 ? (
        <div style={{ padding:"16px 18px", borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", marginBottom:20 }}>
          <div style={{ fontSize:13, opacity:0.4 }}>今後の予定はありません</div>
        </div>
      ) : (
        <div style={{ marginBottom:24 }}>
          {upcoming.map((ev,i) => {
            const startDate = ev.start?.split("T")[0] || "";
            const startTime = ev.start?.split("T")[1]?.slice(0,5) || "";
            const endTime = ev.end?.split("T")[1]?.slice(0,5) || "";
            const d = new Date(startDate+"T00:00:00+09:00");
            const weekdays = ["日","月","火","水","木","金","土"];
            const isToday = startDate === todayStr;
            const tomorrow = new Date(now); tomorrow.setDate(now.getDate()+1);
            const isTomorrow = startDate === tomorrow.toISOString().split("T")[0];
            const label = isToday ? "今日" : isTomorrow ? "明日" : `${d.getMonth()+1}/${d.getDate()}(${weekdays[d.getDay()]})`;
            return (
              <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px", borderRadius:12, background: isToday ? `${accent}10` : "rgba(255,255,255,0.03)", border: isToday ? `1px solid ${accent}30` : "1px solid rgba(255,255,255,0.05)", marginBottom:6 }}>
                <div style={{ minWidth:50, fontSize:11, fontWeight:700, color: isToday ? accent : "rgba(255,255,255,0.5)" }}>{label}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{ev.title}</div>
                  <div style={{ fontSize:11, opacity:0.4 }}>{startTime}{endTime?`-${endTime}`:""}{ev.calendarName&&ev.calendarName!=="基本"?` [${ev.calendarName}]`:""}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Family Events */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:5, fontFamily:"'Orbitron',sans-serif", color:accent, opacity:0.8 }}>EVENTS</div>
        <button onClick={() => setShowAdd(true)} style={{ padding:"6px 14px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${accent},${theme?.accent2||"#7B61FF"})`, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>+ 追加</button>
      </div>
      {showAdd && (
        <div style={{ padding:16, borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:12 }}>
          <input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="イベント名" style={{ width:"100%", padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} style={{ flex:1, padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:13, outline:"none" }} />
            <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={{ padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:13, outline:"none" }}>
              <option value="birthday">誕生日</option>
              <option value="anniversary">記念日</option>
              <option value="school">学校</option>
              <option value="other">その他</option>
            </select>
          </div>
          <input value={form.person} onChange={e => setForm({...form,person:e.target.value})} placeholder="関連する人（任意）" style={{ width:"100%", padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={() => setShowAdd(false)} style={{ flex:0.4, padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer" }}>キャンセル</button>
            <button onClick={addEvent} disabled={!form.title||!form.date} style={{ flex:1, padding:10, borderRadius:8, border:"none", background:(form.title&&form.date)?`linear-gradient(135deg,${accent},${theme?.accent2||"#7B61FF"})`:"rgba(255,255,255,0.06)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>保存</button>
          </div>
        </div>
      )}
      {sortedFam.length === 0 && !showAdd ? (
        <div style={{ textAlign:"center", padding:"40px 20px", opacity:0.3 }}>
          <div style={{ fontSize:13 }}>イベントがありません</div>
          <div style={{ fontSize:11, marginTop:4 }}>誕生日や記念日を登録しましょう</div>
        </div>
      ) : (
        sortedFam.map(e => {
          const color = CAT_COLORS[e.category] || "#94A3B8";
          const d = new Date(e.date);
          return (
            <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", marginBottom:6 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${color}15`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color }}>{CAT_LABELS[e.category]?.[0]||"他"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{e.title}</div>
                <div style={{ fontSize:11, opacity:0.4 }}>{d.getMonth()+1}/{d.getDate()}{e.person?` - ${e.person}`:""}</div>
              </div>
              <button onClick={() => deleteEvent(e.id)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", fontSize:16, cursor:"pointer" }}>x</button>
            </div>
          );
        })
      )}
    </div>
  );
}
