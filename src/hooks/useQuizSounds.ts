import { useCallback, useRef } from "react";

const getAudioContext = (() => {
  let ctx: AudioContext | null = null;
  return () => {
    if (!ctx || ctx.state === "closed") {
      ctx = new AudioContext();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
})();

export function useQuizSounds() {
  const pulseOsc = useRef<OscillatorNode | null>(null);
  const pulseGain = useRef<GainNode | null>(null);

  const playClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }, []);

  const playSwoosh = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      filter.Q.value = 2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(ctx.currentTime);
    } catch {}
  }, []);

  const playDataPulse = useCallback((progress: number) => {
    try {
      const ctx = getAudioContext();
      const freq = 80 + (progress / 100) * 120;
      const vol = 0.03 + (progress / 100) * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, []);

  return { playClick, playSwoosh, playDataPulse };
}
