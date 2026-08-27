"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PresetId = "setengah-mentah" | "lunak" | "sedang" | "matang";

export type Preset = {
  id: PresetId;
  name: string;
  description: string;
  seconds: number;
  /** Main yolk colour of the pixel egg. */
  yolk: string;
  /** Darker yolk tone used for the shading pixels. */
  yolkDark: string;
  /** True for the runny presets — draws a small drip on the sprite. */
  runny: boolean;
};

export const PRESETS: readonly Preset[] = [
  {
    id: "setengah-mentah",
    name: "Setengah Matang",
    description: "Kuning telur masih lumer",
    seconds: 6 * 60,
    yolk: "#F07A15",
    yolkDark: "#C25A08",
    runny: true,
  },
  {
    id: "lunak",
    name: "Lunak",
    description: "Kuning telur agak lumer",
    seconds: 8 * 60,
    yolk: "#F79420",
    yolkDark: "#CC6C0C",
    runny: true,
  },
  {
    id: "sedang",
    name: "Sedang",
    description: "Kuning telur lembut",
    seconds: 10 * 60,
    yolk: "#FBB03B",
    yolkDark: "#D98C1C",
    runny: false,
  },
  {
    id: "matang",
    name: "Matang",
    description: "Kuning telur padat",
    seconds: 12 * 60,
    yolk: "#FCD34D",
    yolkDark: "#E0A82E",
    runny: false,
  },
];

/** 615 -> "10:15" */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** "10:15" -> "10 menit 15 detik", for screen readers. */
export function spokenTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  if (minutes === 0) return `${seconds} detik`;
  return `${minutes} menit ${seconds} detik`;
}

export type TimerStatus = "idle" | "running" | "paused" | "done";

type Countdown = {
  status: TimerStatus;
  /** Whole seconds left, always between 0 and the preset duration. */
  remaining: number;
  /** 0 -> just started, 1 -> finished. */
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

const TICK_MS = 200;

/**
 * Countdown driven by a wall-clock deadline (Date.now), so a throttled or
 * backgrounded tab cannot make the timer drift. The interval only decides how
 * often we look at the clock, never how much time has passed.
 */
export function useCountdown(durationSeconds: number, onComplete: () => void): Countdown {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingMs, setRemainingMs] = useState(durationSeconds * 1000);

  const deadlineRef = useRef(0);
  const remainingRef = useRef(durationSeconds * 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const setRemaining = useCallback((ms: number) => {
    remainingRef.current = ms;
    setRemainingMs(ms);
  }, []);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const left = deadlineRef.current - Date.now();
    if (left <= 0) {
      clear();
      setRemaining(0);
      setStatus("done");
      completeRef.current();
      return;
    }
    setRemaining(left);
  }, [clear, setRemaining]);

  /** Only ever one interval alive, whatever the user taps. */
  const run = useCallback(
    (msLeft: number) => {
      clear();
      deadlineRef.current = Date.now() + msLeft;
      setRemaining(msLeft);
      setStatus("running");
      intervalRef.current = setInterval(tick, TICK_MS);
    },
    [clear, setRemaining, tick],
  );

  const start = useCallback(() => {
    run(durationSeconds * 1000);
  }, [durationSeconds, run]);

  const resume = useCallback(() => {
    if (remainingRef.current > 0) run(remainingRef.current);
  }, [run]);

  const pause = useCallback(() => {
    clear();
    setRemaining(Math.max(0, deadlineRef.current - Date.now()));
    setStatus("paused");
  }, [clear, setRemaining]);

  const reset = useCallback(() => {
    clear();
    deadlineRef.current = 0;
    setRemaining(durationSeconds * 1000);
    setStatus("idle");
  }, [clear, durationSeconds, setRemaining]);

  // A phone that sleeps mid-boil stops firing intervals; catch up on return.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && intervalRef.current !== null) tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [tick]);

  useEffect(() => clear, [clear]);

  return {
    status,
    remaining: Math.ceil(remainingMs / 1000),
    progress: durationSeconds > 0 ? 1 - remainingMs / (durationSeconds * 1000) : 0,
    start,
    pause,
    resume,
    reset,
  };
}
