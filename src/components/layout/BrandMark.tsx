/** Care4RareDiseases mark: a woven strip of four flat bands (gold, white, red, ink). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="#ffffff" strokeOpacity="0.35" />
      <rect x="4" y="4" width="8" height="32" fill="#c9971c" />
      <rect x="12" y="4" width="8" height="32" fill="#ffffff" />
      <rect x="20" y="4" width="8" height="32" fill="#9b2c24" />
      <rect x="28" y="4" width="8" height="32" fill="#1a1916" />
      <rect x="4" y="17" width="32" height="6" fill="#13523b" />
    </svg>
  );
}
