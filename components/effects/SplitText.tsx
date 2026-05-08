"use client";
import {
  type CSSProperties,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { useReducedMotion } from "framer-motion";

// Restricted set of tags that accept ref + children + className + style + id.
type SplitTextTag = "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Character-level text splitter driven by a single CSS variable (`--st`,
// 0 to 1). Words are grouped into inline-block spans so the browser can
// only break BETWEEN words, never inside one. Inside each word, characters
// are individual spans that compute their own visibility from `--st` plus
// their index. See `.st-wrap` / `.st-word` / `.st-char` in app/globals.css.
//
// Two reveal modes:
//   "mount"      - wrapper sets --st = 1 once on first paint (after an
//                  optional mountDelayMs). The CSS transition on --st
//                  carries the reveal across staggerMs * total + durationMs.
//   "controlled" - parent writes --st externally on every scroll frame
//                  (e.g., CornerSection's compute()). No CSS transition;
//                  reveal tracks scroll directly.
//
// Reduced-motion: renders plain children, no per-char DOM, no animation.

type Props = {
  children: string;
  as?: SplitTextTag;
  staggerMs?: number;
  durationMs?: number;
  reveal?: "mount" | "controlled";
  mountDelayMs?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

type Token =
  | { kind: "word"; chars: { ch: string; i: number }[] }
  | { kind: "space" }
  | { kind: "br" };

export default function SplitText({
  children,
  as: As = "span",
  staggerMs = 25,
  durationMs = 380,
  reveal = "mount",
  mountDelayMs = 0,
  className = "",
  style,
  id,
}: Props) {
  const reduced = useReducedMotion();
  const uid = useId();
  const wrapperRef = useRef<HTMLElement>(null);

  const chars = useMemo(() => Array.from(children), [children]);

  // Group chars into render tokens so words don't break mid-character.
  // Each word -> inline-block group with its chars inside.
  // Spaces between words -> plain text node so the browser can break.
  // \n -> <br/>. The kinetic char index keeps incrementing across all
  // tokens (spaces and breaks count) so stagger rhythm is identical to
  // a flat per-char map.
  const tokens = useMemo<Token[]>(() => {
    const out: Token[] = [];
    let word: { ch: string; i: number }[] = [];
    chars.forEach((ch, i) => {
      if (ch === "\n") {
        if (word.length) {
          out.push({ kind: "word", chars: word });
          word = [];
        }
        out.push({ kind: "br" });
      } else if (ch === " ") {
        if (word.length) {
          out.push({ kind: "word", chars: word });
          word = [];
        }
        out.push({ kind: "space" });
      } else {
        word.push({ ch, i });
      }
    });
    if (word.length) out.push({ kind: "word", chars: word });
    return out;
  }, [chars]);

  // Mount reveal: flip --st from 0 to 1 once. The CSS transition (registered
  // via @property in globals.css) carries the rest. Controlled mode sets no
  // initial --st here - the parent owns that var.
  useEffect(() => {
    if (reduced) return;
    if (reveal !== "mount") return;
    const el = wrapperRef.current;
    if (!el) return;

    let cancelled = false;
    const trigger = () => {
      if (!cancelled) el.style.setProperty("--st", "1");
    };

    if (mountDelayMs > 0) {
      const t = window.setTimeout(trigger, mountDelayMs);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }
    const r = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(trigger),
    );
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(r);
    };
  }, [reduced, reveal, mountDelayMs]);

  if (reduced) {
    return (
      <As id={id} className={className} style={style}>
        {children}
      </As>
    );
  }

  const total = chars.length;
  const totalDurationMs = staggerMs * total + durationMs;

  return (
    <As
      ref={wrapperRef as React.Ref<never>}
      id={id}
      data-split-text
      data-reveal={reveal}
      className={`st-wrap ${className}`.trim()}
      style={
        {
          ...style,
          "--st": reveal === "mount" ? "0" : undefined,
          "--st-total": String(total),
          "--st-overlap": "6",
          "--st-transition": `${totalDurationMs}ms`,
        } as CSSProperties
      }
    >
      {tokens.map((tok, ti) => {
        if (tok.kind === "br") {
          return <br key={`${uid}-br-${ti}`} aria-hidden="true" />;
        }
        if (tok.kind === "space") {
          return " ";
        }
        return (
          <span key={`${uid}-w-${ti}`} className="st-word" aria-hidden="true">
            {tok.chars.map(({ ch, i }) => (
              <span
                key={`${uid}-${i}`}
                className="st-char"
                style={{ "--st-i": String(i) } as CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        );
      })}
      <span className="sr-only">{children}</span>
    </As>
  );
}
