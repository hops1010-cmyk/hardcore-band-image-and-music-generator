import React, { useRef } from 'react';
import { Download, Sparkles } from 'lucide-react';

interface BandLogoProps {
  name: string;
  style: 'grindcore_branches' | 'djent_cyber_geom' | 'hardcore_stencil' | 'deathcore_dripping' | string;
  subtitle?: string;
  className?: string;
  showDownload?: boolean;
}

export const BandLogo: React.FC<BandLogoProps> = ({
  name,
  style,
  subtitle,
  className = '',
  showDownload = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate deterministic branch spikes based on string length & chars
  const generateSpikes = (seedStr: string) => {
    const spikes: { d: string; strokeWidth: number; opacity: number }[] = [];
    const seed = seedStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const r1 = 120 + ((seed * (i + 1) * 17) % 70);
      const r2 = 190 + ((seed * (i + 3) * 23) % 110);
      const cx = 350;
      const cy = 100;

      const x1 = cx + Math.cos(angle) * r1 * 1.8;
      const y1 = cy + Math.sin(angle) * r1 * 0.45;
      const x2 = cx + Math.cos(angle) * r2 * 2.2;
      const y2 = cy + Math.sin(angle) * r2 * 0.55;

      const ctrlX = cx + Math.cos(angle + 0.2) * (r1 + 40);
      const ctrlY = cy + Math.sin(angle - 0.2) * (r1 + 20) * 0.5;

      spikes.push({
        d: `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`,
        strokeWidth: 1.5 + (i % 3),
        opacity: 0.6 + (i % 4) * 0.1
      });
    }
    return spikes;
  };

  const spikes = generateSpikes(name);

  const handleDownload = () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement('a');
        a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-band-logo.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const isGrindcore = style === 'grindcore_branches';
  const isDjent = style === 'djent_cyber_geom';
  const isHardcore = style === 'hardcore_stencil';
  const isDeathcore = style === 'deathcore_dripping';

  return (
    <div className={`relative group inline-block ${className}`} ref={containerRef}>
      <svg
        viewBox="0 0 700 200"
        className="w-full h-auto max-h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber djent glow */}
          <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Heavy blood/sludge drip */}
          <linearGradient id="bloodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Cyber gradient */}
          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Stencil spray texture */}
          <linearGradient id="hardcoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>

        {/* GRINDCORE BRANCHES / ROOTS ILLegIBLE EMBELLISHMENT */}
        {isGrindcore && (
          <g className="text-zinc-200 stroke-current">
            {spikes.map((spike, idx) => (
              <path
                key={idx}
                d={spike.d}
                fill="none"
                strokeWidth={spike.strokeWidth}
                strokeOpacity={spike.opacity}
                strokeLinecap="round"
              />
            ))}
            {/* Thorny root crossbars */}
            <path d="M 120 100 Q 350 40 580 100" fill="none" strokeWidth="3" stroke="#f43f5e" strokeOpacity="0.8" />
            <path d="M 100 110 Q 350 160 600 90" fill="none" strokeWidth="2.5" stroke="#f43f5e" strokeOpacity="0.7" />
          </g>
        )}

        {/* DJENT CYBER GEOMETRIC FRAMES */}
        {isDjent && (
          <g className="stroke-cyan-500/60" fill="none" strokeWidth="1.5">
            <polygon points="40,20 660,20 620,180 80,180" stroke="#06b6d4" strokeOpacity="0.3" />
            <line x1="50" y1="100" x2="150" y2="100" stroke="#38bdf8" strokeWidth="2" />
            <line x1="550" y1="100" x2="650" y2="100" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="150" cy="100" r="3" fill="#38bdf8" />
            <circle cx="550" cy="100" r="3" fill="#38bdf8" />
            <line x1="350" y1="10" x2="350" y2="35" stroke="#06b6d4" />
            <line x1="350" y1="165" x2="350" y2="190" stroke="#06b6d4" />
          </g>
        )}

        {/* HARDCORE STREET SPRAY CROSSHAIRS */}
        {isHardcore && (
          <g className="stroke-red-600/40" fill="none" strokeWidth="2">
            <rect x="70" y="30" width="560" height="140" stroke="#ef4444" strokeDasharray="16, 8" />
            <line x1="50" y1="100" x2="650" y2="100" stroke="#ef4444" strokeOpacity="0.3" />
            <circle cx="350" cy="100" r="85" stroke="#dc2626" strokeOpacity="0.25" strokeWidth="4" />
          </g>
        )}

        {/* MAIN BAND NAME TYPOGRAPHY */}
        <text
          x="350"
          y="115"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: isGrindcore
              ? "'UnifrakturMaguntia', 'Cinzel Decorative', cursive"
              : isDjent
              ? "'Syne', sans-serif"
              : isHardcore
              ? "'JetBrains Mono', monospace"
              : "'Cinzel Decorative', serif",
            fontWeight: 900,
            letterSpacing: isDjent ? '0.22em' : isHardcore ? '0.12em' : '0.04em',
            textTransform: 'uppercase',
          }}
          className={`
            text-[48px] sm:text-[54px] md:text-[62px] select-none
            ${isGrindcore ? 'fill-zinc-100 stroke-zinc-900 stroke-[4px]' : ''}
            ${isDjent ? 'fill-[url(#cyberGrad)] filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]' : ''}
            ${isHardcore ? 'fill-[url(#hardcoreGrad)] stroke-black stroke-[3px]' : ''}
            ${isDeathcore ? 'fill-[url(#bloodGrad)] stroke-zinc-950 stroke-[3px]' : ''}
          `}
        >
          {name}
        </text>

        {/* SUBTITLE OR ILLEGIBLE GRIND TRANSLATION */}
        {subtitle && (
          <text
            x="350"
            y="172"
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.35em',
            }}
            className="text-[12px] font-bold fill-zinc-400 uppercase tracking-widest"
          >
            {subtitle}
          </text>
        )}
      </svg>

      {/* Grindcore hover helper: when grindcore logo is illegible, user can read translation */}
      {isGrindcore && (
        <div className="text-center mt-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 opacity-80 group-hover:text-red-400 transition-colors">
            [ILlEGIBLE GRINDCORE LOGO // {name}]
          </span>
        </div>
      )}

      {showDownload && (
        <button
          onClick={handleDownload}
          className="absolute top-2 right-2 p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded border border-zinc-700/60 shadow-lg text-xs flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100"
          title="Download Band Logo as High-Res Transparent PNG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>PNG</span>
        </button>
      )}
    </div>
  );
};
