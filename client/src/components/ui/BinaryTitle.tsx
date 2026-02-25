import { useEffect, useMemo, useState } from "react";

type Props = {
  text: string;
  className?: string;
};

/**
 * Animates text from a binary "scramble" into the final string.
 * Lightweight and reusable across section titles to keep brand motion consistent.
 */
export function BinaryTitle({ text, className = "" }: Props) {
  const [display, setDisplay] = useState(text);

  const chars = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    let frame = 0;
    const maxFrames = chars.length * 6 + 20;
    const interval = window.setInterval(() => {
      frame += 1;
      setDisplay(
        chars
          .map((char, idx) => {
            if (char === " ") return " ";
            const progress = frame - idx * 3;
            if (progress >= 8) return char;
            if (progress >= 0) return Math.random() > 0.5 ? "1" : "0";
            return " ";
          })
          .join(""),
      );

      if (frame > maxFrames) {
        setDisplay(text);
        window.clearInterval(interval);
      }
    }, 32);

    return () => window.clearInterval(interval);
  }, [chars, text]);

  return (
    <span className={`binary-title ${className}`.trim()} aria-label={text}>
      {display}
    </span>
  );
}
