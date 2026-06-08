let isSoundEnabled = true;

/**
 * Toggles whether synthesized sound effects are played.
 */
export const setSoundEffectsEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
};

/**
 * Checks if sound effects are enabled.
 */
export const getSoundEffectsEnabled = () => {
  return isSoundEnabled;
};

/**
 * Helper to initialize the browser's AudioContext.
 */
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  return AudioCtx ? new AudioCtx() : null;
};

/**
 * Helper to play a sequence of notes.
 */
const playTone = (
  freqs: number[], 
  durations: number[], 
  type: OscillatorType = 'sine', 
  vol = 0.1, 
  times: number[] = []
) => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  let startTime = now;

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const dur = durations[idx] || 0.1;

    gainNode.gain.setValueAtTime(vol, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.start(startTime);
    osc.stop(startTime + dur);

    if (times.length > idx) {
      startTime = now + times[idx];
    } else {
      startTime += dur * 0.8;
    }
  });
};

/**
 * Plays a high-pitched click sound for UI buttons.
 */
export const playClick = () => {
  playTone([800], [0.08], 'sine', 0.15);
};

/**
 * Plays a frequency sweep for card flipping.
 */
export const playFlip = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(580, now + 0.15);
  
  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
};

/**
 * Plays a light woodblock click for the timer ticks.
 */
export const playTick = () => {
  playTone([580], [0.03], 'triangle', 0.08);
};

/**
 * Plays a low buzzer sound for timer expiry.
 */
export const playBuzzer = () => {
  playTone([110, 90], [0.3, 0.3], 'sawtooth', 0.15);
};

/**
 * Plays a happy rising C major arpeggio for victory outcomes.
 */
export const playWin = () => {
  playTone([261.63, 329.63, 392.00, 523.25], [0.15, 0.15, 0.15, 0.45], 'triangle', 0.12);
};

/**
 * Plays a sad descending pitch swell for defeat outcomes.
 */
export const playLose = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(70, now + 0.7);
  
  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.7);
};
