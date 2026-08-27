/**
 * Every illustration in the app is a character grid: one letter = one pixel.
 * `.` is transparent, every other letter maps to a colour in the sprite's palette.
 * Sprite in components/PixelArt.tsx turns these into SVG rects.
 */

export type Art = readonly string[];
export type Palette = Record<string, string>;

export const INK = "#2E1B10";

/** Halved boiled egg. The yolk colours are passed in per preset. */
export const EGG: Art = [
  ".....oooooo.....",
  "...oowwwwwwoo...",
  "..owwwwwwwwwwo..",
  ".owwwwddddddwwo.",
  ".owwwdyyyyyydwo.",
  "oowwdyyhhyyyydwo",
  "owwwdyyhhyyyyydo",
  "owwwdyyyyyyyyydo",
  "owwwdyyyyyyyyydo",
  "oowwdyyyyyyyydwo",
  ".owwwdyyyyyydwo.",
  ".owwwwddddddwwo.",
  "..owwwwwwwwwwo..",
  "...oosssssssoo..",
  "....oossssssoo..",
  ".....oooooooo...",
];

export function eggPalette(yolk: string, yolkDark: string, highlight = "#FFE39B"): Palette {
  return { o: INK, w: "#FFF8EC", s: "#E6D3AE", y: yolk, d: yolkDark, h: highlight };
}

/** Red pot of boiling water on a lit gas burner. */
export const POT: Art = [
  "..oooooooooooooooooooooooooooooooooo..",
  "..oWwwwwWwwwwwwwwWwwwwwwwwwWwwwwwwwo..",
  "..owwwWwwwwwwwwwwwWwwwwwwwwwwWwwwwwo..",
  "..ollllllllllllllllllllllllllllllllo..",
  "..oooooooooooooooooooooooooooooooooo..",
  "...orrrrrrrrrrrrrrrrrrrrrrrrrrrrrro...",
  "oooorrrrrrrrrrrrrrrrrrrrrrrrrrrrrroooo",
  "o.oorrrrrrrrrrrrrrrrrrrrrrrrrrrrrroo.o",
  "oooorrrrrrrrrrrrrrrrrrrrrrrrrrrrrroooo",
  "...orrrrrrrrrrrrrrrrrrrrrrrrrrrrrro...",
  "...orrrrrrrrrrrrrrrrrrrrrrrrrrrrrro...",
  "...orrrrrrrrrrroooooooorrrrrrrrrrro...",
  "...orrrrrrrrrrrollllllorrrrrrrrrrro...",
  "...orrrrrrrrrrrolyyyylorrrrrrrrrrro...",
  "...orrrrrrrrrrrollllllorrrrrrrrrrro...",
  "...orrrrrrrrrrroooooooorrrrrrrrrrro...",
  "...oRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRo...",
  "....oRRRRRRRRRRRRRRRRRRRRRRRRRRRRo....",
  "....oooooooooooooooooooooooooooooo....",
];

export const POT_PALETTE: Palette = {
  o: INK,
  r: "#C7413B",
  R: "#9B2C28",
  l: "#E0645C",
  w: "#BFE4F5",
  W: "#EAF8FF",
  y: "#F9B928",
};

/** Burner grate + gas flames, drawn under the pot. */
export const BURNER: Art = [
  "..oooooooooooooooooooooooooooooo..",
  "..oGgGgGgGgGgGgGgGgGgGgGgGgGgGgo..",
  "..oooooooooooooooooooooooooooooo..",
  ".......b.......b.......b..........",
  "......bBb.....bBb.....bBb.........",
  ".....bBBBb...bBBBb...bBBBb........",
  ".....bBBBb...bBBBb...bBBBb........",
  "......bbb.....bbb.....bbb.........",
  ".oooooooooooooooooooooooooooooooo.",
  ".oggggggggggggggggggggggggggggggo.",
  ".oooooooooooooooooooooooooooooooo.",
];

export const BURNER_PALETTE: Palette = {
  o: INK,
  g: "#6B6B72",
  G: "#93939B",
  b: "#2E7FD1",
  B: "#7FD4FF",
};

/** Whole egg used to fill the basket. */
export const EGG_WHOLE: Art = [
  "...oo...",
  "..oeeo..",
  ".oeeeeo.",
  "oeeeeeEo",
  "oeeeeeEo",
  "oeeeeeEo",
  "oeeeeEEo",
  ".oeeEEo.",
  "..oooo..",
];

export const EGG_WHOLE_PALETTE: Palette = { o: INK, e: "#F6E6C8", E: "#DCC29A" };

