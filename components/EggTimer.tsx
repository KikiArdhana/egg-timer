"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dial, PixelText, Sprite } from "./PixelArt";
import {
  ARROW_LEFT,
  BASKET,
  BASKET_PALETTE,
  BURNER,
  BURNER_PALETTE,
  CHECK,
  CHEF_HAT,
  EGG_WHOLE,
  EGG_WHOLE_PALETTE,
  CLOCK,
  HAT_PALETTE,
  INK,
  PAN,
  METAL_PALETTE,
  PLANT,
  PLANT_PALETTE,
  POT,
  POT_PALETTE,
  SALT,
  SALT_PALETTE,
  SPATULA,
  SOUND_OFF as SOUND_OFF_ART,
  SOUND_ON as SOUND_ON_ART,
} from "@/lib/sprites";
import { PRESETS, formatTime, spokenTime, useCountdown, type Preset } from "@/lib/timer";

const inkOnly = { o: INK, a: INK };

/** Real photo per preset, replacing the earlier pixel-art egg sprite. */
const EGG_IMAGES: Record<Preset["id"], string> = {
  "setengah-mentah": "/image/telur_setengahmentah.png",
  lunak: "/image/telur_lunak.png",
  sedang: "/image/telur_sedang.png",
  matang: "/image/telur_matang.png",
};

function EggThumb({ preset, className }: { preset: Preset; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- keep pixel edges crisp, no resizing pipeline
    <img
      src={EGG_IMAGES[preset.id]}
      alt={`Telur ${preset.name}`}
      className={className}
      style={{ imageRendering: "pixelated", width: "100%", height: "100%", objectFit: "contain" }}
      draggable={false}
    />
  );
}

