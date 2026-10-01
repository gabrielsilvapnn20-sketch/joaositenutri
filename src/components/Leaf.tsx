/** Folha desenhada à mão em SVG — detalhe orgânico de fundo. */
export default function Leaf({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden fill="none">
      <path d="M8 56C10 30 28 10 56 8c-2 26-20 46-48 48z" fill="currentColor" opacity=".9" />
      <path d="M10 54C22 40 34 28 50 14" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
