"use client";

import { ScrapCard } from "@/components/cards";
import { Icons } from "@/components/ui/Icons";
import { Theme, COLORS } from "@/lib/themes";
import { NOTES_DATA } from "@/lib/data";

interface NotesPageProps {
  theme: Theme;
}

export function NotesPage({ theme }: NotesPageProps) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: COLORS.text3,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: 4,
          marginBottom: 8,
        }}
      >
        MEMO
      </div>
      <div
        style={{
          fontSize: 14,
          color: `${theme.accent}70`,
          marginBottom: 20,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
        }}
      >
        — 思いついたこと、忘れたくないこと —
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {NOTES_DATA.map((note, i) => (
          <ScrapCard
            key={i}
            delay={i * 80}
            rotate={note.rot}
            tape={note.tape}
            sticker={note.sticker}
            style={{ borderTop: `3px solid ${note.color}40` }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 8,
              }}
            >
              {note.pin && Icons.pin(note.color, 12)}
              <span
                style={{ fontSize: 12, fontWeight: 700, color: COLORS.text1 }}
              >
                {note.t}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.text2,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              {note.c}
            </div>
          </ScrapCard>
        ))}
      </div>
    </div>
  );
}
