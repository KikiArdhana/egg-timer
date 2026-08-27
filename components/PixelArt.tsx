import type { CSSProperties } from "react";
import type { Art, Palette } from "@/lib/sprites";

/* ------------------------------------------------------------------ *
 * Sprite: character grid -> SVG rects, merging horizontal runs.
 * ------------------------------------------------------------------ */

type Rect = { x: number; y: number; w: number; fill: string };

function toRects(art: Art, palette: Palette): Rect[] {
  const rects: Rect[] = [];
  art.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || ch === " ") {
        x += 1;
        continue;
      }
      let run = 1;
      while (row[x + run] === ch) run += 1;
      rects.push({ x, y, w: run, fill: palette[ch] ?? "transparent" });
      x += run;
    }
  });
  return rects;
}

export function Sprite({
  art,
  palette,
  className,
  style,
  label,
}: {
  art: Art;
  palette: Palette;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  const width = Math.max(...art.map((r) => r.length));
  const height = art.length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      shapeRendering="crispEdges"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {toRects(art, palette).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Bitmap font: 5x7 uppercase, used for the logo and the countdown.
 * ------------------------------------------------------------------ */

const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["00", "11", "11", "00", "11", "11", "00"],
  "!": ["1", "1", "1", "1", "1", "0", "1"],
  "?": ["01110", "10001", "00001", "00110", "00100", "00000", "00100"],
  "'": ["1", "1", "0", "0", "0", "0", "0"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  " ": ["000", "000", "000", "000", "000", "000", "000"],
};

const GLYPH_GAP = 1;

function layout(text: string) {
  const glyphs = [...text.toUpperCase()].map((ch) => FONT[ch] ?? FONT["?"]);
  const width = glyphs.reduce((sum, g) => sum + g[0].length + GLYPH_GAP, 0) - GLYPH_GAP;
  return { glyphs, width: Math.max(width, 1) };
}

/**
 * Text drawn in the bitmap font. `color` fills the glyphs, `shadow` offsets a
 * second copy one pixel down for the chunky arcade look.
 */
export function PixelText({
  text,
  color = "#2E1B10",
  shadow,
  bold = false,
  className,
  style,
  as = "span",
}: {
  text: string;
  color?: string;
  shadow?: string;
  bold?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const { glyphs, width } = layout(text);
  const height = 7;
  const rects: Rect[] = [];
  let cursor = 0;
  glyphs.forEach((glyph) => {
    glyph.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        if (row[x] === "1") {
          let run = 1;
          while (row[x + run] === "1") run += 1;
          rects.push({ x: cursor + x, y, w: run, fill: color });
          x += run;
        } else {
          x += 1;
        }
      }
    });
    cursor += glyph[0].length + GLYPH_GAP;
  });

  // Bold mode dilates every fill rect by 1px in each direction using the
  // shadow colour, drawn underneath, so letters read as a thick outlined
  // pixel font instead of a thin one.
  const outline: Rect[] = [];
  if (bold && shadow) {
    const offsets: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    rects.forEach((r) => {
      offsets.forEach(([dx, dy]) => {
        outline.push({ x: r.x + dx, y: r.y + dy, w: r.w, fill: shadow });
      });
    });
  }

  const pad = bold ? 1 : 0;
  const vbX = -pad;
  const vbY = -pad;
  const vbW = width + pad * 2;
  const vbH = height + pad * 2 + (!bold && shadow ? 1 : 0);

  const Tag = as;
  return (
    <Tag className={className} style={style}>
      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        {!bold &&
          shadow &&
          rects.map((r, i) => (
            <rect key={`s${i}`} x={r.x} y={r.y + 1} width={r.w} height={1} fill={shadow} />
          ))}
        {bold &&
          outline.map((r, i) => (
            <rect key={`o${i}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
          ))}
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </svg>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Dial: pixel egg-white disc, chunky progress ring, yolk, countdown.
 * ------------------------------------------------------------------ */

/** Rows of a filled circle snapped to a pixel grid, as merged rects. */
function discRects(radius: number, unit: number, cx: number, cy: number) {
  const rows: { x: number; y: number; w: number }[] = [];
  for (let ry = -radius; ry < radius; ry += 1) {
    const yMid = ry + 0.5;
    const half = Math.floor(Math.sqrt(Math.max(0, radius * radius - yMid * yMid)));
    if (half <= 0) continue;
    rows.push({ x: cx - half * unit, y: cy + ry * unit, w: half * 2 * unit });
  }
  return rows.map((r) => ({ ...r, h: unit }));
}

const SEGMENTS = 40;

export function Dial({
  timeText,
  caption,
  progress,
  yolk,
  yolkDark,
  muted = false,
}: {
  timeText: string;
  caption: string;
  progress: number;
  yolk: string;
  yolkDark: string;
  muted?: boolean;
}) {
  const size = 120;
  const c = size / 2;
  const unit = 3;
  const whiteEdge = discRects(20, unit, c, c);
  const white = discRects(19, unit, c, c);
  const yolkEdge = discRects(17, unit, c, c);
  const yolkRows = discRects(16, unit, c, c);
  const filled = Math.round(Math.min(1, Math.max(0, progress)) * SEGMENTS);

  const caps = layout(caption);
  const time = layout(timeText);
  const capScale = Math.min(1.5, 70 / caps.width);
  const timeScale = Math.min(3.4, 88 / time.width);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="dial"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {whiteEdge.map((r, i) => (
        <rect key={`we${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#2E1B10" />
      ))}
      {white.map((r, i) => (
        <rect key={`w${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#FFF8EC" />
      ))}
      {yolkEdge.map((r, i) => (
        <rect key={`ye${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill="#2E1B10" />
      ))}
      {yolkRows.map((r, i) => (
        <rect
          key={`y${i}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill={muted ? "#E7D5B4" : i > yolkRows.length - 5 ? yolkDark : yolk}
        />
      ))}

      <g>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <rect
            key={`s${i}`}
            x={c - 3}
            y={1}
            width={6}
            height={9}
            fill={i < filled ? "#F0821E" : "#FFF8EC"}
            stroke="#2E1B10"
            strokeWidth={0.6}
            transform={`rotate(${(i * 360) / SEGMENTS} ${c} ${c})`}
          />
        ))}
      </g>

      <g transform={`translate(${c - (caps.width * capScale) / 2} ${c - 30}) scale(${capScale})`}>
        {caps.glyphs.map((glyph, gi) => {
          const offset = caps.glyphs
            .slice(0, gi)
            .reduce((sum, g) => sum + g[0].length + GLYPH_GAP, 0);
          return glyph.map((row, y) =>
            [...row].map((bit, x) =>
              bit === "1" ? (
                <rect
                  key={`c${gi}-${y}-${x}`}
                  x={offset + x}
                  y={y}
                  width={1}
                  height={1}
                  fill="#2E1B10"
                />
              ) : null,
            ),
          );
        })}
      </g>

      <g
        transform={`translate(${c - (time.width * timeScale) / 2} ${c - 11}) scale(${timeScale})`}
      >
        {time.glyphs.map((glyph, gi) => {
          const offset = time.glyphs
            .slice(0, gi)
            .reduce((sum, g) => sum + g[0].length + GLYPH_GAP, 0);
          return glyph.map((row, y) =>
            [...row].map((bit, x) =>
              bit === "1" ? (
                <rect
                  key={`t${gi}-${y}-${x}`}
                  x={offset + x}
                  y={y}
                  width={1}
                  height={1}
                  fill="#2E1B10"
                />
              ) : null,
            ),
          );
        })}
      </g>
    </svg>
  );
}