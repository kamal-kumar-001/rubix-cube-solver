export function getColorToFaceMap(cube) {
  return {
    [cube.U[4]]: 'U',
    [cube.D[4]]: 'D',
    [cube.F[4]]: 'F',
    [cube.B[4]]: 'B',
    [cube.L[4]]: 'L',
    [cube.R[4]]: 'R',
  };
}
