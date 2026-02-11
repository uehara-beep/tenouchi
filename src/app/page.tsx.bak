// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LoginPage from "@/components/LoginPage";
import dynamic from "next/dynamic";

const TenouchiApp = dynamic(() => import("@/components/TenouchiApp"), { ssr: false });

// ========================
// Personality Questions (Big Five / OCEAN)
// ========================
const TRAIT_INTROS: Record<string, { label: string; intro: string }> = {
  openness: {
    label: "好奇心・創造性",
    intro: "まず、新しいことや変化に対するあなたの気持ちについてお聞きします。正解はありません。素直に感じたままお答えください。",
  },
  conscientiousness: {
    label: "計画性・責任感",
    intro: "次に、物事への取り組み方についてお聞きします。日常の行動パターンを思い浮かべてみてください。",
  },
  extraversion: {
    label: "社交性・活力",
    intro: "人との関わり方について伺います。普段の自分を振り返って、自然体でお答えください。",
  },
  agreeableness: {
    label: "協調性・共感力",
    intro: "人間関係の中でのあなたの振る舞いについてお聞きします。",
  },
  stability: {
    label: "感情の安定性",
    intro: "最後に、ストレスや感情との向き合い方についてお聞きします。ありのままで大丈夫です。",
  },
};

const PERSONALITY_QUESTIONS = [
  {
    trait: "openness",
    question: "新しい環境や未知の体験に対して、\nどのように感じることが多いですか？",
    labels: ["不安を感じる", "やや慎重", "どちらとも", "やや楽しみ", "ワクワクする"],
  },
  {
    trait: "openness",
    question: "仕事や生活で、従来のやり方と新しいアプローチ、\nどちらに心が向きますか？",
    labels: ["実績ある方法", "やや従来派", "どちらとも", "やや新しい派", "新しい方法"],
  },
  {
    trait: "conscientiousness",
    question: "大切な予定や締め切りに対して、\n普段どのように向き合っていますか？",
    labels: ["柔軟に対応", "やや柔軟", "どちらとも", "やや計画的", "計画的に準備"],
  },
  {
    trait: "conscientiousness",
    question: "身の回りの整理整頓について、\nご自身はいかがですか？",
    labels: ["気にしない", "やや自由", "どちらとも", "やや整頓派", "常に整理したい"],
  },
  {
    trait: "extraversion",
    question: "人が大勢集まる場にいるとき、\nどのように感じますか？",
    labels: ["疲れやすい", "やや疲れる", "どちらとも", "やや元気", "元気をもらえる"],
  },
  {
    trait: "extraversion",
    question: "休日の理想の過ごし方は、\nどちらに近いですか？",
    labels: ["一人の時間", "やや一人派", "どちらとも", "やや人と派", "人と過ごしたい"],
  },
  {
    trait: "agreeableness",
    question: "チームで意見が分かれたとき、\nあなたはどう振る舞うことが多いですか？",
    labels: ["意見を貫く", "やや主張派", "どちらとも", "やや調和派", "調和を優先"],
  },
  {
    trait: "agreeableness",
    question: "困っている人を見かけたとき、\n最初に何を考えますか？",
    labels: ["冷静に分析", "やや観察派", "どちらとも", "やや助けたい", "すぐ助けたい"],
  },
  {
    trait: "stability",
    question: "予想外のトラブルが起きたとき、\n気持ちの切り替えはいかがですか？",
    labels: ["引きずりやすい", "やや引きずる", "どちらとも", "やや早い", "すぐ切り替え"],
  },
  {
    trait: "stability",
    question: "将来のことを考えるとき、\nどのような気持ちになることが多いですか？",
    labels: ["不安を感じる", "やや不安", "どちらとも", "やや前向き", "前向きに捉える"],
  },
];

