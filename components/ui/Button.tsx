import { MouseEvent, ReactNode } from "react";

type Props = {
  variant?: "primary" | "ghost";
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-md font-body text-sm uppercase tracking-[0.18em] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
const styles = {
  primary: "border border-bone text-bone hover:bg-bone hover:text-ink",
  ghost: "text-bone hover:underline underline-offset-4",
};

export default function Button({
  variant = "primary",
  href,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  ariaLabel,
  children,
}: Props) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) return <a href={href} onClick={onClick} aria-label={ariaLabel} className={cls}>{children}</a>;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cls}
    >
      {children}
    </button>
  );
}
