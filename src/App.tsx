/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Disc,
  Volume2,
  Shirt,
  Sparkles,
  RefreshCw,
  Skull,
  Radio,
  Sliders,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { BandData } from './types';
import { BandLogo } from './components/BandLogo';
import { AlbumArtStudio } from './components/AlbumArtStudio';
import { MusicPlayerVisualizer } from './components/MusicPlayerVisualizer';
import { BreakdownPad } from './components/BreakdownPad';
import { MerchAndTour } from './components/MerchAndTour';

// Initial Preset Bands so app loads instantly with high-impact data
const INITIAL_BANDS: Record<string, BandData> = {
  djent: {
    name: "TESSERACTAL FRACTURE",
    genre: "Technical Djent / Progressive Metalcore",
    logoStyle: "djent_cyber_geom",
    hometown: "Umeå, Sweden / Gothenburg",
    label: "Sumerian Crypt Records",
    tuning: "Drop E (8-String Headless)",
    bpm: 145,
    timeSignature: "17/16 against 4/4",
    albumTitle: "THE ENTROPIC MONOLITH",
    releaseYear: 2026,
    albumConcept: "A multi-dimensional traversal through cybernetic dread, synthetic consciousness, and zero-point non-euclidean geometry.",
    artDescription: "A colossal biomechanical obsidian monolith floating in an abyssal cyber-fractal cosmos with glowing cyan wires.",
    recommendedArtStyle: "djent",
    merchSlogan: "NEVER SOLVE THE EQUATION // 8-STRING HEAVYWEIGHT",
    bio: "Forged in the sub-zero frost of Scandinavia, TESSERACTAL FRACTURE crafts punishing polyrhythmic sonic geometry combining down-tuned baritone violence with quantum existential dread.",
    members: [
      { role: "8-String Guitars & Sound Design", name: "Kaelen Vane", gear: "Strandberg Boden 8, Quad Cortex, Neural DSP" },
      { role: "Polyrhythmic Percussion", name: "Jonas Richter", gear: "Pearl Masterworks, Meinl Dark Byzance Custom Cymbals" },
      { role: "Low-End / Sub Frequencies", name: "Vesper Thorne", gear: "Dingwall NG3 5-String, Darkglass B7K Ultra" },
      { role: "Harsh Throat / Glitch Vocals", name: "Riku Lindqvist", gear: "Shure SM7B, Eventide Space Reverb" }
    ],
    tourDates: [
      { venue: "Subterranean Forge", city: "Berlin, DE", date: "NOV 14", supportingBands: ["Mesh-Vector", "Quantized Void"] },
      { venue: "The Electric Crypt", city: "London, UK", date: "NOV 18", supportingBands: ["Zero Gravity Slam"] },
      { venue: "Knitting Factory", city: "Brooklyn, NY", date: "DEC 02", supportingBands: ["Algorithmic Agony", "Binary Pulse"] }
    ],
    tracks: [
      {
        title: "Synaptic Decimation",
        duration: "3:42",
        lyrics: "[BLEGH]\nCALCULATED SUFFERING\nIN THE MATRIX OF RECURSIVE TORMENT\nWE ARE THE PARASITES OF REASON\n[BASS DROP]\n0 - 0 - 0 - 0\nCOLLAPSE THE QUANTUM WAVE\nNOTHING SURVIVES THE OBSERVATION\n[DISSONANT SQUEAL]\nDIE IN PERPETUITY!",
        breakdownCallout: "DISMANTLE THE ARCHITECTURE!",
        riffTabs: "F |-----------------------------|\nC |-----------------------------|\nG#|-----------------------------|\nD#|-----------------------------|\nA#|-----------------------------|\nF |-----------------------------|\nC |-----------------------------|\nF |-0-0-0-1-0-0--0-0-3-0-1-0-0--|",
        tempo: 142,
        timeSig: "7/8",
        riffSequence: [0, 0, 0, 1, 0, 0, 3, 0, 1, 0, 0, 5, 0, 1],
        drumPattern: "polyrhythm_djent"
      },
      {
        title: "Recursive Void Paradigm",
        duration: "4:15",
        lyrics: "CHRONOS DEVOURS ITS OWN PROGENY\nMECHANIZED BONE MEETS FIBER-OPTIC FLESH\n[GUTTURAL GROWL]\nTHE EQUATION REMAINS UNSOLVED\n[PIG SQUEAL]\nEXECUTE PURGE PROTOCOL!",
        breakdownCallout: "BLEGH!",
        riffTabs: "F |-0-0-0--0-0-0--1-0--0-0-0-0-|\nC |-0-0-0--0-0-0--1-0--0-0-0-0-|",
        tempo: 135,
        timeSig: "13/16",
        riffSequence: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 2, 0, 1],
        drumPattern: "breakdown"
      },
      {
        title: "Event Horizon Dissection",
        duration: "5:08",
        lyrics: "PULLED BEYOND THE TANGIBLE THRESHOLD\nGRAVITATIONAL SHIFT CRUSHES THE MARROW\nSPAGHETTIFIED SOULS SCREAMING IN BINARY\nENDLESS DENSITY\nENDLESS PRESSURE.",
        breakdownCallout: "FEEL THE GRAVITY!",
        riffTabs: "F |-0-1-0-0--0-1-0-0--6-5-0-0--|",
        tempo: 150,
        timeSig: "4/4",
        riffSequence: [0, 1, 0, 0, 0, 1, 0, 0, 6, 5, 0, 0],
        drumPattern: "polyrhythm_djent"
      }
    ]
  },
  grindcore: {
    name: "PUTRID CAUSTIC SEPTICEMIA",
    genre: "Grindcore / Goregrind / Powerviolence",
    logoStyle: "grindcore_branches",
    hometown: "Birmingham, UK / Cleveland, OH",
    label: "Rotten Intestine Cassettes",
    tuning: "Drop A (Sludgy & Rotted)",
    bpm: 260,
    timeSignature: "4/4 (Hyper Blast)",
    albumTitle: "VISCERAL NECROSIS EP",
    releaseYear: 2026,
    albumConcept: "Raw, unmastered 12-minute barrage of blast beats, pitch-shifted sewer gutturals, and tape-hiss industrial grinding.",
    artDescription: "A xerox photocopied collage of rusted surgical clamps, barbed wire, decayed medical morgue slides, and pitch black grime.",
    recommendedArtStyle: "grindcore",
    merchSlogan: "MAXED OUT HM-2 OR NOTHING // EAR DAMAGE GUARANTEED",
    bio: "Playing at speeds surpassing human cartilage endurance, PUTRID CAUSTIC SEPTICEMIA captures the relentless filth of 90s underground tape-trading goregrind.",
    members: [
      { role: "Chainsaw Buzzsaw Guitar", name: "Gore-Slinger Mick", gear: "Boss HM-2 Maxed Out, Marshall JCM800" },
      { role: "Hyper-Velocity Blast Machine", name: "Dave 'The Hammer' C.", gear: "Triggered Piccolo Snare, Twin Cam Double Pedals" },
      { role: "Sub-Sonic Rotted Bass", name: "Ratchet", gear: "Peavey MegaBass, Big Muff Pi" },
      { role: "Pitch-Shifted Sewer Gutturals & Shouts", name: "Stench", gear: "Digitech Whammy, Shure 55SH" }
    ],
    tourDates: [
      { venue: "VFW Basement Hall", city: "Philadelphia, PA", date: "OCT 12", supportingBands: ["Corpse Mutilation", "Ear Bleed"] },
      { venue: "The Sewer Squat", city: "Leipzig, DE", date: "OCT 25", supportingBands: ["Grind Bastards"] },
      { venue: "CBGB Memorial Dumpster", city: "New York, NY", date: "NOV 04", supportingBands: ["Maggot Swarm"] }
    ],
    tracks: [
      {
        title: "Surgical Saw Malfunction (0:34)",
        duration: "0:34",
        lyrics: "[PIG SQUEAL]\nSPLATTERED ACROSS THE TILES\nTEETH CHATTERING IN FORMALDEHYDE\nBLAST!\nBLAST!\nBLAST!\n[GUTTURAL COUGH]\nDEAD ON ARRIVAL!",
        breakdownCallout: "ROT!",
        riffTabs: "A |-0-1-0-1-0-1-0-1--3-2-1-0-|\nD |-0-1-0-1-0-1-0-1--3-2-1-0-|",
        tempo: 280,
        timeSig: "4/4",
        riffSequence: [0, 1, 0, 1, 0, 1, 3, 2, 1, 0, 0, 1, 4, 3],
        drumPattern: "blast_beat"
      },
      {
        title: "Intestinal Sludge Regurgitation",
        duration: "0:48",
        lyrics: "[INHALED SQUEAL]\nBILE IN THE VALVE\nCHOKE ON THE EFFLUENT\nNO OXYGEN\nNO MERCY\n[BASS DROP]\nDRAIN THE CORPSE!",
        breakdownCallout: "SUFFOCATE!",
        riffTabs: "A |-0-0-0--1-1-1--0-0-0--4-4-4-|",
        tempo: 260,
        timeSig: "4/4",
        riffSequence: [0, 0, 0, 1, 1, 1, 0, 0, 0, 4, 3, 2, 1, 0],
        drumPattern: "blast_beat"
      },
      {
        title: "Autopsy Table Collapse",
        duration: "1:02",
        lyrics: "SLURRY IN THE TROUGH\nHEAVY METALS IN THE SPLEEN\nPURE RANCID TORTURE\nSLOOOOOW DOWWWWN\n[HALF TIME SLAM]\nCRUSH!",
        breakdownCallout: "SLAM IT!",
        riffTabs: "A |-0---0---0---1---0---0---6-5-|",
        tempo: 120,
        timeSig: "4/4",
        riffSequence: [0, 0, 0, 1, 0, 0, 6, 5, 0, 0, 1, 0],
        drumPattern: "half_time_slam"
      }
    ]
  },
  hardcore: {
    name: "CONCRETE SPITE",
    genre: "Hardcore / Heavy Beatdown",
    logoStyle: "hardcore_stencil",
    hometown: "Baltimore, MD / Wilkes-Barre, PA",
    label: "Cold Brick Records",
    tuning: "Drop F#",
    bpm: 170,
    timeSignature: "4/4 (Two-Step & Half-Time Mosh)",
    albumTitle: "BLOOD ON THE ASPHALT",
    releaseYear: 2026,
    albumConcept: "Unforgiving blue-collar fury, street-level retribution, stage dives, crowdkilling riffs, and brotherhood forged in pit blood.",
    artDescription: "Crumbling urban concrete wall sprayed with dripping red stencil graffiti, chainlink fencing, and barbed fist iconography.",
    recommendedArtStyle: "hardcore",
    merchSlogan: "HEAVY BEATDOWN // STEP UP OR GET STEPPED ON",
    bio: "Formed in gritty industrial warehouses, CONCRETE SPITE blends 90s NYHC street discipline with skull-shattering modern beatdown breakdowns.",
    members: [
      { role: "Frontman & Pit General", name: "Trey 'Bones' Kowalski", gear: "Cordless Shure Beta 58A, Bruised Knuckles" },
      { role: "Heavy Riff Enforcer", name: "Nico Ramos", gear: "Gibson Les Paul Custom, Peavey 5150 Full Stack" },
      { role: "Bass Slugger", name: "Dexter Vance", gear: "Fender Precision Bass, Ampeg SVT-CL 8x10" },
      { role: "Two-Step & Beatdown Drums", name: "Marcus Shaw", gear: "Tama Starclassic, Sabian AAX Cymbals" }
    ],
    tourDates: [
      { venue: "The Meatlocker", city: "Montclair, NJ", date: "OCT 19", supportingBands: ["Tough Luck", "Jawbreaker"] },
      { venue: "Amityville Music Hall", city: "Amityville, NY", date: "OCT 27", supportingBands: ["Final Warning"] },
      { venue: "First Unitarian Church", city: "Philadelphia, PA", date: "NOV 09", supportingBands: ["Pain of Truth", "Sunami"] }
    ],
    tracks: [
      {
        title: "Crowdkill Anthem",
        duration: "2:18",
        lyrics: "YOU TALKED YOUR TRASH BEHIND A SCREEN\nNOW YOU'RE STANDING IN MY F***ING PIT!\nMOVE!\n[TWO-STEP SECTION]\nTWO STEP FOR YOUR LIFE!\nNOW PICK IT UP!\n[BASS DROP]\nTHIS IS BALTIMORE HARDCORE!\n[BLEGH]\nGET THE F*** UP!",
        breakdownCallout: "DISRESPECT YOUR SURROUNDINGS!",
        riffTabs: "F#|-------------------------|\nC#|-------------------------|\nA |-------------------------|\nE |-------------------------|\nB |-------------------------|\nF#|-0-0-0--0-0-0--1-0-1-0-0-|",
        tempo: 165,
        timeSig: "4/4",
        riffSequence: [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 2, 1],
        drumPattern: "two_step"
      },
      {
        title: "Vendetta (Iron Fist)",
        duration: "1:55",
        lyrics: "CROSS ME ONCE, SHAME ON YOU\nCROSS ME TWICE, YOU GET LAID OUT FLAT!\nWATCH YOUR BACK\nWHEN THE LIGHTS GO DOWN\nNO ESCAPE\nFROM THE CONCRETE!",
        breakdownCallout: "MOVE IT OR LOSE IT!",
        riffTabs: "F#|-0-1-0-0--0-1-0-0--0-3-2-1-|",
        tempo: 140,
        timeSig: "4/4",
        riffSequence: [0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 2, 1, 0, 0],
        drumPattern: "breakdown"
      },
      {
        title: "Spite Driven",
        duration: "2:40",
        lyrics: "EVERY DAY IS A BATTLEFIELD\nEVERY FRIEND HAS A PRICE TAG\nI WALK ALONE WITH CLENCHED TEETH\nNOTHING CAN BREAK ME NOW\nBREAKDOWN!",
        breakdownCallout: "KNOCK 'EM OUT!",
        riffTabs: "F#|-0---0---0---0---1-1-1-1-|",
        tempo: 130,
        timeSig: "4/4",
        riffSequence: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 4, 3, 0],
        drumPattern: "half_time_slam"
      }
    ]
  }
};

