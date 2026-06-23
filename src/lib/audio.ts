/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    // Resume context if suspended (browser security policy)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCoin() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Nice retro coin sound: quick low note followed by clear high note
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playSuccess() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Happy triad arpeggio
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  playFailure() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Cartoon sliding down sound
    osc.frequency.setValueAtTime(330, now); // E4
    osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.3); // E3

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  playLevelUp() {
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Layered synth trumpet
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);
      osc.frequency.setValueAtTime(freq * 2, now + index * 0.06 + 0.2); // octave jump

      gain.gain.setValueAtTime(0.05, now + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.7);
    });
  }
}

export const sfx = new AudioEngine();