/** Woven basket. */
export const BASKET: Art = [
  "oooooooooooooooooooooooooooooo",
  "obBbBbBbBbBbBbBbBbBbBbBbBbBbBo",
  "obbBbbBbbBbbBbbBbbBbbBbbBbbBBo",
  ".obBbBbBbBbBbBbBbBbBbBbBbBbBo.",
  ".obbBbbBbbBbbBbbBbbBbbBbbBbBo.",
  "..obBbBbBbBbBbBbBbBbBbBbBbBo..",
  "..obbBbbBbbBbbBbbBbbBbbBbbBo..",
  "...oooooooooooooooooooooooo...",
];

export const BASKET_PALETTE: Palette = { o: INK, b: "#C08A4A", B: "#96652F" };

/** Potted plant. */
export const PLANT: Art = [
  "....oo..oo....",
  "...oggooggo...",
  "..oggggggggo..",
  ".oggGggggGggo.",
  ".oggggggggggo.",
  "..oggggggggo..",
  "...ogggggo....",
  ".....ogo......",
  ".....ogo......",
  "...oooooooo...",
  "..oppppppppo..",
  "..oppppppppo..",
  "..oppppppppo..",
  "...oPPPPPPo...",
  "...oPPPPPPo...",
  "....oooooo....",
];

export const PLANT_PALETTE: Palette = {
  o: INK,
  g: "#6FA34B",
  G: "#4E7A33",
  p: "#C4763C",
  P: "#98552A",
};

/** Hanging spatula. */
export const SPATULA: Art = [
  "..ooo..",
  ".oh.ho.",
  ".ohhho.",
  "..oho..",
  "..oho..",
  "..oho..",
  "..oho..",
  "..oho..",
  ".ooooo.",
  "omMMMmo",
  "ommmmmo",
  "ommmmmo",
  "omMMMmo",
  ".ooooo.",
];

/** Hanging frying pan. */
export const PAN: Art = [
  ".....oo.......",
  "....ohho......",
  "....ohho......",
  "....ohho......",
  ".oooooooooooo.",
  ".ommmmmmmmmmo.",
  ".omMMMMMMMMmo.",
  ".omMMMMMMMMmo.",
  "..oMMMMMMMMo..",
  "...oMMMMMMo...",
  "....oooooo....",
];

export const METAL_PALETTE: Palette = {
  o: INK,
  m: "#C3C6CE",
  M: "#8A8E98",
  h: "#8A5A2B",
};

/** Salt shaker. */
export const SALT: Art = [
  "..oooo..",
  ".o.oo.o.",
  ".oooooo.",
  "osssssso",
  "osssssso",
  "osSsssSo",
  "osssssso",
  "osSsssso",
  "oSssssSo",
  ".oooooo.",
];

export const SALT_PALETTE: Palette = { o: INK, s: "#F3EDE0", S: "#D8CFBB" };

export const CLOCK: Art = [
  "...ooo...",
  ".oo...oo.",
  ".o..o..o.",
  "o...o...o",
  "o...ooo.o",
  "o.......o",
  ".o.....o.",
  ".oo...oo.",
  "...ooo...",
];

export const CHECK: Art = ["......c", ".....cc", "c...cc.", "cc.cc..", ".ccc...", "..c...."];

export const ARROW_LEFT: Art = [
  "...a.....",
  "..aa.....",
  ".aaa.....",
  "aaaaaaaa.",
  "aaaaaaaa.",
  ".aaa.....",
  "..aa.....",
  "...a.....",
];

export const SOUND_ON: Art = [
  "....oo.....",
  "...ooo..o..",
  ".ooooo.o.o.",
  ".ooooo.o.o.",
  ".ooooo.o.o.",
  "...ooo..o..",
  "....oo.....",
];

export const SOUND_OFF: Art = [
  "....oo.....",
  "...ooo.....",
  ".ooooo.o.o.",
  ".ooooo..o..",
  ".ooooo.o.o.",
  "...ooo.....",
  "....oo.....",
];

export const CHEF_HAT: Art = [
  "...oooooooo...",
  ".oohhhhhhhhoo.",
  "ohhhhhhhhhhhho",
  "ohhhhhhhhhhhho",
  ".ohhhhhhhhhho.",
  "..oooooooooo..",
  "..ohhhhhhhho..",
  "..ohHhHhHhho..",
  "..oooooooooo..",
];

export const HAT_PALETTE: Palette = { o: INK, h: "#FFFDF7", H: "#E3D9C6" };
