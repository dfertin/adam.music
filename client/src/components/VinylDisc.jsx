export function VinylDisc({ size = 120, spinning = false, label = 'ADAM' }) {
  return (
    <div
      className="vinyl-disc"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `repeating-radial-gradient(circle at 50% 50%, #222 0 2px, #1a1a1a 2px 4px)`,
        boxShadow: 'inset 0 0 0 6px #111, 0 16px 40px rgba(0,0,0,0.22)',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        animation: spinning ? 'vinyl-spin 8s linear infinite' : 'none',
      }}
    >
      <div
        style={{
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: '50%',
          background: 'var(--adam-accent-soft)',
          border: '3px solid var(--adam-accent)',
          display: 'grid',
          placeItems: 'center',
          fontSize: Math.max(10, size * 0.09),
          fontWeight: 700,
          color: 'var(--adam-accent)',
          fontFamily: 'var(--font-display)',
        }}
      >
        {label}
      </div>
      <style>{`
        @keyframes vinyl-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