function Sparkles({ spots }: { spots: { top: string; left: string; delay: string }[] }) {
  return (
    <>
      {spots.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * Idle ambient motion for decorative kitchen elements — gentle bobbing eggs,
 * a swaying plant, a tilting chef hat, and hanging utensils that sway like
 * they're on hooks. Defined once via styled-jsx so no other CSS file needs
 * to change. prefers-reduced-motion is already handled globally (the
 * app's *,*::before,*::after { animation: none !important } rule in
 * globals.css), so these are automatically disabled for that preference.
 */
function AmbientMotionStyles() {
  return (
    <style jsx global>{`
      @keyframes eggBobA {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      @keyframes eggBobB {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-7px);
        }
      }
      @keyframes eggBobC {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-4px);
        }
      }
      @keyframes plantSway {
        0%,
        100% {
          transform: rotate(-4deg);
        }
        50% {
          transform: rotate(4deg);
        }
      }
      @keyframes hatTilt {
        0%,
        100% {
          transform: rotate(-3deg);
        }
        50% {
          transform: rotate(3deg);
        }
      }
      @keyframes utensilSway {
        0%,
        100% {
          transform: rotate(-5deg);
        }
        50% {
          transform: rotate(5deg);
        }
      }

      .anim-egg-a {
        animation: eggBobA 2.6s ease-in-out infinite;
      }
      .anim-egg-b {
        animation: eggBobB 3.1s ease-in-out infinite 0.3s;
      }
      .anim-egg-c {
        animation: eggBobC 2.8s ease-in-out infinite 0.6s;
      }
      .anim-plant-sway {
        animation: plantSway 3.4s ease-in-out infinite;
        transform-origin: bottom center;
      }
      .anim-hat-tilt {
        animation: hatTilt 2.4s ease-in-out infinite;
        transform-origin: bottom center;
      }
      .anim-utensil-sway {
        animation: utensilSway 2.2s ease-in-out infinite;
        transform-origin: top center;
      }
      .anim-utensil-sway-delayed {
        animation: utensilSway 2.4s ease-in-out infinite 0.4s;
        transform-origin: top center;
      }
    `}</style>
  );
}

export default function EggTimer() {
  const [presetId, setPresetId] = useState<Preset["id"]>(PRESETS[0].id);
  const [view, setView] = useState<"select" | "cook">("select");
  const [soundOn, setSoundOn] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/timer-done.mp3");
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  /**
   * Ambient soundtrack: loops for as long as the tab is open. Most browsers
   * block audio with sound until the person has interacted with the page at
   * least once, so we try to play immediately and, if that's rejected,
   * quietly retry on the very first tap/click/keypress anywhere on the site.
   */
  useEffect(() => {
    const music = new Audio("/audio/egg_soundtrack.mp3");
    music.loop = true;
    music.volume = 0.35;
    music.preload = "auto";
    musicRef.current = music;

    const tryPlay = () => {
      void music.play().catch(() => {});
    };
    tryPlay();

    const resumeOnFirstGesture = () => tryPlay();
    window.addEventListener("pointerdown", resumeOnFirstGesture, { once: true });
    window.addEventListener("keydown", resumeOnFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumeOnFirstGesture);
      window.removeEventListener("keydown", resumeOnFirstGesture);
      music.pause();
      musicRef.current = null;
    };
  }, []);

  const handleComplete = useCallback(() => {
    if (soundOn) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      }
    }
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([180, 90, 180, 90, 320]);
    }
  }, [soundOn]);

  const { status, remaining, progress, start, pause, resume, reset } = useCountdown(
    preset.seconds,
    handleComplete,
  );

  /**
   * Duck the soundtrack out during the last 5 seconds of an active countdown
   * so the completion bell lands in near-silence, then let it come back.
   * Muting the sound icon pauses it too, since it's the same "sound" toggle
   * the person already sees.
   */
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    const inQuietZone =
      (status === "running" || status === "paused") && remaining > 0 && remaining <= 5;
    const shouldPlay = soundOn && !inQuietZone;
    if (shouldPlay) {
      if (music.paused) void music.play().catch(() => {});
    } else if (!music.paused) {
      music.pause();
    }
  }, [soundOn, status, remaining]);

  // Picking a different egg puts the clock back to that preset's full time.
  useEffect(() => {
    reset();
  }, [reset]);

  /** iOS keeps audio locked until it plays inside a gesture, so prime it on START. */
  const primeAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = true;
    void audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {
        audio.muted = false;
      });
  };

  const handleStart = () => {
    primeAudio();
    start();
    setView("cook");
  };

  const backToPicker = () => {
    reset();
    setView("select");
  };

  /** Selecting a preset also brings the START button into view, so the
   * person never has to hunt for it after tapping a card. */
  const selectPreset = (id: Preset["id"]) => {
    setPresetId(id);
    footerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const statusMessage =
    status === "done"
      ? `Waktu habis. Telur ${preset.name} siap.`
      : status === "running"
        ? `Timer berjalan. Sisa ${spokenTime(remaining)}.`
        : status === "paused"
          ? "Timer dijeda."
          : `Siap memasak telur ${preset.name}, ${spokenTime(preset.seconds)}.`;

  /* ------------------------------ picker ------------------------------ */

  if (view === "select") {
    return (
      <div className="shell bg-kitchen">
        <AmbientMotionStyles />
        <div>
          <header className="relative px-4 pt-4">
            <Sparkles
              spots={[
                { top: "8px", left: "26%", delay: "0s" },
                { top: "70px", left: "10%", delay: "0.7s" },
                { top: "30px", left: "86%", delay: "1.3s" },
                { top: "110px", left: "76%", delay: "0.3s" },
              ]}
            />

            <div className="flex items-start justify-between">
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => setSoundOn((on) => !on)}
                aria-pressed={soundOn}
                aria-label={soundOn ? "Matikan suara" : "Nyalakan suara"}
              >
                <Sprite
                  art={soundOn ? SOUND_ON_ART : SOUND_OFF_ART}
                  palette={inkOnly}
                  className="w-6"
                />
              </button>
              <button
                type="button"
                className="btn btn-icon text-[20px] font-bold"
                onClick={() => setHelpOpen((open) => !open)}
                aria-expanded={helpOpen}
                aria-label="Tips merebus telur"
              >
                ?
              </button>
            </div>

            <div className="relative flex flex-col items-center gap-2">
              <Sprite
                art={CHEF_HAT}
                palette={HAT_PALETTE}
                className="anim-hat-tilt w-12"
              />
              <PixelText
                as="h1"
                text="EGG TIMER"
                color="#FDB100"
                shadow={INK}
                bold
                className="w-[80%] max-w-[300px]"
              />
            </div>

            <div className="panel-wood mt-4 px-3 py-2">
              <PixelText
                text="PILIH TINGKAT KEMATANGAN"
                color="#FBF1DA"
                className="mx-auto w-[92%]"
              />
            </div>

            {helpOpen && (
              <div className="panel pop mt-3 p-3 text-[12px] leading-relaxed">
                <p className="font-bold tracking-wide">TIPS</p>
                <p className="mt-1">
                  Masukkan telur saat air sudah mendidih, lalu tekan START. Gunakan telur suhu
                  ruang supaya cangkang tidak retak, dan siram air dingin setelah waktunya habis.
                </p>
              </div>
            )}
          </header>

          <main className="mt-4 flex flex-col gap-3 px-4" aria-label="Tingkat kematangan telur">
            {PRESETS.map((option) => {
              const selected = option.id === preset.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className="card"
                  aria-pressed={selected}
                  onClick={() => selectPreset(option.id)}
                >
                  <span
                    className="shrink-0 border-[3px] border-ink bg-cream p-1.5"
                    style={{ width: 82 }}
                  >
                    <EggThumb preset={option} className="w-full" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[20px] font-bold tracking-wide">
                      {option.name}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug text-ink-soft">
                      {option.description}
                    </span>
                    <span className="mt-2 flex items-center gap-2">
                      <Sprite art={CLOCK} palette={inkOnly} className="w-4" />
                      <span className="text-[18px] font-bold tracking-widest">
                        {formatTime(option.seconds)}
                      </span>
                    </span>
                  </span>

                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-ink ${
                      selected ? "bg-leaf" : "bg-cream"
                    }`}
                    aria-hidden="true"
                  >
                    {selected && <Sprite art={CHECK} palette={{ c: "#FFF8EC" }} className="w-5" />}
                  </span>
                </button>
              );
            })}
          </main>

          {/* decorative kitchen counter */}
          <div className="relative mt-2 h-[132px]" aria-hidden="true">
            <div className="absolute inset-x-0 bottom-0 h-[54px] bg-counter border-t-[3px] border-ink" />
            <Sprite art={SALT} palette={SALT_PALETTE} className="absolute bottom-[46px] left-4 w-7" />
            <Sprite
              art={PLANT}
              palette={PLANT_PALETTE}
              className="anim-plant-sway absolute bottom-[46px] right-4 w-14"
            />
            <div className="absolute bottom-[38px] left-1/2 w-[190px] -translate-x-1/2">
              <div className="relative">
                <Sprite
                  art={EGG_WHOLE}
                  palette={EGG_WHOLE_PALETTE}
                  className="anim-egg-a absolute -top-8 left-9 w-10"
                />
                <Sprite
                  art={EGG_WHOLE}
                  palette={EGG_WHOLE_PALETTE}
                  className="anim-egg-b absolute -top-11 left-[74px] w-11"
                />
                <Sprite
                  art={EGG_WHOLE}
                  palette={EGG_WHOLE_PALETTE}
                  className="anim-egg-c absolute -top-8 left-[112px] w-10"
                />
                <Sprite art={BASKET} palette={BASKET_PALETTE} className="relative w-full" />
              </div>
            </div>
            <div className="bg-cloth absolute bottom-2 left-1/2 h-4 w-[220px] -translate-x-1/2 border-[3px] border-ink" />
          </div>
        </div>

        <div
          ref={footerRef}
          className="flex-none border-t-[3px] border-ink bg-cream-deep p-3"
        >
          <button type="button" className="btn btn-primary" onClick={handleStart}>
            START · {formatTime(preset.seconds)}
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------ cooking ------------------------------ */

  const caption =
    status === "done"
      ? "TIME'S UP!"
      : status === "paused"
        ? "DIJEDA"
        : status === "running"
          ? "SISA WAKTU"
          : "SIAP MASAK";

  return (
    <div className="shell bg-wall">
      <AmbientMotionStyles />
      <p role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </p>

      {process.env.NODE_ENV === "development" && (
        <button type="button" className="btn btn-quiet" onClick={handleComplete}>
          DEV: FINISH
        </button>
      )}

      <div className="relative px-4 pt-4 pb-2">
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            className="btn btn-icon"
            onClick={backToPicker}
            aria-label="Kembali ke pilihan telur"
          >
            <Sprite art={ARROW_LEFT} palette={inkOnly} className="w-5" />
          </button>
          <button
            type="button"
            className="btn btn-icon ml-auto"
            onClick={() => setSoundOn((on) => !on)}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Matikan suara" : "Nyalakan suara"}
          >
            <Sprite
              art={soundOn ? SOUND_ON_ART : SOUND_OFF_ART}
              palette={inkOnly}
              className="w-6"
            />
          </button>
        </div>

        <div className="panel-wood relative mt-3 flex items-center gap-3 px-3 py-2">
          <span className="shrink-0 border-[3px] border-ink bg-cream p-0.5" style={{ width: 46 }}>
            <EggThumb preset={preset} className="w-full" />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-bold tracking-wide text-parchment">
              {preset.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5">
              <Sprite art={CLOCK} palette={{ o: "#FBF1DA" }} className="w-3.5" />
              <span className="text-[14px] font-bold tracking-widest text-parchment">
                {formatTime(preset.seconds)}
              </span>
            </span>
          </span>
        </div>

        <div className="relative mx-auto mt-4 w-[86%] max-w-[300px]">
          <Sparkles
            spots={[
              { top: "-6px", left: "-4%", delay: "0.2s" },
              { top: "28%", left: "-8%", delay: "1.1s" },
              { top: "6%", left: "100%", delay: "0.6s" },
              { top: "62%", left: "102%", delay: "1.6s" },
            ]}
          />
          <div className={status === "done" ? "pop" : undefined}>
            <Dial
              timeText={status === "done" ? "00:00" : formatTime(remaining)}
              caption={caption}
              progress={status === "done" ? 1 : progress}
              yolk={preset.yolk}
              yolkDark={preset.yolkDark}
              muted={status === "paused"}
            />
          </div>
        </div>

        {status === "done" && (
          <p className="panel pop mx-auto mt-3 w-fit px-4 py-2 text-center text-[13px] font-bold tracking-wide">
            Telur {preset.name} siap disantap
          </p>
        )}

        <div className="relative mt-3 flex flex-col items-center">
          {status === "running" && (
            <div className="steam mb-1 flex h-8 items-end gap-3" aria-hidden="true">
              <span style={{ animationDelay: "0s" }} />
              <span style={{ animationDelay: "0.8s" }} />
              <span style={{ animationDelay: "1.6s" }} />
            </div>
          )}
          {status !== "running" && <div className="mb-1 h-8" aria-hidden="true" />}

          <div className="flex w-full items-end justify-center gap-1">
            <Sprite
              art={PLANT}
              palette={PLANT_PALETTE}
              className="anim-plant-sway mb-1 hidden w-10 shrink-0 min-[380px]:block"
            />
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <Sprite art={POT} palette={POT_PALETTE} className="w-full max-w-[250px]" />
              <Sprite
                art={BURNER}
                palette={BURNER_PALETTE}
                className={`-mt-[2px] w-[92%] max-w-[230px] ${status === "running" ? "flame" : ""}`}
                style={status === "running" ? undefined : { filter: "grayscale(0.6)" }}
              />
            </div>
            <div className="mb-1 hidden shrink-0 flex-col items-center gap-1 min-[380px]:flex">
              <Sprite
                art={SPATULA}
                palette={METAL_PALETTE}
                className="anim-utensil-sway w-5"
              />
              <Sprite
                art={PAN}
                palette={METAL_PALETTE}
                className="anim-utensil-sway-delayed w-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-none space-y-2 border-t-[3px] border-ink bg-counter p-3">
        {status === "running" && (
          <button type="button" className="btn btn-danger" onClick={pause}>
            ❚❚ PAUSE
          </button>
        )}
        {status === "paused" && (
          <button type="button" className="btn btn-primary" onClick={resume}>
            ▶ RESUME
          </button>
        )}
        {status === "idle" && (
          <button type="button" className="btn btn-primary" onClick={handleStart}>
            ▶ START
          </button>
        )}
        {status === "done" && (
          <button type="button" className="btn btn-primary" onClick={backToPicker}>
            PILIH TELUR LAIN
          </button>
        )}
        <button type="button" className="btn btn-quiet" onClick={reset}>
          ◼ RESET
        </button>
      </div>
    </div>
  );
}