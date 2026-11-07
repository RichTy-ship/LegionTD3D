// Studio-Grade Multi-Layered Procedural Web Audio Engine & Dynamic Ambient Soundtrack
// Zero external asset dependencies; uses physical-modeling synthesis, filtered noise transients,
// stereo convolution cathedral reverb, dynamics compression, and adaptive phase ambience.

import { KingSkillKey } from './types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private reverbSendGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private convolver: ConvolverNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public muted: boolean = false;
  public musicEnabled: boolean = true;
  public sfxVolume: number = 0.8;
  public musicVolume: number = 0.38;

  private currentPhase: 'BUILD' | 'BATTLE' | 'SUMMARY' | 'TITLE' = 'TITLE';
  private ambientTimerId: number | null = null;
  private ambientStep: number = 0;
  private lastStepSoundTime: number = 0;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupAudioGraph(this.ctx);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private setupAudioGraph(ctx: AudioContext): void {
    // Master Dynamics Compressor for studio punch & clipping protection
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-14, ctx.currentTime);
    comp.knee.setValueAtTime(18, ctx.currentTime);
    comp.ratio.setValueAtTime(4, ctx.currentTime);
    comp.attack.setValueAtTime(0.004, ctx.currentTime);
    comp.release.setValueAtTime(0.18, ctx.currentTime);
    comp.connect(ctx.destination);
    this.compressor = comp;

    // Master Gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(this.muted ? 0 : 0.9, ctx.currentTime);
    master.connect(comp);
    this.masterGain = master;

    // SFX Bus (Dry)
    const sfx = ctx.createGain();
    sfx.gain.setValueAtTime(this.sfxVolume, ctx.currentTime);
    sfx.connect(master);
    this.sfxGain = sfx;

    // Procedural Stereo Cathedral Reverb (Impulse Response)
    const convolver = ctx.createConvolver();
    convolver.buffer = this.createImpulseResponse(ctx, 1.45, 3.2);
    const reverbSend = ctx.createGain();
    reverbSend.gain.setValueAtTime(0.28, ctx.currentTime);
    sfx.connect(reverbSend);
    reverbSend.connect(convolver);
    convolver.connect(master);
    this.convolver = convolver;
    this.reverbSendGain = reverbSend;

    // Ambient Music Bus
    const music = ctx.createGain();
    music.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, ctx.currentTime);
    music.connect(master);
    const musicReverbSend = ctx.createGain();
    musicReverbSend.gain.setValueAtTime(0.45, ctx.currentTime);
    music.connect(musicReverbSend);
    musicReverbSend.connect(convolver);
    this.musicGain = music;

    // Shared 2-second Stereo Pink/White Filtered Noise Buffer for physical transients
    this.noiseBuffer = this.createNoiseBuffer(ctx, 2.0);
  }

  private createImpulseResponse(
    ctx: AudioContext,
    durationSeconds: number,
    decayRate: number
  ): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * durationSeconds);
    const impulse = ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const env = Math.pow(1 - t, decayRate);
        const white = Math.random() * 2 - 1;
        // Warm low-passed hall reflection
        lastOut = (lastOut + 0.14 * white) / 1.14;
        data[i] = lastOut * env * 1.8;
      }
    }
    return impulse;
  }

  private createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Hybrid pink/white noise for natural percussive/wind texture
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.35) * 0.65;
    }
    return buffer;
  }

  public setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.02);
    }
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(
        this.musicEnabled && !this.muted ? this.musicVolume : 0,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.9, this.ctx.currentTime, 0.02);
    }
    if (this.muted) {
      this.stopAmbientLoop();
    } else if (this.musicEnabled && this.currentPhase !== 'TITLE') {
      this.startAmbientLoop();
    }
    return this.muted;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(
        this.musicEnabled && !this.muted ? this.musicVolume : 0,
        this.ctx.currentTime,
        0.06
      );
    }
    if (this.musicEnabled && !this.muted) {
      this.startAmbientLoop();
    } else {
      this.stopAmbientLoop();
    }
    return this.musicEnabled;
  }

  public syncAmbientPhase(
    phase: 'BUILD' | 'BATTLE' | 'SUMMARY' | 'TITLE',
    isPlaying: boolean
  ): void {
    this.currentPhase = phase;
    if (!isPlaying || this.muted || !this.musicEnabled || phase === 'TITLE') {
      this.stopAmbientLoop();
      return;
    }
    if (this.ambientTimerId === null) {
      this.startAmbientLoop();
    }
  }

  private startAmbientLoop(): void {
    if (typeof window === 'undefined' || this.ambientTimerId !== null) return;
    this.ambientTimerId = window.setInterval(() => {
      if (this.muted || !this.musicEnabled || this.currentPhase === 'TITLE') return;
      this.playAmbientPulse();
    }, 2200);
  }

  private stopAmbientLoop(): void {
    if (this.ambientTimerId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.ambientTimerId);
      this.ambientTimerId = null;
    }
  }

  private playAmbientPulse(): void {
    const ctx = this.getContext();
    if (!ctx || !this.musicGain) return;
    const now = ctx.currentTime;
    const step = this.ambientStep++ % 4;

    if (this.currentPhase === 'BUILD') {
      // Calm, mystical dark-fantasy sanctuary pad (D Dorian / Aeolian warm fifths)
      const roots = [146.83, 130.81, 164.81, 110.0]; // D3, C3, E3, A2
      const root = roots[step];
      this.triggerFilteredPadVoice(ctx, this.musicGain, root, root * 1.498, 2.4, 0.08, 520, now);
    } else if (this.currentPhase === 'BATTLE') {
      // Tense tactical war-pulse (deep sub-bass heartbeat + low brass harmonic)
      const roots = [73.42, 65.41, 82.41, 77.78]; // D2, C2, E2, Eb2
      const root = roots[step];
      this.triggerFilteredPadVoice(ctx, this.musicGain, root, root * 2.0, 1.8, 0.11, 680, now);
      // Soft distant war-drum pulse on downbeats
      this.triggerSubImpact(ctx, this.musicGain, 95, 36, 0.32, 0.14, now);
      if (step % 2 === 1) {
        this.triggerSubImpact(ctx, this.musicGain, 85, 34, 0.25, 0.09, now + 0.55);
      }
    }
  }

  // ==================== LOW-LEVEL STUDIO SYNTHESIS PRIMITIVES ====================

  private triggerSubImpact(
    ctx: AudioContext,
    dest: AudioNode,
    startFreq: number,
    endFreq: number,
    duration: number,
    gainAmount: number,
    startTime: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainAmount, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  private triggerNoiseBurst(
    ctx: AudioContext,
    dest: AudioNode,
    filterType: BiquadFilterType,
    startCutoff: number,
    endCutoff: number,
    qFactor: number,
    duration: number,
    gainAmount: number,
    startTime: number,
    attackTime: number = 0.005
  ): void {
    if (!this.noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.setValueAtTime(qFactor, startTime);
    filter.frequency.setValueAtTime(startCutoff, startTime);
    if (endCutoff !== startCutoff) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(40, endCutoff),
        startTime + duration
      );
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainAmount, startTime + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    const randomOffset = Math.random() * 0.6;
    src.start(startTime, randomOffset, duration + 0.02);
  }

  private triggerWarmVoice(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    endFreq: number,
    duration: number,
    gainAmount: number,
    cutoffHz: number,
    startTime: number,
    waveform: OscillatorType = 'triangle',
    attackTime: number = 0.01
  ): void {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(25, endFreq), startTime + duration);
    }

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(1.8, startTime);
    filter.frequency.setValueAtTime(cutoffHz, startTime);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(120, cutoffHz * 0.35),
      startTime + duration
    );

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainAmount, startTime + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  private triggerBellChime(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    duration: number,
    gainAmount: number,
    startTime: number
  ): void {
    // Fundamental + harmonic crystal overtone for authentic metallic/arcane chime
    const ratios = [1.0, 2.0, 2.997];
    const amps = [1.0, 0.38, 0.16];
    ratios.forEach((ratio, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * ratio, startTime);

      const partialDur = duration / (1 + idx * 0.45);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainAmount * amps[idx], startTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + partialDur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(startTime);
      osc.stop(startTime + partialDur + 0.02);
    });
  }

  private triggerFilteredPadVoice(
    ctx: AudioContext,
    dest: AudioNode,
    freq1: number,
    freq2: number,
    duration: number,
    gainAmount: number,
    cutoffHz: number,
    startTime: number
  ): void {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffHz * 0.5, startTime);
    filter.frequency.linearRampToValueAtTime(cutoffHz, startTime + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(cutoffHz * 0.35, startTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainAmount, startTime + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    filter.connect(gain);
    gain.connect(dest);

    [freq1, freq2].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? 'triangle' : 'sawtooth';
      osc.detune.setValueAtTime(idx === 0 ? -6 : 6, startTime);
      osc.frequency.setValueAtTime(f, startTime);
      osc.connect(filter);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  // ==================== HIGH-LEVEL GAME SOUND EFFECTS ====================

  public playUiClick(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Tactile modern dark-fantasy Slate/Obsidian click (no 8-bit beep)
    this.triggerSubImpact(ctx, this.sfxGain, 220, 75, 0.032, 0.12, now);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 1850, 950, 4.5, 0.022, 0.07, now, 0.002);
  }

  public playHeroStep(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const nowMs = performance.now();
    if (nowMs - this.lastStepSoundTime < 260) return;
    this.lastStepSoundTime = nowMs;

    const now = ctx.currentTime;
    // Soft armored sabaton step + subtle plate resonance
    this.triggerSubImpact(ctx, this.sfxGain, 105, 42, 0.065, 0.11, now);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 1650, 1100, 3.8, 0.038, 0.045, now, 0.003);
  }

  public playPlaceFighter(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // 1. Heavy tactical tile lock sub-bass thud
    this.triggerSubImpact(ctx, this.sfxGain, 135, 44, 0.16, 0.34, now);
    // 2. Forged armor clink transient
    this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 2400, 1100, 5.0, 0.075, 0.14, now, 0.003);
    // 3. Warm heroic fifth chord (D4 + A4)
    this.triggerWarmVoice(ctx, this.sfxGain, 293.66, 293.66, 0.24, 0.14, 1800, now + 0.015, 'triangle');
    this.triggerBellChime(ctx, this.sfxGain, 440.0, 0.32, 0.12, now + 0.035);
  }

  public playUpgradeFighter(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Deep forge anvil swell + ascending harmonic bell arpeggio (D Major9 ascension)
    this.triggerSubImpact(ctx, this.sfxGain, 110, 55, 0.38, 0.32, now);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'highpass', 1800, 4200, 2.0, 0.28, 0.09, now, 0.03);
    const notes = [293.66, 369.99, 440.0, 587.33, 739.99]; // D4, F#4, A4, D5, F#5
    notes.forEach((freq, idx) => {
      this.triggerBellChime(ctx, this.sfxGain!, freq, 0.42, 0.12, now + idx * 0.052);
    });
  }

  public playSellFighter(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Warm leather pouch thud + 4 authentic metallic gold coin chimes
    this.triggerSubImpact(ctx, this.sfxGain, 150, 62, 0.12, 0.22, now);
    const coinFreqs = [2480, 3120, 2860, 3640];
    coinFreqs.forEach((freq, idx) => {
      const t = now + idx * 0.042;
      this.triggerBellChime(ctx, this.sfxGain!, freq, 0.16, 0.085, t);
    });
  }

  public playHireWorker(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Clockwork steam-piston release + Mythium pickaxe anvil ring
    this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 950, 2600, 3.2, 0.18, 0.14, now, 0.015);
    this.triggerSubImpact(ctx, this.sfxGain, 125, 52, 0.14, 0.24, now);
    this.triggerBellChime(ctx, this.sfxGain, 392.0, 0.26, 0.13, now + 0.03); // G4
    this.triggerBellChime(ctx, this.sfxGain, 587.33, 0.34, 0.14, now + 0.09); // D5
  }

  public playSendMercenary(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Deep war-drum taiko strike + ominous low brass horn fifth
    this.triggerSubImpact(ctx, this.sfxGain, 145, 36, 0.32, 0.42, now);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'lowpass', 950, 220, 2.5, 0.16, 0.18, now, 0.004);
    this.triggerWarmVoice(ctx, this.sfxGain, 110.0, 108.0, 0.42, 0.16, 680, now + 0.02, 'sawtooth', 0.04);
    this.triggerWarmVoice(ctx, this.sfxGain, 164.81, 162.0, 0.42, 0.13, 820, now + 0.03, 'sawtooth', 0.04);
  }

  public playWaveStart(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Double Taiko War-Drum Impact
    this.triggerSubImpact(ctx, this.sfxGain, 155, 34, 0.42, 0.48, now);
    this.triggerSubImpact(ctx, this.sfxGain, 135, 32, 0.48, 0.38, now + 0.18);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 1400, 420, 2.2, 0.32, 0.18, now, 0.008);

    // Cinematic Low-Brass War-Horn Braaam (D2 + A2 + D3 detuned chorus with filter swell)
    const hornNotes = [73.42, 110.0, 146.83];
    hornNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.detune.setValueAtTime((idx - 1) * 8, now + 0.03);
      osc.frequency.setValueAtTime(freq * 0.98, now + 0.03);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.18);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(2.6, now + 0.03);
      filter.frequency.setValueAtTime(180, now + 0.03);
      filter.frequency.exponentialRampToValueAtTime(980, now + 0.38);
      filter.frequency.exponentialRampToValueAtTime(240, now + 0.92);

      gain.gain.setValueAtTime(0.0001, now + 0.03);
      gain.gain.linearRampToValueAtTime(0.14 / (1 + idx * 0.25), now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + 0.03);
      osc.stop(now + 0.98);
    });
  }

  public playKingSkill(skillKey: KingSkillKey): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;

    if (skillKey === 'Q') {
      // [Q] Royal Cleave: Heavy greatsword air-slash whoosh + solar plasma impact
      this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 520, 2400, 3.0, 0.22, 0.26, now, 0.015);
      this.triggerSubImpact(ctx, this.sfxGain, 175, 42, 0.26, 0.42, now + 0.04);
      this.triggerWarmVoice(ctx, this.sfxGain, 293.66, 146.83, 0.28, 0.18, 1600, now + 0.02, 'sawtooth', 0.01);
      this.triggerBellChime(ctx, this.sfxGain, 587.33, 0.28, 0.14, now + 0.04);
    } else if (skillKey === 'E') {
      // [E] Sovereign Aegis: Crystalline barrier resonance chord + angelic shimmer
      this.triggerSubImpact(ctx, this.sfxGain, 120, 58, 0.35, 0.28, now);
      this.triggerNoiseBurst(ctx, this.sfxGain, 'highpass', 2200, 5200, 2.5, 0.32, 0.1, now, 0.02);
      const chord = [349.23, 440.0, 523.25, 659.25]; // F Major7 Sanctuary Chord
      chord.forEach((freq, idx) => {
        this.triggerBellChime(ctx, this.sfxGain!, freq, 0.55, 0.12, now + idx * 0.035);
      });
    } else {
      // [R] Cataclysm Judgment: Orbital meteor whistle -> seismic detonation -> thunder rumble
      this.triggerWarmVoice(ctx, this.sfxGain, 880, 110, 0.24, 0.16, 2200, now, 'sine', 0.01);
      this.triggerSubImpact(ctx, this.sfxGain, 180, 26, 0.65, 0.55, now + 0.14);
      this.triggerNoiseBurst(ctx, this.sfxGain, 'lowpass', 1400, 180, 1.8, 0.62, 0.34, now + 0.14, 0.01);
      this.triggerBellChime(ctx, this.sfxGain, 220.0, 0.6, 0.16, now + 0.15);
      this.triggerBellChime(ctx, this.sfxGain, 329.63, 0.6, 0.14, now + 0.18);
    }
  }

  public playSpellCast(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Arcane Legion Spell Invocation: Sweeping energy vortex + harmonic triad
    this.triggerSubImpact(ctx, this.sfxGain, 140, 48, 0.42, 0.35, now);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'bandpass', 600, 3200, 3.5, 0.42, 0.16, now, 0.04);
    const triad = [329.63, 415.3, 493.88, 659.25]; // E Major triad
    triad.forEach((freq, idx) => {
      this.triggerBellChime(ctx, this.sfxGain!, freq, 0.5, 0.13, now + idx * 0.045);
    });
  }

  public playVictory(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Grand Orchestral Brass & Cathedral Bell Fanfare
    this.triggerSubImpact(ctx, this.sfxGain, 150, 40, 0.55, 0.45, now);
    this.triggerSubImpact(ctx, this.sfxGain, 140, 38, 0.65, 0.45, now + 0.48);

    const chords = [
      { time: 0.0, notes: [293.66, 369.99, 440.0] }, // D Major
      { time: 0.18, notes: [392.0, 493.88, 587.33] }, // G Major
      { time: 0.34, notes: [440.0, 554.37, 659.25] }, // A Major
      { time: 0.52, notes: [293.66, 440.0, 587.33, 739.99, 880.0] }, // Grand D Major Finale
    ];

    chords.forEach((c, cIdx) => {
      const dur = cIdx === chords.length - 1 ? 0.95 : 0.24;
      c.notes.forEach((freq) => {
        this.triggerWarmVoice(
          ctx,
          this.sfxGain!,
          freq,
          freq,
          dur,
          0.11,
          1900,
          now + c.time,
          'sawtooth',
          0.02
        );
        this.triggerBellChime(ctx, this.sfxGain!, freq, dur * 1.1, 0.08, now + c.time);
      });
    });
  }

  public playDefeat(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    // Somber Dark-Fantasy Citadel Collapse Toll
    this.triggerSubImpact(ctx, this.sfxGain, 130, 28, 0.85, 0.48, now);
    this.triggerNoiseBurst(ctx, this.sfxGain, 'lowpass', 850, 140, 2.0, 0.75, 0.22, now, 0.02);

    const descent = [
      { time: 0.0, freq: 293.66 }, // D4
      { time: 0.22, freq: 261.63 }, // C4
      { time: 0.44, freq: 233.08 }, // Bb3
      { time: 0.68, freq: 146.83 }, // D3
    ];
    descent.forEach((d, idx) => {
      const dur = idx === descent.length - 1 ? 0.95 : 0.32;
      this.triggerWarmVoice(
        ctx,
        this.sfxGain!,
        d.freq,
        d.freq * 0.97,
        dur,
        0.16,
        900,
        now + d.time,
        'triangle',
        0.025
      );
      this.triggerBellChime(ctx, this.sfxGain!, d.freq * 0.5, dur, 0.1, now + d.time);
    });
  }
}

export const sound = new SoundManager();
export const soundFX = sound;

