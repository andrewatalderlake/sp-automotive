"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, isValidElement, Children } from "react";

// Word-by-word headline reveal on scroll-into-view. Splits the text into spans,
// each rising 24px and fading in with a stagger. Editorial-cinematic pacing.
//
// Usage:
//   <h2 className="display-md">
//     <RevealWords>You called the right shop.</RevealWords>
//   </h2>
//
// Honors prefers-reduced-motion (renders the text plain).

type Props = {
  children: string | ReactNode;
  /** Stagger between words in seconds. Default 0.06. */
  stagger?: number;
  /** Single-word duration. Default 0.7. */
  duration?: number;
  /** Trigger only once. Default true. */
  once?: boolean;
};

function flattenToString(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenToString).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return Children.toArray(node.props.children).map(flattenToString).join("");
  }
  return "";
}

export default function RevealWords({
  children,
  stagger = 0.06,
  duration = 0.7,
  once = true,
}: Props) {
  const reduced = useReducedMotion();
  const text = typeof children === "string" ? children : flattenToString(children);
  const words = text.split(" ");

  if (reduced) {
    return <>{text}</>;
  }

  return (
    <span style={{ display: "inline-block" }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform, opacity" }}
            initial={{ y: "1.05em", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once, margin: "-10% 0px -10% 0px" }}
            transition={{
              duration,
              delay: i * stagger,
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            {w}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
