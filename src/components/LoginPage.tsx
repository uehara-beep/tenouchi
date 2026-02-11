"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const loginEmail = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" },
    });
    if (error) { alert(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#182035,#1E2A4A,#182035)", fontFamily:"Rajdhani,sans-serif", color:"#F0F0F5", padding:24 }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:32, fontWeight:900, letterSpacing:12, fontFamily:"Orbitron,sans-serif", background:"linear-gradient(135deg,#93C5FD,#60A5FA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>TENOUCHI</div>
          <div style={{ fontSize:10, color:"rgba(240,240,245,0.35)", letterSpacing:6, marginTop:4 }}>AI SECRETARY</div>
        </div>
        {sent ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📩</div>
            <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>メールを送信しました</div>
            <div style={{ fontSize:14, color:"rgba(240,240,245,0.5)" }}>{email} を確認してください</div>
          </div>
        ) : (
          <div>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => { if(e.key==="Enter") loginEmail(); }} placeholder="email@example.com" type="email" autoFocus style={{ width:"100%", padding:"16px 20px", borderRadius:16, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"#F0F0F5", fontSize:16, outline:"none", boxSizing:"border-box" }} />
            <button onClick={loginEmail} disabled={loading||!email} style={{ width:"100%", padding:"16px 24px", borderRadius:16, marginTop:12, border:"none", cursor:"pointer", background:email?"linear-gradient(135deg,#93C5FD,#60A5FA)":"rgba(255,255,255,0.06)", color:email?"#fff":"rgba(240,240,245,0.35)", fontSize:15, fontWeight:600 }}>
              {loading ? "送信中..." : "ログインリンクを送信"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
