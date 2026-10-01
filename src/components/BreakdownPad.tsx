import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Radio, Play, Square, CircleDot, Flame, Mic } from 'lucide-react';
import { metalSynth } from '../audio/metalSynth';

interface BreakdownPadProps {
  tuning: string;
  bpm: number;
}

interface PadItem {
  id: string;
  label: string;
  sub: string;
  key: string;
  color: string;
  action: () => void;
  type: 'guitar' | 'drum' | 'fx' | 'vocal';
}

export const BreakdownPad: React.FC<BreakdownPadProps> = ({ tuning, bpm }) => {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [isLoopingBeat, setIsLoopingBeat] = useState(false);
  const [selectedDrumLoop, setSelectedDrumLoop] = useState<'blast_beat' | 'two_step' | 'breakdown' | 'polyrhythm_djent'>('breakdown');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Sync tuning with synth
  useEffect(() => {
    metalSynth.setTuning(tuning);
  }, [tuning]);

  // Recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const triggerPad = useCallback((pad: PadItem) => {
    setActivePad(pad.id);
    pad.action();
    setTimeout(() => {
      setActivePad((curr) => (curr === pad.id ? null : curr));
    }, 140);
  }, []);

  const pads: PadItem[] = [
    {
      id: 'chug0',
      label: '0 CHUG',
      sub: 'Open Palm Mute',
      key: '1',
      color: 'from-red-900/60 to-red-600/30 border-red-500/50 hover:border-red-400 text-red-100',
      action: () => metalSynth.playGuitarChug(0, true, 0.2),
      type: 'guitar'
    },
    {
      id: 'chug1',
      label: '1 DISSONANT',
      sub: 'Minor 2nd Grind',
      key: '2',
      color: 'from-orange-900/60 to-orange-600/30 border-orange-500/50 hover:border-orange-400 text-orange-100',
      action: () => metalSynth.playGuitarChug(1, true, 0.22),
      type: 'guitar'
    },
    {
      id: 'chug3',
      label: '3 TRITONE / SLAM',
      sub: 'Flatted 5th / Dim',
      key: '3',
      color: 'from-amber-900/60 to-amber-600/30 border-amber-500/50 hover:border-amber-400 text-amber-100',
      action: () => metalSynth.playGuitarChug(6, false, 0.4),
      type: 'guitar'
    },
    {
      id: 'squeal',
      label: 'PINCH HARMONIC',
      sub: 'Vibrato Squeal',
      key: '4',
      color: 'from-yellow-900/60 to-yellow-600/30 border-yellow-500/50 hover:border-yellow-400 text-yellow-100',
      action: () => metalSynth.playPinchHarmonic(3),
      type: 'guitar'
    },
    {
      id: 'scrape',
      label: 'PICK SCRAPE',
      sub: 'Abrasive Slide',
      key: '5',
      color: 'from-zinc-800 to-zinc-700 border-zinc-600 hover:border-zinc-400 text-zinc-100',
      action: () => metalSynth.playPickScrape(),
      type: 'fx'
    },
    {
      id: 'subdrop',
      label: '808 SUB BOMB',
      sub: 'Bass Drop (26Hz)',
      key: 'Space',
      color: 'from-purple-900/80 to-purple-600/40 border-purple-500/60 hover:border-purple-400 text-purple-100',
      action: () => metalSynth.playSubDrop(),
      type: 'fx'
    },
    {
      id: 'kick',
      label: 'DOUBLE KICK',
      sub: 'Triggered Click',
      key: 'Q',
      color: 'from-blue-900/60 to-blue-600/30 border-blue-500/50 hover:border-blue-400 text-blue-100',
      action: () => metalSynth.playKick(),
      type: 'drum'
    },
    {
      id: 'snare',
      label: 'PICCOLO SNARE',
      sub: 'High Brass Crack',
      key: 'W',
      color: 'from-cyan-900/60 to-cyan-600/30 border-cyan-500/50 hover:border-cyan-400 text-cyan-100',
      action: () => metalSynth.playSnare(),
      type: 'drum'
    },
    {
      id: 'china',
      label: 'TRASH CHINA',
      sub: 'Accent Cymbal',
      key: 'E',
      color: 'from-emerald-900/60 to-emerald-600/30 border-emerald-500/50 hover:border-emerald-400 text-emerald-100',
      action: () => metalSynth.playChina(),
      type: 'drum'
    },
    {
      id: 'blegh',
      label: 'BLEGH!',
      sub: 'Guttural Roar',
      key: 'R',
      color: 'from-rose-900/70 to-rose-600/40 border-rose-500/60 hover:border-rose-400 text-rose-100',
      action: () => metalSynth.playBlegh(),
      type: 'vocal'
    },
    {
      id: 'callout1',
      label: 'MOVE!',
      sub: 'Pit Command',
      key: 'T',
      color: 'from-red-950 to-red-800 border-red-600 hover:border-red-400 text-white font-bold',
      action: () => metalSynth.speakCallout('MOVE! MOVE! MOVE!'),
      type: 'vocal'
    },
    {
      id: 'callout2',
      label: 'DISRESPECT',
      sub: 'Breakdown Callout',
      key: 'Y',
      color: 'from-zinc-900 to-red-950 border-red-700 hover:border-red-500 text-red-200',
      action: () => metalSynth.speakCallout('DISRESPECT YOUR SURROUNDINGS!'),
      type: 'vocal'
    }
  ];

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toUpperCase();
      let matchedPad: PadItem | undefined;

      if (e.code === 'Space') {
        e.preventDefault();
        matchedPad = pads.find(p => p.key === 'Space');
      } else {
        matchedPad = pads.find(p => p.key.toUpperCase() === key);
      }

      if (matchedPad) {
        triggerPad(matchedPad);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pads, triggerPad]);

  // Toggle Drum Loop Backing Track
  const toggleDrumLoop = () => {
    if (isLoopingBeat) {
      metalSynth.stopTrack();
      setIsLoopingBeat(false);
    } else {
      // Empty guitar riff sequence (-1 means rests) so only drums play!
      const drumSequence = [-1, -1, -1, -1, -1, -1, -1, -1];
      metalSynth.startTrack(bpm, drumSequence, selectedDrumLoop);
      setIsLoopingBeat(true);
    }
  };

  // Toggle WAV Recording
  const toggleRecording = () => {
    if (!isRecording) {
      metalSynth.startRecording();
      setIsRecording(true);
    } else {
      metalSynth.stopRecordingAndDownload(`breakdown-riff-${Date.now()}.webm`);
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background industrial grid accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
              The Chug-a-Tron 8000
            </h3>
            <span className="text-xs px-2 py-0.5 bg-red-950/80 border border-red-800/60 text-red-400 font-mono rounded">
              {tuning}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Smash keyboard keys <span className="font-mono text-zinc-200">[1, 2, 3, 4, 5, Space, Q, W, E, R, T, Y]</span> to drop riffs, blasts, and breakdowns in real-time.
          </p>
        </div>

        {/* Backing Drum Machine & Recording Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Drum pattern selector */}
          <select
            value={selectedDrumLoop}
            onChange={(e) => {
              const val = e.target.value as any;
              setSelectedDrumLoop(val);
              if (isLoopingBeat) {
                metalSynth.startTrack(bpm, [-1, -1, -1, -1, -1, -1, -1, -1], val);
              }
            }}
            className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-red-500 font-mono"
          >
            <option value="breakdown">Breakdown Groove</option>
            <option value="blast_beat">Hyper Blast Beat</option>
            <option value="two_step">Hardcore Two-Step</option>
            <option value="polyrhythm_djent">Djent Polyrhythm</option>
          </select>

          {/* Drum Loop Toggle */}
          <button
            onClick={toggleDrumLoop}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              isLoopingBeat
                ? 'bg-amber-600 text-black animate-pulse shadow-[0_0_15px_rgba(217,119,6,0.6)]'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
          >
            {isLoopingBeat ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isLoopingBeat ? 'STOP BEAT' : 'LOOP DRUMS'}</span>
          </button>

          {/* Record Jam Session */}
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
            }`}
          >
            <CircleDot className={`w-3.5 h-3.5 ${isRecording ? 'text-white' : 'text-red-500'}`} />
            <span>{isRecording ? `REC ${recordSeconds}s (STOP & SAVE)` : 'RECORD JAM'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Pads Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
        {pads.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => triggerPad(pad)}
              className={`
                relative p-4 rounded-lg border text-left transition-all duration-75 flex flex-col justify-between h-28
                bg-gradient-to-b ${pad.color}
                ${isActive ? 'scale-95 brightness-150 shadow-[0_0_25px_rgba(255,255,255,0.4)] border-white' : 'shadow-md'}
                hover:scale-[1.02] active:scale-95 cursor-pointer
              `}
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-90">
                  {pad.type}
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-zinc-300 font-bold">
                  {pad.key}
                </span>
              </div>

              <div>
                <div className="font-extrabold text-sm tracking-tight text-white uppercase drop-shadow">
                  {pad.label}
                </div>
                <div className="text-[10px] text-zinc-300/80 font-mono mt-0.5 truncate">
                  {pad.sub}
                </div>
              </div>

              {isActive && (
                <div className="absolute inset-0 bg-white/20 rounded-lg pointer-events-none animate-ping opacity-40" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
