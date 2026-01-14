export const CUBE_COLORS = {
  W: { r: 255, g: 255, b: 255 },
  Y: { r: 255, g: 255, b: 0 },
  G: { r: 0, g: 180, b: 0 },
  B: { r: 0, g: 0, b: 255 },
  O: { r: 255, g: 140, b: 0 },
  R: { r: 255, g: 0, b: 0 },
};

export function closestCubeColor({ r, g, b }) {
  let min = Infinity;
  let best = 'W';

  for (const key in CUBE_COLORS) {
    const c = CUBE_COLORS[key];
    const dist =
      (r - c.r) ** 2 +
      (g - c.g) ** 2 +
      (b - c.b) ** 2;

    if (dist < min) {
      min = dist;
      best = key;
    }
  }

  return best;
}
