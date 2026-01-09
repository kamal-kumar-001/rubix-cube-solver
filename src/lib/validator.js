// src/lib/validator.js

const COLORS = ['W', 'R', 'B', 'O', 'G', 'Y'];

export function validateCube(cube) {
  const errors = [];

  // 1. Count colors
  const counts = {};
  COLORS.forEach(c => (counts[c] = 0));

  Object.values(cube).forEach(face => {
    face.forEach(color => {
      if (!COLORS.includes(color)) {
        errors.push('Invalid color detected');
      } else {
        counts[color]++;
      }
    });
  });

  COLORS.forEach(color => {
    if (counts[color] !== 9) {
      errors.push(
        `Color ${color} has ${counts[color]} stickers (expected 9)`
      );
    }
  });

  // 2. Center check
  const centers = {
    U: 'W',
    D: 'Y',
    F: 'G',
    B: 'B',
    L: 'O',
    R: 'R',
  };

  Object.entries(centers).forEach(([face, color]) => {
    if (cube[face][4] !== color) {
      errors.push(`${face} center must be ${color}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
