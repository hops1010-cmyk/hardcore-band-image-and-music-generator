/**
 * Heavy Metal / Grindcore / Djent Web Audio Engine
 * Features:
 * - High-gain distorted down-tuned guitar amp & cab sim (Drop E, Drop F, Drop A)
 * - Palm-muted 0-0-0 chugs, pinch harmonics, pick scrapes
 * - Extreme metal drum machine (Double kicks, piccolo snare, trashy china cymbals, blast beats)
 * - 808 Sub-bass drops
 * - Vocal roar / "BLEGH!" synth
 * - Live sequencer, loop playback, analyser node for visuals, and WAV recording
 */

class MetalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private destNode: MediaStreamAudioDestinationNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  // Distortion curve cache
  private distortionCurve: Float32Array | null = null;

  // Sequencer state
  private isPlaying: boolean = false;
  private currentStep: number = 0;
  private timerId: number | null = null;
  private tempo: number = 145;
  private riffSequence: number[] = [0, 0, 0, 1, 0, 0, 3, 0];
  private drumPattern: string = 'polyrhythm_djent';
  private tuningRootFreq: number = 41.2; // E1 (Drop E)
  private onStepCallback: ((step: number) => void) | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;

      this.destNode = this.ctx.createMediaStreamDestination();

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.analyser.connect(this.destNode);

      this.initDistortionCurve(55);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initDistortionCurve(k: number = 50) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // High gain soft-clipping with asymmetrical tube saturation
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    this.distortionCurve = curve;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setTuning(tuningStr: string) {
    // Map tuning string to lowest fundamental frequency
    const t = tuningStr.toLowerCase();
    if (t.includes('drop e') || t.includes('8-string') || t.includes('double drop e')) {
      this.tuningRootFreq = 41.2; // E1
    } else if (t.includes('drop f') || t.includes('drop f#')) {
      this.tuningRootFreq = 43.65; // F1
    } else if (t.includes('drop g')) {
      this.tuningRootFreq = 49.0; // G1
    } else if (t.includes('drop a')) {
      this.tuningRootFreq = 55.0; // A1
    } else if (t.includes('drop b') || t.includes('drop c')) {
      this.tuningRootFreq = 65.4; // C2
    } else {
      this.tuningRootFreq = 46.25; // F#1
    }
  }

  // --- GUITAR SYNTHESIS ---
  public playGuitarChug(fret: number = 0, isMuted: boolean = true, duration: number = 0.22) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Calculate frequency based on fret
    // Semitone calculation: f = root * 2^(fret / 12)
    const baseFreq = this.tuningRootFreq * Math.pow(2, fret / 12);

    // 2 Detuned Sawtooth Oscillators for huge thickness
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    subOsc.type = 'square'; // sub rumble

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * 1.008, now); // slight detune
    subOsc.frequency.setValueAtTime(baseFreq * 0.5, now); // 1 octave down

    // Pre-distortion overdrive gain (Tube Screamer boost)
    const driveGain = this.ctx.createGain();
    driveGain.gain.setValueAtTime(6.0, now);

    // Pre-EQ Highpass to cut muddy flub before clipping
    const preHP = this.ctx.createBiquadFilter();
    preHP.type = 'highpass';
    preHP.frequency.setValueAtTime(110, now);

    // Pre-EQ Mid Boost (Tubescreamer 1.4kHz hump for pick snap)
    const preBoost = this.ctx.createBiquadFilter();
    preBoost.type = 'peaking';
    preBoost.frequency.setValueAtTime(1400, now);
    preBoost.Q.setValueAtTime(1.5, now);
    preBoost.gain.setValueAtTime(8, now);

    // Distortion Waveshaper
    const distortion = this.ctx.createWaveShaper();
    if (this.distortionCurve) {
      distortion.curve = this.distortionCurve as any;
    }
    distortion.oversample = '4x';

    // Post-Distortion Cab Simulation Filter (Mesa 4x12 cab)
    const cabLowPass = this.ctx.createBiquadFilter();
    cabLowPass.type = 'lowpass';
    cabLowPass.frequency.setValueAtTime(isMuted ? 3800 : 4800, now);
    cabLowPass.Q.setValueAtTime(2.0, now);

    const cabResonance = this.ctx.createBiquadFilter();
    cabResonance.type = 'peaking';
    cabResonance.frequency.setValueAtTime(95, now); // low-end cab thud
    cabResonance.gain.setValueAtTime(6, now);

    // Volume Envelope (Palm Mute vs Open Ring)
    const envGain = this.ctx.createGain();
    envGain.gain.setValueAtTime(0.0001, now);
    envGain.gain.linearRampToValueAtTime(0.9, now + 0.005);

    if (isMuted) {
      // Tight percussive palm mute
      envGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration, 0.28));
    } else {
      // Open ringing power chord
      envGain.gain.exponentialRampToValueAtTime(0.3, now + 0.35);
      envGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.6);
    }

    // Connect audio chain
    osc1.connect(driveGain);
    osc2.connect(driveGain);
    subOsc.connect(driveGain);

    driveGain.connect(preHP);
    preHP.connect(preBoost);
    preBoost.connect(distortion);
    distortion.connect(cabLowPass);
    cabLowPass.connect(cabResonance);
    cabResonance.connect(envGain);
    envGain.connect(this.masterGain);

    const stopTime = isMuted ? now + duration + 0.1 : now + duration + 0.8;
    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);

    osc1.stop(stopTime);
    osc2.stop(stopTime);
    subOsc.stop(stopTime);
  }

  // --- PINCH HARMONIC (SQUEAL) ---
  public playPinchHarmonic(fret: number = 3) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const baseFreq = this.tuningRootFreq * Math.pow(2, fret / 12);
    // Harmonics 2.5x to 4x frequency
    const squealFreq = baseFreq * 4.2;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(squealFreq, now);

    // Vibrato LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(6.5, now); // 6.5 Hz heavy vibrato
    lfoGain.gain.setValueAtTime(45, now);
    lfo.connect(osc.frequency);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(squealFreq * 1.2, now);
    filter.Q.setValueAtTime(8.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.8);
    osc.stop(now + 0.8);
  }

  // --- PICK SCRAPE ---
  public playPickScrape() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Buffer with filtered white noise
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4500, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.4); // scrape downward
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // --- SUB BASS DROP (808 BOMB) ---
  public playSubDrop() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    // Frequency sweeps from 95Hz down to 26Hz
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 1.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.95, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  // --- DRUMS: DOUBLE KICK ---
  public playKick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sub thump
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    // Beater click (high transient for fast metal kick definition)
    const clickOsc = this.ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(3200, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.5, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    clickOsc.connect(clickGain);

    gain.connect(this.masterGain);
    clickGain.connect(this.masterGain);

    osc.start(now);
    clickOsc.start(now);
    osc.stop(now + 0.18);
    clickOsc.stop(now + 0.03);
  }

  // --- DRUMS: HIGH-TUNED BRASS / PICCOLO SNARE ---
  public playSnare() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Snare tone body (high crack 220Hz -> 140Hz)
    const tone = this.ctx.createOscillator();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(220, now);
    tone.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    const toneGain = this.ctx.createGain();
    toneGain.gain.setValueAtTime(0.7, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    // Snare rattle / noise crack
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    tone.connect(toneGain);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    toneGain.connect(this.masterGain);
    noiseGain.connect(this.masterGain);

    tone.start(now);
    noise.start(now);
    tone.stop(now + 0.14);
  }

  // --- DRUMS: TRASHY CHINA CYMBAL (FOR BREAKDOWN ACCENTS) ---
  public playChina() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Metallic dissonant square waves
    const frequencies = [340, 520, 830, 1150, 1720];
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(4200, now);
    bandpass.Q.setValueAtTime(1.8, now);

    frequencies.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now);
      osc.connect(bandpass);
      osc.start(now);
      osc.stop(now + 0.7);
    });

    // Add white noise wash
    const bufferSize = this.ctx.sampleRate * 0.65;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseHP = this.ctx.createBiquadFilter();
    noiseHP.type = 'highpass';
    noiseHP.frequency.setValueAtTime(6000, now);

    noise.connect(noiseHP);
    noiseHP.connect(gain);

    bandpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // --- DRUMS: HI-HAT ---
  public playHiHat(open: boolean = false) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const duration = open ? 0.35 : 0.05;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // --- VOCAL SYNTH: BLEGH! CALLOUT ---
  public playBlegh() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Pitch sweep downwards ("BLEEEEEGH!")
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

    // Formant filter (Throat resonance)
    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.setValueAtTime(950, now);
    formant.Q.setValueAtTime(3.5, now);

    // Harsh rasp noise
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(formant);
    formant.connect(gain);
    noise.connect(formant);
    gain.connect(this.masterGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.36);
  }

  // --- VOCAL CALLOUT WITH SPEECH SYNTHESIS FALLBACK ---
  public speakCallout(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.2; // Low demon guttural pitch
      utterance.rate = 1.35; // Fast aggressive bark
      window.speechSynthesis.speak(utterance);
    } else {
      this.playBlegh();
    }
  }

  // --- SEQUENCER ENGINE ---
  public startTrack(
    bpm: number,
    sequence: number[],
    pattern: string,
    onStep?: (step: number) => void
  ) {
    this.init();
    this.stopTrack();

    this.tempo = bpm;
    this.riffSequence = sequence.length > 0 ? sequence : [0, 0, 0, 1, 0, 0, 3, 0];
    this.drumPattern = pattern;
    this.onStepCallback = onStep || null;
    this.isPlaying = true;
    this.currentStep = 0;

    // Calculate step interval (16th notes: (60 / bpm) / 4)
    // For 8th notes: (60 / bpm) / 2
    const intervalMs = ((60 / this.tempo) / 4) * 1000;

    this.timerId = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  public stopTrack() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    this.currentStep = 0;
    if (this.onStepCallback) {
      this.onStepCallback(0);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private tick() {
    const seqLength = this.riffSequence.length;
    const step = this.currentStep % (seqLength * 2); // 32 or 16 step loop
    const riffIndex = this.currentStep % seqLength;
    const currentFret = this.riffSequence[riffIndex];

    if (this.onStepCallback) {
      this.onStepCallback(this.currentStep % seqLength);
    }

    // Play guitar riff step
    // Only play on active steps (some can be rests if negative)
    if (currentFret >= 0) {
      const isMuted = currentFret <= 2;
      this.playGuitarChug(currentFret, isMuted, (60 / this.tempo) * 0.4);
    }

    // Play drum pattern
    const s = this.currentStep % 16;
    if (this.drumPattern === 'blast_beat') {
      // Machine gun blast beats: kick and snare alternate rapidly on every 16th
      if (s % 2 === 0) {
        this.playKick();
        this.playHiHat(false);
      } else {
        this.playSnare();
      }
      if (s === 0) this.playChina();
    } else if (this.drumPattern === 'breakdown') {
      // Half-time breakdown: China and kick lock with 0-0-0 chugs
      if (currentFret === 0) {
        this.playKick();
      }
      if (s % 4 === 0) {
        this.playChina();
      }
      if (s === 8) {
        this.playSnare();
      }
      // Occasional sub-drop on measure 0
      if (this.currentStep % 32 === 0) {
        this.playSubDrop();
      }
    } else if (this.drumPattern === 'two_step') {
      // Hardcore two-step bouncing groove
      if (s === 0 || s === 6 || s === 10) this.playKick();
      if (s === 4 || s === 12) this.playSnare();
      if (s % 2 === 0) this.playHiHat(false);
      if (s === 0) this.playChina();
    } else if (this.drumPattern === 'half_time_slam') {
      // Guttural slow slam
      if (s === 0 || s === 3 || s === 8 || s === 11) this.playKick();
      if (s === 8) this.playSnare();
      if (s % 4 === 0) this.playChina();
    } else {
      // polyrhythm_djent
      if (currentFret >= 0) {
        this.playKick();
      }
      if (s % 4 === 0) {
        this.playHiHat(true);
      }
      if (s === 8) {
        this.playSnare();
      }
      if (s === 0 && Math.random() > 0.4) {
        this.playChina();
      }
    }

    this.currentStep++;
  }

  // --- RECORDING & WAV EXPORT ---
  public startRecording() {
    this.init();
    if (!this.destNode) return;
    this.recordedChunks = [];
    try {
      this.mediaRecorder = new MediaRecorder(this.destNode.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.start(100);
    } catch (e) {
      console.error('MediaRecorder not supported:', e);
    }
  }

  public stopRecordingAndDownload(filename: string = 'breakdown-riff.webm') {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    this.mediaRecorder.stop();
  }
}

export const metalSynth = new MetalAudioEngine();
