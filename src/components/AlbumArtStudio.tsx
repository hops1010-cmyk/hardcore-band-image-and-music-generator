import React, { useState, useRef } from 'react';
import { Disc, CassetteTape, Layers, Download, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { BandLogo } from './BandLogo';

interface AlbumArtStudioProps {
  bandName: string;
  albumTitle: string;
  genre: string;
  logoStyle: string;
  recommendedArtStyle: 'djent' | 'grindcore' | 'hardcore';
  artDescription: string;
  customArtUrl?: string;
  onArtUpdated: (url: string) => void;
}

export const AlbumArtStudio: React.FC<AlbumArtStudioProps> = ({
  bandName,
  albumTitle,
  genre,
  logoStyle,
  recommendedArtStyle,
  artDescription,
  customArtUrl,
  onArtUpdated,
}) => {
  const [packFormat, setPackFormat] = useState<'vinyl' | 'cassette' | 'cd'>('vinyl');
  const [showLogoOverlay, setShowLogoOverlay] = useState(true);
  const [showParentalAdvisory, setShowParentalAdvisory] = useState(true);
  const [showRingwear, setShowRingwear] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptInput, setPromptInput] = useState(artDescription);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Preset default images
  const defaultArtMap = {
    djent: '/src/assets/images/djent_album_art_1790827653417.jpg',
    grindcore: '/src/assets/images/grindcore_album_art_1790827667128.jpg',
    hardcore: '/src/assets/images/hardcore_beatdown_art_1790827680316.jpg',
  };

  const currentCoverUrl = customArtUrl || defaultArtMap[recommendedArtStyle] || defaultArtMap.djent;

  // Handle generating new AI artwork
  const handleGenerateArt = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/generate-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput || artDescription,
          style: genre,
        }),
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        onArtUpdated(data.imageUrl);
      } else {
        setErrorMsg(data.error || 'Failed to generate artwork. Using preset graphic.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error contacting image server');
    } finally {
      setIsGenerating(false);
    }
  };

  // Export current packaging view as PNG
  const handleDownloadCover = () => {
    if (!containerRef.current) return;
    const coverNode = containerRef.current.querySelector('#album-art-canvas-container');
    if (!coverNode) return;

    // Direct download of the current cover image or canvas composite
    const link = document.createElement('a');
    link.download = `${albumTitle.toLowerCase().replace(/\s+/g, '-')}-album-cover.png`;
    link.href = currentCoverUrl;
    link.click();
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl relative" ref={containerRef}>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT: INTERACTIVE PACKAGING PREVIEW */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          {/* Format selector buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg mb-6">
            <button
              onClick={() => setPackFormat('vinyl')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                packFormat === 'vinyl'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>12" VINYL</span>
            </button>
            <button
              onClick={() => setPackFormat('cassette')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                packFormat === 'cassette'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CassetteTape className="w-3.5 h-3.5" />
              <span>CASSETTE</span>
            </button>
            <button
              onClick={() => setPackFormat('cd')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                packFormat === 'cd'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>JEWEL CASE CD</span>
            </button>
          </div>

          {/* THE ALBUM PACKAGING CONTAINER */}
          <div id="album-art-canvas-container" className="relative group w-full max-w-[420px] aspect-square flex items-center justify-center">
            {/* 1. VINYL MODE */}
            {packFormat === 'vinyl' && (
              <div className="relative w-full h-full flex items-center">
                {/* Vinyl Record sliding out */}
                <div className="absolute right-0 w-[88%] h-[88%] rounded-full bg-zinc-950 border-4 border-zinc-900 shadow-2xl flex items-center justify-center transform translate-x-12 sm:translate-x-16 transition-transform duration-500 group-hover:translate-x-20 overflow-hidden">
                  {/* Vinyl Grooves */}
                  <div className="w-[90%] h-[90%] rounded-full border border-zinc-800/40 opacity-70 flex items-center justify-center">
                    <div className="w-[75%] h-[75%] rounded-full border border-zinc-800/50 flex items-center justify-center">
                      <div className="w-[60%] h-[60%] rounded-full border border-zinc-800/60 flex items-center justify-center">
                        {/* Center Label */}
                        <div className="w-[36%] h-[36%] rounded-full bg-red-800 border-4 border-zinc-900 flex flex-col items-center justify-center text-center p-1 text-white">
                          <span className="text-[7px] font-mono tracking-widest font-bold">SIDE A</span>
                          <span className="text-[8px] font-bold truncate max-w-[65px]">{albumTitle}</span>
                          <span className="text-[6px] font-mono text-zinc-300">33 RPM</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 mt-0.5 border border-zinc-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cardboard Outer Sleeve */}
                <div className="relative z-10 w-[88%] h-[88%] bg-zinc-900 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-hidden border border-zinc-800/80">
                  <img
                    src={currentCoverUrl}
                    alt={albumTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Ringwear effect */}
                  {showRingwear && (
                    <div className="absolute inset-0 pointer-events-none rounded-full border-[18px] border-white/5 opacity-40 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />
                  )}

                  {/* Cardboard spine crease */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

                  {/* Optional Band Logo Overlay */}
                  {showLogoOverlay && (
                    <div className="absolute top-4 inset-x-4 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      <BandLogo name={bandName} style={logoStyle} className="scale-75 origin-top" />
                    </div>
                  )}

                  {/* Parental Advisory Label */}
                  {showParentalAdvisory && (
                    <div className="absolute bottom-3 left-3 bg-white text-black px-2 py-0.5 border border-black font-sans leading-none flex flex-col items-center shadow-lg pointer-events-none">
                      <span className="text-[7px] font-black tracking-tighter">PARENTAL</span>
                      <span className="text-[9px] font-black tracking-normal">ADVISORY</span>
                      <span className="text-[6px] font-bold tracking-tight">EXPLICIT BREAKDOWNS</span>
                    </div>
                  )}

                  {/* Bottom title text */}
                  <div className="absolute bottom-3 right-3 text-right pointer-events-none bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                      {albumTitle}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CASSETTE MODE */}
            {packFormat === 'cassette' && (
              <div className="relative w-[340px] h-[460px] bg-zinc-900 border-4 border-zinc-700/80 rounded-lg shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                {/* Cassette J-Card Top Art */}
                <div className="relative w-full h-[220px] rounded overflow-hidden border border-zinc-800">
                  <img
                    src={currentCoverUrl}
                    alt={albumTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {showLogoOverlay && (
                    <div className="absolute top-2 inset-x-2 pointer-events-none">
                      <BandLogo name={bandName} style={logoStyle} className="scale-50 origin-top" />
                    </div>
                  )}
                </div>

                {/* Cassette Body Section */}
                <div className="relative w-full h-[180px] bg-zinc-950 border-2 border-zinc-800 rounded p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="font-bold text-red-500">TYPE II / CrO2</span>
                    <span className="truncate max-w-[140px] text-zinc-200">{bandName}</span>
                    <span>SIDE 1</span>
                  </div>

                  {/* Tape Spools & Window */}
                  <div className="w-full h-12 bg-zinc-900/90 rounded border border-zinc-700/80 flex items-center justify-center gap-12 relative">
                    <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-zinc-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    {/* Magnetic tape band */}
                    <div className="w-16 h-4 bg-zinc-800 border-y border-amber-900/60" />
                    <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-zinc-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>

                  <div className="text-center font-mono text-[9px] text-zinc-400 tracking-wider">
                    {albumTitle} // HIGH OUTPUT METAL CASSETTE
                  </div>
                </div>
              </div>
            )}

            {/* 3. CD JEWEL CASE MODE */}
            {packFormat === 'cd' && (
              <div className="relative w-[380px] h-[350px] bg-zinc-900/90 border-4 border-zinc-600/70 rounded shadow-2xl p-2 flex overflow-hidden">
                {/* CD Spine hinge on left */}
                <div className="w-6 h-full bg-zinc-950 border-r border-zinc-700/80 flex flex-col justify-between py-4 text-[8px] font-mono text-zinc-500 [writing-mode:vertical-rl] rotate-180">
                  <span>{bandName}</span>
                  <span className="text-zinc-300 font-bold">{albumTitle}</span>
                  <span>ROT-CD-666</span>
                </div>

                {/* Cover art booklet */}
                <div className="relative flex-1 h-full rounded overflow-hidden ml-2 border border-zinc-800">
                  <img
                    src={currentCoverUrl}
                    alt={albumTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Cracked glass overlay on CD */}
                  <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_top_right,#fff_0%,transparent_60%)]" />

                  {showLogoOverlay && (
                    <div className="absolute top-3 inset-x-3 pointer-events-none">
                      <BandLogo name={bandName} style={logoStyle} className="scale-65 origin-top" />
                    </div>
                  )}

                  {showParentalAdvisory && (
                    <div className="absolute bottom-2 left-2 bg-white text-black px-1.5 py-0.5 border border-black font-sans leading-none flex flex-col items-center shadow pointer-events-none">
                      <span className="text-[6px] font-black">PARENTAL</span>
                      <span className="text-[8px] font-black">ADVISORY</span>
                      <span className="text-[5px] font-bold">EXTREME CHUGS</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick preset switches */}
          <div className="flex items-center gap-3 mt-4 text-xs font-mono text-zinc-400">
            <span>PRESETS:</span>
            <button
              onClick={() => onArtUpdated(defaultArtMap.djent)}
              className="text-cyan-400 hover:underline"
            >
              [Djent]
            </button>
            <button
              onClick={() => onArtUpdated(defaultArtMap.grindcore)}
              className="text-red-400 hover:underline"
            >
              [Grindcore]
            </button>
            <button
              onClick={() => onArtUpdated(defaultArtMap.hardcore)}
              className="text-amber-400 hover:underline"
            >
              [Hardcore]
            </button>
          </div>
        </div>

        {/* RIGHT: CONTROLS, PROMPT, & AI GENERATOR */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold font-mono text-white uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Album Art Studio
              </h4>
              <button
                onClick={handleDownloadCover}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded text-xs font-mono transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE COVER</span>
              </button>
            </div>

            {/* Toggle Badges & Overlays */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => setShowLogoOverlay(!showLogoOverlay)}
                className={`px-3 py-2 rounded text-xs font-mono border text-center transition-colors ${
                  showLogoOverlay
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                Band Logo: {showLogoOverlay ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setShowParentalAdvisory(!showParentalAdvisory)}
                className={`px-3 py-2 rounded text-xs font-mono border text-center transition-colors ${
                  showParentalAdvisory
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                Advisory Sticker: {showParentalAdvisory ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setShowRingwear(!showRingwear)}
                className={`px-3 py-2 rounded text-xs font-mono border text-center transition-colors ${
                  showRingwear
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                Vinyl Wear: {showRingwear ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Art Description & Concept */}
            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-lg mb-4">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                Album Visual Concept
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{artDescription}"
              </p>
            </div>

            {/* AI Generator Input */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-zinc-400 block">
                Prompt / Artistic Direction for Imagen 3:
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-mono resize-none"
                placeholder="Describe dark cosmic void, rusted chains, bio-mechanical monoliths..."
              />

              {errorMsg && (
                <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 p-2.5 rounded font-mono">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleGenerateArt}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-all shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>SYNTHESIZING BRUTAL ARTWORK...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>GENERATE AI ARTWORK WITH GEMINI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-500 mt-6 pt-4 border-t border-zinc-900 flex justify-between">
            <span>FORMAT: 12" 180G VINYL / CASSETTE / CD</span>
            <span>CATALOG: ROT-666-LP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
