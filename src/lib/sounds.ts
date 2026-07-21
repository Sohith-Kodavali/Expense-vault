"use client";

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function note(c: AudioContext, freq: number, start: number, dur: number, vol = 0.25, type: OscillatorType = "sine") {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(start);
  o.stop(start + dur);
}

function noise(c: AudioContext, start: number, dur: number, vol = 0.1) {
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(2000, start);
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  src.start(start);
  src.stop(start + dur);
}

export function playSound(type: "success" | "error" | "click" | "delete" | "receive" | "warning" | "pin" | "fav" | "budget" | "open" | "close" | "whoosh" | "achievement") {
  try {
    const c = ctx();
    const t = c.currentTime;
    const baseVol = 0.35;

    switch (type) {
      case "success":
        note(c, 523, t, 0.15, baseVol);
        note(c, 659, t + 0.08, 0.15, baseVol * 0.8);
        note(c, 784, t + 0.16, 0.2, baseVol * 0.7);
        note(c, 1047, t + 0.22, 0.4, baseVol * 0.6, "triangle");
        break;

      case "receive":
        note(c, 440, t, 0.12, baseVol);
        note(c, 554, t + 0.06, 0.12, baseVol * 0.8);
        note(c, 659, t + 0.12, 0.12, baseVol * 0.7);
        note(c, 880, t + 0.18, 0.12, baseVol * 0.6);
        note(c, 1100, t + 0.24, 0.25, baseVol * 0.5, "triangle");
        noise(c, t + 0.35, 0.15, 0.04);
        break;

      case "achievement":
        note(c, 523, t, 0.1, baseVol);
        note(c, 659, t + 0.1, 0.1, baseVol);
        note(c, 784, t + 0.2, 0.1, baseVol);
        note(c, 1047, t + 0.3, 0.5, baseVol * 0.8, "triangle");
        noise(c, t + 0.45, 0.2, 0.05);
        break;

      case "error":
        note(c, 300, t, 0.1, baseVol * 0.6, "square");
        note(c, 200, t + 0.1, 0.15, baseVol * 0.5, "square");
        break;

      case "click":
        note(c, 1200, t, 0.05, baseVol * 0.5, "sine");
        break;

      case "delete":
        note(c, 400, t, 0.15, baseVol * 0.6, "triangle");
        note(c, 200, t + 0.1, 0.2, baseVol * 0.4, "triangle");
        noise(c, t, 0.2, 0.04);
        break;

      case "warning":
        note(c, 500, t, 0.15, baseVol * 0.5, "sawtooth");
        note(c, 400, t + 0.15, 0.15, baseVol * 0.5, "sawtooth");
        note(c, 500, t + 0.3, 0.2, baseVol * 0.5, "sawtooth");
        break;

      case "pin":
        note(c, 800, t, 0.06, baseVol * 0.4, "sine");
        note(c, 1200, t + 0.06, 0.1, baseVol * 0.3, "sine");
        break;

      case "fav":
        note(c, 600, t, 0.06, baseVol * 0.4, "triangle");
        note(c, 900, t + 0.06, 0.06, baseVol * 0.35, "triangle");
        note(c, 1200, t + 0.12, 0.12, baseVol * 0.3, "triangle");
        break;

      case "budget":
        note(c, 330, t, 0.12, baseVol * 0.5, "sine");
        note(c, 440, t + 0.12, 0.12, baseVol * 0.4, "sine");
        note(c, 550, t + 0.24, 0.2, baseVol * 0.35, "triangle");
        break;

      case "open":
        note(c, 300, t, 0.08, baseVol * 0.3, "sine");
        note(c, 500, t + 0.06, 0.08, baseVol * 0.25, "sine");
        note(c, 700, t + 0.12, 0.12, baseVol * 0.2, "sine");
        break;

      case "close":
        note(c, 700, t, 0.08, baseVol * 0.25, "sine");
        note(c, 500, t + 0.06, 0.08, baseVol * 0.2, "sine");
        note(c, 300, t + 0.12, 0.12, baseVol * 0.15, "sine");
        break;

      case "whoosh":
        noise(c, t, 0.3, baseVol * 0.3);
        break;
    }
  } catch {
    // Audio not supported
  }
}
