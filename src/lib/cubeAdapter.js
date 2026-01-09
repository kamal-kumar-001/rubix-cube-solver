import { getColorToFaceMap } from './colorMap';

export function cubeToSolverState(cube) {
  const map = getColorToFaceMap(cube);

  const f = (c) => map[c];

  const edges = [
    f(cube.U[7]) + f(cube.F[1]), // UF
    f(cube.U[5]) + f(cube.R[1]), // UR
    f(cube.U[1]) + f(cube.B[1]), // UB
    f(cube.U[3]) + f(cube.L[1]), // UL

    f(cube.D[1]) + f(cube.F[7]), // DF
    f(cube.D[5]) + f(cube.R[7]), // DR
    f(cube.D[7]) + f(cube.B[7]), // DB
    f(cube.D[3]) + f(cube.L[7]), // DL

    f(cube.F[5]) + f(cube.R[3]), // FR
    f(cube.F[3]) + f(cube.L[5]), // FL
    f(cube.B[3]) + f(cube.R[5]), // BR
    f(cube.B[5]) + f(cube.L[3]), // BL
  ];

  const corners = [
    f(cube.U[8]) + f(cube.F[2]) + f(cube.R[0]), // UFR
    f(cube.U[2]) + f(cube.R[2]) + f(cube.B[0]), // URB
    f(cube.U[0]) + f(cube.B[2]) + f(cube.L[0]), // UBL
    f(cube.U[6]) + f(cube.L[2]) + f(cube.F[0]), // ULF

    f(cube.D[2]) + f(cube.R[6]) + f(cube.F[8]), // DRF
    f(cube.D[0]) + f(cube.F[6]) + f(cube.L[8]), // DFL
    f(cube.D[6]) + f(cube.L[6]) + f(cube.B[8]), // DLB
    f(cube.D[8]) + f(cube.B[6]) + f(cube.R[8]), // DBR
  ];

  return [...edges, ...corners].join(' ');
}
