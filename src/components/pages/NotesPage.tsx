// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
interface Note { id: string; content: string; tags: string; created_at: string; updated_at: string; }
interface NotesPageProps { theme: any; isSecret?: boolean; userId?: string; }
export function NotesPage({ theme, isSecret, userId }: NotesPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Note|null>(null);
  const [newNote, setNewNote] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  useEffect(() => { loadNotes(); }, []);
  const loadNotes = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { user } } = await supabase.auth.getUser();
      const uid = userId || user?.id;
      if (!uid) { setLoading(false); return; }
      const res = await fetch(`/api/notes?userId=${uid}`);
      const json = await res.json();
      if (json.notes) setNotes(json.notes);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  const addNote = async () => {
    if (!newNote.trim()) return;
    const { supabase } = await import("@/lib/supabase");
    const { data: { user } } = await supabase.auth.getUser();
    const uid = userId || user?.id;
    const res = await fetch("/api/notes", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({userId:uid,content:newNote}) });
    const json = await res.json();
    if (json.note) { setNotes(prev => [json.note, ...prev]); setNewNote(""); setShowAdd(false); }
  };
  const updateNote = async () => {
    if (!editing) return;
    await fetch("/api/notes", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:editing.id,content:editing.content}) });
    setNotes(prev => prev.map(n => n.id===editing.id?{...n,content:editing.content}:n));
    setEditing(null);
  };
  const deleteNote = async (id: string) => {
    if (!confirm("このメモを削除しますか？")) return;
    await fetch("/api/notes", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  const accent = theme?.accent || "#4A9EFF";
  return (
    <div style={{ padding:"70px 16px 100px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:5, fontFamily:"'Orbitron',sans-serif", color:accent, opacity:0.8 }}>NOTES</div>
        <button onClick={() => setShowAdd(true)} style={{ padding:"6px 14px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${accent},${theme?.accent2||"#7B61FF"})`, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>+ 追加</button>
      </div>
      <div style={{ fontSize:11, opacity:0.4, marginBottom:12 }}>{loading?"読み込み中...":`${notes.length}件のメモ`}</div>
      {showAdd && (
        <div style={{ padding:16, borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:12 }}>
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="メモを入力..." autoFocus style={{ width:"100%", minHeight:80, padding:12, borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical" }} />
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button onClick={() => {setShowAdd(false);setNewNote("");}} style={{ flex:0.4, padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer" }}>キャンセル</button>
            <button onClick={addNote} disabled={!newNote.trim()} style={{ flex:1, padding:10, borderRadius:8, border:"none", background:newNote.trim()?`linear-gradient(135deg,${accent},${theme?.accent2||"#7B61FF"})`:"rgba(255,255,255,0.06)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>保存</button>
          </div>
        </div>
      )}
      {!loading && notes.length===0 && !showAdd ? (
        <div style={{ textAlign:"center", padding:"60px 20px", opacity:0.3 }}>
          <div style={{ fontSize:13 }}>メモがありません</div>
          <div style={{ fontSize:11, marginTop:4 }}>秘書に「メモ：〇〇」と伝えるか、+ボタンで追加</div>
        </div>
      ) : (
        notes.map(n => {
          const d = new Date(n.created_at);
          const dateStr = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
          if (editing?.id===n.id) {
            return (
              <div key={n.id} style={{ padding:14, borderRadius:14, background:"rgba(255,255,255,0.06)", border:`1px solid ${accent}40`, marginBottom:8 }}>
                <textarea value={editing.content} onChange={e => setEditing({...editing,content:e.target.value})} autoFocus style={{ width:"100%", minHeight:60, padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#F0F0F5", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical" }} />
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <button onClick={() => setEditing(null)} style={{ flex:0.4, padding:8, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:11, cursor:"pointer" }}>キャンセル</button>
                  <button onClick={updateNote} style={{ flex:1, padding:8, borderRadius:8, border:"none", background:`linear-gradient(135deg,${accent},${theme?.accent2||"#7B61FF"})`, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>更新</button>
                </div>
              </div>
            );
          }
          return (
            <div key={n.id} style={{ padding:"14px 16px", borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", marginBottom:8 }}>
              <div style={{ fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap", marginBottom:8 }}>{n.content}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:10, opacity:0.3 }}>{dateStr}</span>
                <div style={{ display:"flex", gap:12 }}>
                  <button onClick={() => setEditing(n)} style={{ background:"none", border:"none", color:accent, fontSize:11, cursor:"pointer" }}>編集</button>
                  <button onClick={() => deleteNote(n.id)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.25)", fontSize:11, cursor:"pointer" }}>削除</button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