export default function App() {
  const [band, setBand] = useState<BandData>(INITIAL_BANDS.djent);
  const [activeTab, setActiveTab] = useState<'art' | 'player' | 'pad' | 'merch'>('art');
  const [subgenreSelect, setSubgenreSelect] = useState<string>('djent');
  const [vibePrompt, setVibePrompt] = useState<string>('');
  const [customNameInput, setCustomNameInput] = useState<string>('');
  const [isGeneratingBand, setIsGeneratingBand] = useState<boolean>(false);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string>('/src/assets/images/djent_album_art_1790827653417.jpg');

  // Handle switching preset bands
  const handleSelectPreset = (key: string) => {
    const selected = INITIAL_BANDS[key];
    if (selected) {
      setBand(selected);
      setSubgenreSelect(key);
      const defaultArtMap = {
        djent: '/src/assets/images/djent_album_art_1790827653417.jpg',
        grindcore: '/src/assets/images/grindcore_album_art_1790827667128.jpg',
        hardcore: '/src/assets/images/hardcore_beatdown_art_1790827680316.jpg',
      };
      setCurrentCoverUrl(defaultArtMap[selected.recommendedArtStyle] || defaultArtMap.djent);
    }
  };

  // Generate new Band with Gemini
  const handleGenerateBand = async () => {
    setIsGeneratingBand(true);
    try {
      const res = await fetch('/api/generate-band', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subgenre: subgenreSelect,
          vibe: vibePrompt,
          customName: customNameInput,
        }),
      });

      const data = await res.json();
      if (data && data.name) {
        setBand(data);
        const defaultArtMap = {
          djent: '/src/assets/images/djent_album_art_1790827653417.jpg',
          grindcore: '/src/assets/images/grindcore_album_art_1790827667128.jpg',
          hardcore: '/src/assets/images/hardcore_beatdown_art_1790827680316.jpg',
        };
        const art = defaultArtMap[data.recommendedArtStyle as 'djent' | 'grindcore' | 'hardcore'] || defaultArtMap.djent;
        setCurrentCoverUrl(art);
      }
    } catch (e) {
      console.error('Error generating band:', e);
    } finally {
      setIsGeneratingBand(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col font-sans">
      {/* TOP BAR / NAVIGATION */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)]">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-mono font-black text-sm tracking-wider text-white uppercase flex items-center gap-1.5">
                <span>BREAKDOWN</span>
                <span className="text-red-500 font-extrabold text-[10px]">EXTREME METAL ENGINE</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                Hardcore · Grindcore · Djent Music & Artwork Studio
              </div>
            </div>
          </div>

          {/* Quick Preset Bands */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-600 mr-1">PRESETS:</span>
            <button
              onClick={() => handleSelectPreset('djent')}
              className={`px-2.5 py-1 rounded transition-colors ${
                subgenreSelect === 'djent' ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Djent
            </button>
            <button
              onClick={() => handleSelectPreset('grindcore')}
              className={`px-2.5 py-1 rounded transition-colors ${
                subgenreSelect === 'grindcore' ? 'bg-red-950/80 border border-red-800 text-red-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Grindcore
            </button>
            <button
              onClick={() => handleSelectPreset('hardcore')}
              className={`px-2.5 py-1 rounded transition-colors ${
                subgenreSelect === 'hardcore' ? 'bg-amber-950/80 border border-amber-800 text-amber-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Hardcore Beatdown
            </button>
          </div>
        </div>
      </header>

      {/* HERO STAGE BANNER */}
      <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-black border-b border-zinc-900">
        <img
          src="/src/assets/images/metal_stage_hero_1790827692291.jpg"
          alt="Metal Band Live Stage Silhouette"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 filter contrast-125 saturate-50 scale-105 transform hover:scale-100 transition-transform duration-1000"
        />
        {/* Dark vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08080a]/60 to-[#08080a]" />

        {/* Floating Brutal Band Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-2xl w-full">
            <BandLogo
              name={band.name}
              style={band.logoStyle}
              subtitle={band.genre}
              showDownload={true}
              className="drop-shadow-[0_15px_30px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Unboxed Metadata Line (anti-slop rule compliant) */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-3 text-xs font-mono text-zinc-400">
            <span className="text-zinc-200 font-semibold">{band.genre}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{band.hometown}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{band.label}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-red-400 font-bold">{band.tuning}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{band.bpm} BPM</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* GENERATOR CONTROL BAR */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Skull className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold font-mono text-white uppercase tracking-tight">
              Extreme Metal & Band Generator
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Subgenre Selector */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                SUBGENRE:
              </label>
              <select
                value={subgenreSelect}
                onChange={(e) => setSubgenreSelect(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              >
                <option value="djent">Djent / Progressive Metal</option>
                <option value="grindcore">Grindcore / Powerviolence</option>
                <option value="hardcore">Hardcore / Beatdown</option>
                <option value="deathcore">Deathcore / Slam</option>
                <option value="mathcore">Mathcore / Chaotic Metal</option>
                <option value="sludge">Sludge / Doom / D-Beat</option>
              </select>
            </div>

            {/* Vibe / Prompt Input */}
            <div className="md:col-span-4">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                VIBE / THEME / LORE:
              </label>
              <input
                type="text"
                value={vibePrompt}
                onChange={(e) => setVibePrompt(e.target.value)}
                placeholder="e.g. Alien parasitic invasion, 8-string polyrhythms, 90s street beatdown..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Optional Custom Band Name */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                CUSTOM NAME (OPTIONAL):
              </label>
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="Leave blank to invent a brutal name"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Generate Button */}
            <div className="md:col-span-2 flex flex-col justify-end">
              <label className="text-[11px] font-mono text-transparent block mb-1 select-none">
                ACTION
              </label>
              <button
                onClick={handleGenerateBand}
                disabled={isGeneratingBand}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-all shadow-lg cursor-pointer"
              >
                {isGeneratingBand ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>FORGING...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>GENERATE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center justify-center sm:justify-start gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl max-w-xl">
          <button
            onClick={() => setActiveTab('art')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'art'
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Disc className="w-4 h-4 text-red-500" />
            <span>ALBUM & PACKAGING</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'player'
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>RIFFS & TRACK SYNTH</span>
          </button>

          <button
            onClick={() => setActiveTab('pad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'pad'
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>CHUG-A-TRON 8000</span>
          </button>

          <button
            onClick={() => setActiveTab('merch')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'merch'
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4 text-purple-400" />
            <span>MERCH & TOUR DATES</span>
          </button>
        </div>

        {/* ACTIVE TAB CONTENT */}
        <div className="transition-all">
          {activeTab === 'art' && (
            <AlbumArtStudio
              bandName={band.name}
              albumTitle={band.albumTitle}
              genre={band.genre}
              logoStyle={band.logoStyle}
              recommendedArtStyle={band.recommendedArtStyle}
              artDescription={band.artDescription}
              customArtUrl={currentCoverUrl}
              onArtUpdated={(url) => setCurrentCoverUrl(url)}
            />
          )}

          {activeTab === 'player' && (
            <MusicPlayerVisualizer
              tracks={band.tracks}
              tuning={band.tuning}
              bandName={band.name}
            />
          )}

          {activeTab === 'pad' && (
            <BreakdownPad
              tuning={band.tuning}
              bpm={band.bpm}
            />
          )}

          {activeTab === 'merch' && (
            <MerchAndTour
              band={band}
              coverArtUrl={currentCoverUrl}
            />
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            BREAKDOWN // EXTREME HARDCORE, GRINDCORE & DJENT MUSIC GENERATOR
          </div>
          <div>
            Drop E / Drop F Down-Tuned Audio Synthesizer · 100% Web Audio API
          </div>
        </div>
      </footer>
    </div>
  );
}
