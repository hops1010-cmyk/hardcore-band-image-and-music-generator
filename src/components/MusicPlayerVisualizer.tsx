import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, FastForward, Rewind, Volume2, Mic, Activity, Download, CircleDot } from 'lucide-react';
import { Track } from '../types';
import { metalSynth } from '../audio/metalSynth';

interface MusicPlayerVisualizerProps {
  tracks: Track[];
  tuning: string;
  bandName: string;
}

export const MusicPlayerVisualizer: React.FC<MusicPlayerVisualizerProps> = ({
  tracks,
  tuning,
  bandName,
}) => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentBpm, setCurrentBpm] = useState(tracks[0]?.tempo || 150);
  const [currentPattern, setCurrentPattern] = useState(tracks[0]?.drumPattern || 'polyrhythm_djent');
  const [isRecording, setIsRecording] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const track = tracks[selectedTrackIndex] || tracks[0];

  // Sync track when index changes
  useEffect(() => {
    if (track) {
      setCurrentBpm(track.tempo);
      setCurrentPattern(track.drumPattern);
      if (isPlaying) {
        metalSynth.startTrack(track.tempo, track.riffSequence, track.drumPattern, (step) => {
          setCurrentStep(step);
        });
      }
    }
  }, [selectedTrackIndex, track]);

  // Handle Play / Stop
  const handleTogglePlay = () => {
    if (isPlaying) {
      metalSynth.stopTrack();
      setIsPlaying(false);
      setCurrentStep(0);
    } else {
      metalSynth.startTrack(currentBpm, track.riffSequence, currentPattern, (step) => {
        setCurrentStep(step);
      });
      setIsPlaying(true);
    }
  };

  // Handle recording track to WAV / WebM
  const handleToggleRecord = () => {
    if (!isRecording) {
      metalSynth.startRecording();
      setIsRecording(true);
      if (!isPlaying) {
        handleTogglePlay();
      }
    } else {
      metalSynth.stopRecordingAndDownload(`${bandName.toLowerCase()}-${track.title.toLowerCase().replace(/\s+/g, '-')}.webm`);
      setIsRecording(false);
    }
  };

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = metalSynth.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameIdRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);

        // Draw frequency bars
        const barWidth = (width / 48) - 1.5;
        let x = 0;

        for (let i = 0; i < 48; i++) {
          const barHeight = (dataArray[i * 2] / 255) * height * 0.95;

          // Gradient color: Red to Amber to Cyan
          const r = Math.min(255, 180 + dataArray[i * 2]);
          const g = Math.min(255, 30 + (i * 4));
          const b = Math.min(255, (i > 30 ? 200 : 30));

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);

          // Top peak dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, height - barHeight - 2, barWidth, 2);

          x += barWidth + 1.5;
        }
      } else {
        // Idle ambient oscilloscope line
        ctx.strokeStyle = '#3f3f46';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const sliceWidth = width / 50;
        let x = 0;
        for (let i = 0; i < 50; i++) {
          const y = height / 2 + Math.sin(i * 0.3 + Date.now() * 0.003) * 6;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      }
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* HEADER & TRACK INFO */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
              Riff Engine & Track Synthesizer
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
              TUNING: {tuning}
            </span>
          </div>
          <div className="text-xs text-zinc-400 font-mono mt-1">
            Real-time down-tuned amp simulation, blast beats, and polyrhythmic breakdowns.
          </div>
        </div>

        {/* Global Record Button */}
        <button
          onClick={handleToggleRecord}
          className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono font-bold transition-all shadow-lg ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          <CircleDot className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-red-500'}`} />
          <span>{isRecording ? 'STOP & SAVE AUDIO' : 'EXPORT TRACK (AUDIO)'}</span>
        </button>
      </div>

      {/* TRACK SELECTOR TABS */}
      <div className="flex flex-wrap gap-2">
        {tracks.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedTrackIndex(idx)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all text-left flex items-center gap-2 ${
              selectedTrackIndex === idx
                ? 'bg-red-950/80 border border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                : 'bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-zinc-500 font-bold">{idx + 1}.</span>
            <span className="font-semibold text-zinc-100">{t.title}</span>
            <span className="text-zinc-500 text-[10px]">({t.duration})</span>
          </button>
        ))}
      </div>

      {/* VISUALIZER CANVAS & TRANSPORT CONTROLS */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-4">
        {/* Real-time Spectrum canvas */}
        <div className="w-full h-24 bg-black/60 rounded border border-zinc-800/80 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={96}
            className="w-full h-full block"
          />
          <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500">
            FFT FREQUENCY SPECTRUM (20Hz - 20kHz)
          </div>
          {isPlaying && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] font-mono text-red-400 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              LIVE AUDIO OUT
            </div>
          )}
        </div>

        {/* Transport controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-mono font-bold tracking-wider transition-all shadow-xl ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>STOP TRACK</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>PLAY TRACK</span>
                </>
              )}
            </button>

            {/* Vocal Callout Trigger */}
            <button
              onClick={() => metalSynth.speakCallout(track.breakdownCallout || 'BLEGH!')}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono rounded"
              title="Trigger Harsh Scream Callout"
            >
              <Mic className="w-3.5 h-3.5 text-red-400" />
              <span>"{track.breakdownCallout || 'BLEGH!'}"</span>
            </button>
          </div>

          {/* Tempo & Drum Groove sliders */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* BPM */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">BPM:</span>
              <input
                type="range"
                min="90"
                max="320"
                value={currentBpm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentBpm(val);
                  if (isPlaying) {
                    metalSynth.startTrack(val, track.riffSequence, currentPattern, (step) => setCurrentStep(step));
                  }
                }}
                className="w-24 accent-red-600 cursor-pointer"
              />
              <span className="font-bold text-white w-10">{currentBpm}</span>
            </div>

            {/* Drum Groove */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">GROOVE:</span>
              <select
                value={currentPattern}
                onChange={(e) => {
                  const p = e.target.value as any;
                  setCurrentPattern(p);
                  if (isPlaying) {
                    metalSynth.startTrack(currentBpm, track.riffSequence, p, (step) => setCurrentStep(step));
                  }
                }}
                className="bg-zinc-950 border border-zinc-700 text-zinc-200 px-2 py-1 rounded focus:outline-none focus:border-red-500"
              >
                <option value="polyrhythm_djent">Polyrhythm Djent</option>
                <option value="blast_beat">Hyper Blast Beat</option>
                <option value="two_step">Hardcore Two-Step</option>
                <option value="breakdown">Breakdown</option>
                <option value="half_time_slam">Half-Time Slam</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* GUITAR TABLATURE & SYNCHRONIZED SEQUENCER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TABLATURE VIEWER */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
              Guitar Tablature ({tuning})
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              TIME SIGNATURE: {track.timeSig}
            </span>
          </div>

          {/* ASCII Tab Display */}
          <pre className="bg-black/80 p-3 rounded font-mono text-xs text-emerald-400 overflow-x-auto border border-zinc-800 leading-relaxed">
            {track.riffTabs}
          </pre>

          {/* Step Sequence Dots */}
          <div className="mt-3">
            <div className="text-[10px] font-mono text-zinc-500 mb-1">
              ACTIVE RIFF STEP:
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {track.riffSequence.map((fret, sIdx) => {
                const isCurrent = isPlaying && currentStep === sIdx;
                return (
                  <div
                    key={sIdx}
                    className={`
                      w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold transition-all
                      ${isCurrent
                        ? 'bg-red-600 text-white scale-110 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                      }
                    `}
                  >
                    {fret}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LYRICS & CUES */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
              Vocal Lyrics & Cues
            </span>
            <span className="text-[10px] font-mono text-red-400">
              CLICK CUE TO SCREAM
            </span>
          </div>

          <div className="bg-black/80 p-3 rounded font-mono text-xs text-zinc-300 overflow-y-auto max-h-44 border border-zinc-800 whitespace-pre-wrap leading-relaxed">
            {track.lyrics.split('\n').map((line, lIdx) => {
              if (line.startsWith('[') && line.endsWith(']')) {
                return (
                  <button
                    key={lIdx}
                    onClick={() => metalSynth.speakCallout(line.replace(/\[|\]/g, ''))}
                    className="block text-red-400 font-bold hover:text-white hover:underline transition-colors my-0.5 cursor-pointer text-left"
                  >
                    {line}
                  </button>
                );
              }
              return (
                <div key={lIdx} className="text-zinc-400">
                  {line}
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-zinc-500 mt-2">
            VOCAL STYLE: Throat Gutturals / Pig Squeals / Hardcore Pit Commands
          </div>
        </div>
      </div>
    </div>
  );
};
