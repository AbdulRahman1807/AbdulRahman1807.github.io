import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

const SOUNDS = {
  // Satisfying mechanical "thock" (filtered impact + tiny noise floor)
  tick: () => {
    const filter = new Tone.Filter(1500, "lowpass").toDestination();
    const noise = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.005, sustain: 0, release: 0.005 },
      volume: -25
    }).connect(filter);
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.001,
      octaves: 0.2,
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
      volume: -10
    }).connect(filter);
    
    noise.triggerAttackRelease("64n");
    synth.triggerAttackRelease("G2", "64n");
  },
  // Deeper mechanical "thock" (heavy dampen)
  thunk: () => {
    const filter = new Tone.Filter(800, "lowpass").toDestination();
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.002,
      octaves: 0.5,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
      volume: -6
    }).connect(filter);
    
    synth.triggerAttackRelease("C2", "32n");
  },
  // Sub-bass atmospheric swell
  whoosh: () => {
    const filter = new Tone.Filter(200, "lowpass").toDestination();
    const noise = new Tone.NoiseSynth({
      noise: { type: "brown" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0, release: 0.2 },
      volume: -15
    }).connect(filter);
    noise.triggerAttackRelease("8n");
  },
  // Damped harmonic thud
  chime: () => {
    const filter = new Tone.Filter(600, "lowpass").toDestination();
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
      volume: -12
    }).connect(filter);
    synth.triggerAttackRelease(["C2", "G2"], "16n");
  },
  // Subtle mechanical click (light switch)
  click: () => {
    const filter = new Tone.Filter(2000, "lowpass").toDestination();
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.001,
      octaves: 0.1,
      envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.03 },
      volume: -14
    }).connect(filter);
    synth.triggerAttackRelease("A3", "64n");
  },
  // Deep mechanical slide/impact
  swoosh: () => {
    const filter = new Tone.Filter(400, "lowpass").toDestination();
    const noise = new Tone.NoiseSynth({
      noise: { type: "brown" },
      envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.3 },
      volume: -15
    }).connect(filter);
    noise.triggerAttackRelease("4n");
  },
}

let globalMuted = localStorage.getItem('soundMuted') === 'true';
const listeners = new Set();

const setGlobalMuted = (muted) => {
  globalMuted = muted;
  localStorage.setItem('soundMuted', String(muted));
  listeners.forEach(l => l(muted));
};

export function useSound() {
  const [isMuted, setIsMuted] = useState(globalMuted);

  useEffect(() => {
    const syncMute = (muted) => setIsMuted(muted);
    listeners.add(syncMute);
    return () => listeners.delete(syncMute);
  }, []);

  const debounceRef = useRef({})

  const play = (soundName) => {
    if (isMuted) return
    if (!SOUNDS[soundName]) return

    const now = Date.now()
    if (debounceRef.current[soundName] && now - debounceRef.current[soundName] < 200) return
    debounceRef.current[soundName] = now

    Tone.start().then(() => {
      SOUNDS[soundName]()
    })
  }

  const toggleMute = () => {
    setGlobalMuted(!globalMuted);
  }

  return { play, isMuted, toggleMute }
}