// ========================
// Trait descriptions for results
// ========================
function getTraitDescription(trait: string, score: number): string {
  const descs: Record<string, [string, string, string]> = {
    openness: [
      "安定した環境を好み、確実な方法を大切にします",
      "バランスよく新旧を取り入れることができます",
      "好奇心旺盛で、新しい挑戦を楽しめるタイプです",
    ],
    conscientiousness: [
      "柔軟性が高く、臨機応変に対応できます",
      "計画性と柔軟性のバランスが取れています",
      "責任感が強く、計画的に物事を進めます",
    ],
    extraversion: [
      "内省的で、深い思考を好むタイプです",
      "状況に応じて社交的にも内省的にもなれます",
      "エネルギッシュで、人との交流から活力を得ます",
    ],
    agreeableness: [
      "合理的な判断力があり、自分の信念を持っています",
      "主張と協調のバランスが取れています",
      "共感力が高く、周囲との調和を大切にします",
    ],
    stability: [
      "感受性が豊かで、物事を深く感じ取ります",
      "適度な感情コントロールができます",
      "精神的にタフで、困難にも冷静に対処できます",
    ],
  };
  const d = descs[trait] || ["", "", ""];
  if (score <= 2.3) return d[0];
  if (score <= 3.7) return d[1];
  return d[2];
}

function generateSummary(scores: Record<string, number>): string {
  const highest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const summaries: Record<string, string> = {
    openness: "創造力と好奇心が特徴的で、新しいアイデアを生み出す力を持っています。",
    conscientiousness: "高い計画性と責任感が特徴的で、信頼される存在です。",
    extraversion: "社交性と行動力が特徴的で、周囲を巻き込む力を持っています。",
    agreeableness: "共感力と協調性が特徴的で、チームの潤滑油となれる存在です。",
    stability: "精神的な安定感が特徴的で、困難な状況でも冷静さを保てます。",
  };
  return summaries[highest[0]] || "";
}

// ========================
// Main Component
// ========================
export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#0D0F1A,#0A0C15)", color: "#F0F0F5", fontFamily: "'Orbitron',sans-serif" }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 10, opacity: 0.5, animation: "pulse 1.5s infinite" }}>TENOUCHI</div>
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={() => {}} />;

  // Onboarding for new users
  if (profile && !profile.onboarding_done) {
    return <OnboardingPage userId={user.id} onComplete={(p: any) => setProfile(p)} />;
  }

  return <TenouchiApp userId={user.id} profile={profile} />;
}

