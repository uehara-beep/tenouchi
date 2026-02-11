"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
      }
    });
  }, [router]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#182035,#1E2A4A)", color:"#F0F0F5", fontFamily:"Orbitron,sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:14, letterSpacing:4, marginBottom:16, opacity:0.6 }}>AUTHENTICATING...</div>
        <div style={{ width:40, height:40, border:"2px solid rgba(147,197,253,0.2)", borderTop:"2px solid #93C5FD", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
