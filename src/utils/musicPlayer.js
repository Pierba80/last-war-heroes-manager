class MusicController {
  constructor() {
    this.audio = null;
    this.ctx = null;
    this.interval = null;
    this.isPlaying = false;
  }

  async start() {
    if (this.isPlaying) return true;

    // 1. Try playing custom /music.mp3 from public folder first
    try {
      if (!this.audio) {
        this.audio = new Audio('/music.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.35;
      }
      await this.audio.play();
      this.isPlaying = true;
      return true;
    } catch (e) {
      // Fallback to built-in ambient synth if /music.mp3 is not present
    }

    // 2. Built-in soft sci-fi ambient background music
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const notes = [110, 130.81, 164.81, 196, 164.81, 130.81];
      let step = 0;

      const playNote = () => {
        if (!this.ctx || !this.isPlaying) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[step % notes.length];

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
        step += 1;
      };

      this.isPlaying = true;
      playNote();
      this.interval = setInterval(playNote, 1600);
      return true;
    } catch (err) {
      this.isPlaying = false;
      return false;
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const musicPlayer = new MusicController();
    