// ========================
// Onboarding with Personality Diagnosis + PIN Setup
// ========================
function OnboardingPage({ userId, onComplete }: { userId: string; onComplete: (p: any) => void }) {
  // Basic info
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Personality answers: 10 questions, each 1-5
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0));

  // PIN
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinError, setPinError] = useState("");

  // Navigation
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Steps: 0=name, 1=company+role, 2-6=personality(5 traits), 7=results, 8=pin
  const TOTAL_STEPS = 9;

  const goNext = () => {
    setFadeIn(false);
    setTimeout(() => { setStep(s => s + 1); setFadeIn(true); }, 200);
  };
  const goBack = () => {
    setFadeIn(false);
    setTimeout(() => { setStep(s => s - 1); setFadeIn(true); }, 200);
  };

  // Calculate personality scores
  const calcScores = () => {
    const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"];
    const scores: Record<string, number> = {};
    traits.forEach((t, i) => {
      const q1 = answers[i * 2] || 3;
      const q2 = answers[i * 2 + 1] || 3;
      scores[t] = (q1 + q2) / 2;
    });
    return scores;
  };

  // Save everything
  const finish = async () => {
    if (pin !== pinConfirm) {
      setPinError("PINが一致しません");
      return;
    }
    if (pin.length !== 4) {
      setPinError("4桁で入力してください");
      return;
    }

    setSaving(true);
    const scores = calcScores();
    const personality = { ...scores, summary: generateSummary(scores) };

    const { data } = await supabase
      .from("profiles")
      .update({
        name,
        company,
        role,
        personality,
        secret_pin: pin,
        onboarding_done: true,
      })
      .eq("user_id", userId)
      .select()
      .single();

    onComplete(data);
  };

  // Skip PIN
  const skipPin = async () => {
    setSaving(true);
    const scores = calcScores();
    const personality = { ...scores, summary: generateSummary(scores) };

    const { data } = await supabase
      .from("profiles")
      .update({
        name,
        company,
        role,
        personality,
        onboarding_done: true,
      })
      .eq("user_id", userId)
      .select()
      .single();

    onComplete(data);
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step >= 2 && step <= 6) {
      const traitIdx = step - 2;
      return answers[traitIdx * 2] > 0 && answers[traitIdx * 2 + 1] > 0;
    }
    return true;
  };

  // Personality question setter
  const setAnswer = (qIdx: number, val: number) => {
    setAnswers(prev => { const n = [...prev]; n[qIdx] = val; return n; });
  };

  const scores = calcScores();
  const traitOrder = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"];

  // ========================
  // Render Steps
  // ========================
  const renderStep = () => {
    // Step 0: Name
    if (step === 0) return (
      <div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>はじめまして</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>あなたのお名前を<br />教えてください</h2>
        <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 28 }}>秘書があなたをこの名前でお呼びします</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="名前"
          autoFocus
          style={inputStyle} />
      </div>
    );

    // Step 1: Company + Role
    if (step === 1) return (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>お仕事について</h2>
        <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 24 }}>秘書の対応を最適化するために使います（任意）</p>
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder="会社名（任意）"
          style={{ ...inputStyle, marginBottom: 16 }} />
        <input value={role} onChange={e => setRole(e.target.value)} placeholder="役職（任意）"
          style={inputStyle} />
      </div>
    );

    // Steps 2-6: Personality questions (2 per trait)
    if (step >= 2 && step <= 6) {
      const traitIdx = step - 2;
      const trait = traitOrder[traitIdx];
      const info = TRAIT_INTROS[trait];
      const q1 = PERSONALITY_QUESTIONS[traitIdx * 2];
      const q2 = PERSONALITY_QUESTIONS[traitIdx * 2 + 1];

      return (
        <div>
          <div style={{ fontSize: 11, color: "#7B61FF", fontWeight: 700, marginBottom: 6, letterSpacing: 2 }}>
            {info.label}
          </div>
          <p style={{ fontSize: 12, opacity: 0.5, marginBottom: 28, lineHeight: 1.6 }}>
            {info.intro}
          </p>

          {/* Question 1 */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {q1.question}
            </p>
            <ScaleInput
              value={answers[traitIdx * 2]}
              onChange={(v: number) => setAnswer(traitIdx * 2, v)}
              labels={q1.labels}
            />
          </div>

          {/* Question 2 */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {q2.question}
            </p>
            <ScaleInput
              value={answers[traitIdx * 2 + 1]}
              onChange={(v: number) => setAnswer(traitIdx * 2 + 1, v)}
              labels={q2.labels}
            />
          </div>
        </div>
      );
    }

    // Step 7: Results
    if (step === 7) return (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>あなたの性格プロフィール</h2>
        <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 24 }}>この結果をもとに、秘書の対応スタイルを最適化します</p>

        <div style={{ padding: 16, borderRadius: 16, background: "rgba(123,97,255,0.06)", border: "1px solid rgba(123,97,255,0.15)", marginBottom: 24 }}>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
            {generateSummary(scores)}
          </p>
        </div>

        {traitOrder.map(trait => {
          const score = scores[trait] || 3;
          const info = TRAIT_INTROS[trait];
          const pct = ((score - 1) / 4) * 100;
          return (
            <div key={trait} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{info.label}</span>
                <span style={{ fontSize: 11, color: "#7B61FF" }}>{score.toFixed(1)}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: 6, borderRadius: 3, background: "linear-gradient(90deg,#4A9EFF,#7B61FF)", width: `${pct}%`, transition: "width 0.6s ease" }} />
              </div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 4 }}>
                {getTraitDescription(trait, score)}
              </div>
            </div>
          );
        })}
      </div>
    );

    // Step 8: PIN Setup
    if (step === 8) return (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>シークレットモードの設定</h2>
        <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 6 }}>ロゴ長押しで切り替わるプライベート空間の暗証番号です</p>
        <p style={{ fontSize: 11, opacity: 0.3, marginBottom: 28 }}>後からいつでも変更できます</p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: "#7B61FF", fontWeight: 700, marginBottom: 8, display: "block", letterSpacing: 1 }}>
            4桁の暗証番号
          </label>
          <input
            value={pin}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setPin(v); setPinError(""); }}
            placeholder="● ● ● ●"
            type="tel"
            inputMode="numeric"
            maxLength={4}
            style={{ ...inputStyle, textAlign: "center", fontSize: 24, letterSpacing: 16, fontFamily: "'Orbitron',sans-serif" }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: "#7B61FF", fontWeight: 700, marginBottom: 8, display: "block", letterSpacing: 1 }}>
            確認のためもう一度
          </label>
          <input
            value={pinConfirm}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setPinConfirm(v); setPinError(""); }}
            placeholder="● ● ● ●"
            type="tel"
            inputMode="numeric"
            maxLength={4}
            style={{ ...inputStyle, textAlign: "center", fontSize: 24, letterSpacing: 16, fontFamily: "'Orbitron',sans-serif" }}
          />
        </div>

        {pinError && (
          <div style={{ fontSize: 12, color: "#FF3B3B", marginTop: 8, textAlign: "center" }}>{pinError}</div>
        )}
      </div>
    );

    return null;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0D0F1A,#0A0C15)", color: "#F0F0F5", fontFamily: "'Rajdhani',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "32px 24px", boxSizing: "border-box" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 8, fontFamily: "'Orbitron',sans-serif", background: "linear-gradient(135deg,#4A9EFF,#7B61FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            TENOUCHI
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 4, letterSpacing: 3 }}>
            {step <= 1 ? "セットアップ" : step <= 6 ? "パーソナリティ診断" : step === 7 ? "診断結果" : "セキュリティ設定"}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1, marginBottom: 28 }}>
          <div style={{ height: 2, background: "linear-gradient(90deg,#4A9EFF,#7B61FF)", borderRadius: 1, width: `${((step + 1) / TOTAL_STEPS) * 100}%`, transition: "width 0.4s ease" }} />
        </div>

        {/* Step content */}
        <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.2s ease", minHeight: 320 }}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {step > 0 && (
            <button onClick={goBack} style={btnSecondaryStyle}>戻る</button>
          )}
          {step < 8 ? (
            <button
              onClick={goNext}
              disabled={!canNext()}
              style={{
                ...btnPrimaryStyle,
                opacity: canNext() ? 1 : 0.3,
                background: canNext() ? "linear-gradient(135deg,#4A9EFF,#7B61FF)" : "rgba(255,255,255,0.06)",
              }}
            >
              {step === 7 ? "次へ" : "次へ"}
            </button>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={finish}
                disabled={saving}
                style={{ ...btnPrimaryStyle, background: "linear-gradient(135deg,#4A9EFF,#7B61FF)" }}
              >
                {saving ? "設定中..." : "始める 🚀"}
              </button>
              <button onClick={skipPin} disabled={saving}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", padding: 8 }}>
                PINをスキップ
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

// ========================
// Scale Input Component (1-5 selector)
// ========================
function ScaleInput({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels: string[] }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 10,
              border: value === v ? "2px solid #7B61FF" : "1px solid rgba(255,255,255,0.08)",
              background: value === v ? "rgba(123,97,255,0.15)" : "rgba(255,255,255,0.03)",
              color: value === v ? "#B8A9FF" : "rgba(255,255,255,0.4)",
              fontSize: 16,
              fontWeight: value === v ? 700 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "'Rajdhani',sans-serif",
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, opacity: 0.35 }}>{labels[0]}</span>
        <span style={{ fontSize: 10, opacity: 0.35 }}>{labels[4]}</span>
      </div>
    </div>
  );
}

// ========================
// Shared Styles
// ========================
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#F0F0F5",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Rajdhani',sans-serif",
};

const btnPrimaryStyle: React.CSSProperties = {
  flex: 1,
  padding: "14px",
  borderRadius: 12,
  border: "none",
  color: "#fff",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'Rajdhani',sans-serif",
  letterSpacing: 1,
};

const btnSecondaryStyle: React.CSSProperties = {
  flex: 0.4,
  padding: "14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "transparent",
  color: "rgba(255,255,255,0.5)",
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "'Rajdhani',sans-serif",
};
