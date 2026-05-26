class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private initCtx() {
    if (this.muted) return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted && this.ctx) {
      this.ctx.suspend().catch(() => {});
    } else if (!this.muted && this.ctx) {
      this.ctx.resume().catch(() => {});
    }
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(1000, t + 0.05);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch (e) {
      console.warn("Failed to play audio:", e);
    }
  }

  public playTick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, t);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch (e) {
      console.warn(e);
    }
  }

  public playCardFlip() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Simulate card rustling noise using a quick sweep and white noise
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.15; // 150ms buffer
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Populate buffer with noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseNode.start(t);
      noiseNode.stop(t + 0.16);
    } catch (e) {
      console.warn(e);
    }
  }

  public playCorrect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      
      // Play a beautiful, shiny major chord arpeggio (C major: C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, idx) => {
        const noteTime = t + idx * 0.08;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0, noteTime);
        gain.gain.linearRampToValueAtTime(0.05, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  public playIncorrect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Dissonant low synthesizer tone (A2 + Bb2)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(110.0, t); // A2
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(116.54, t); // Bb2

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, t);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.5);
      osc2.stop(t + 0.5);
    } catch (e) {
      console.warn(e);
    }
  }

  public playBomb() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const duration = 1.0;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brownian/white noise for the blast
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // boost volume
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // Lowpass filter sweeps down during explosion
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, t);
      filter.frequency.exponentialRampToValueAtTime(80, t + duration);

      // Add a low sub frequency wave for impact rumble
      const oscSub = this.ctx.createOscillator();
      const gainSub = this.ctx.createGain();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(100, t);
      oscSub.frequency.exponentialRampToValueAtTime(30, t + 0.5);
      gainSub.gain.setValueAtTime(0.2, t);
      gainSub.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      oscSub.connect(gainSub);
      gainSub.connect(this.ctx.destination);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.linearRampToValueAtTime(0.20, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseNode.start(t);
      oscSub.start(t);
      noiseNode.stop(t + duration);
      oscSub.stop(t + 0.5);
    } catch (e) {
      console.warn(e);
    }
  }

  public playNuclear() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // High-pitched warning klaxon siren (oscillates between 600Hz and 800Hz)
      const duration = 2.0;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, t);
      
      // LFO modulation for siren effect
      for (let timeOffset = 0; timeOffset < duration; timeOffset += 0.25) {
        osc.frequency.setValueAtTime(600, t + timeOffset);
        osc.frequency.linearRampToValueAtTime(850, t + timeOffset + 0.12);
        osc.frequency.linearRampToValueAtTime(600, t + timeOffset + 0.25);
      }

      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.1);
      gain.gain.setValueAtTime(0.06, t + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  public playVictory() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Synthesize a retro 8-bit brass fanfare
      const notes = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 523.25, d: 0.15 }, // C5
        { f: 523.25, d: 0.15 }, // C5
        { f: 523.25, d: 0.40 }, // C5 (long)
        { f: 415.30, d: 0.40 }, // Ab4
        { f: 466.16, d: 0.40 }, // Bb4
        { f: 523.25, d: 0.80 }, // C5 (triumphant)
      ];

      let elapsed = 0;
      notes.forEach((note) => {
        const noteTime = t + elapsed;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, noteTime);

        gain.gain.setValueAtTime(0.0, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + note.d + 0.05);

        elapsed += note.d + 0.02;
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export const sounds = new SoundManager();
