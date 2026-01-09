export function normalizeMoves(moves) {
  const result = [];

  for (const move of moves) {
    if (move.endsWith('2')) {
      const base = move[0];
      result.push(base, base);
    } else {
      result.push(move);
    }
  }

  return result;
}
