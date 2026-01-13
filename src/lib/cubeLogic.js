

export const SOLVED_CUBE = {
  U: Array(9).fill('W'),
  D: Array(9).fill('Y'),
  F: Array(9).fill('G'),
  B: Array(9).fill('B'),
  L: Array(9).fill('O'),
  R: Array(9).fill('R'),
};

export function cloneCube(cube) {
  return JSON.parse(JSON.stringify(cube));
}

/* ------------------ helpers ------------------ */

function rotateFaceCW(face) {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ];
}

function rotateFaceCCW(face) {
  return [
    face[2], face[5], face[8],
    face[1], face[4], face[7],
    face[0], face[3], face[6],
  ];
}

/* ------------------ moves ------------------ */

export function applyMove(cube, move) {

    if (move?.endsWith("'")) {
    let c = cube;
    const base = move[0];
    for (let i = 0; i < 3; i++) {
      c = applyMove(c, base);
    }
    return c;
  }
   
  const c = cloneCube(cube);

  switch (move) {
    case 'U': {
      c.U = rotateFaceCW(c.U);

      const [f0, f1, f2] = c.F.slice(0, 3);
      c.F.splice(0, 3, ...c.R.slice(0, 3));
      c.R.splice(0, 3, ...c.B.slice(0, 3));
      c.B.splice(0, 3, ...c.L.slice(0, 3));
      c.L.splice(0, 3, f0, f1, f2);
      break;
    }

    case 'D': {
      c.D = rotateFaceCW(c.D);

      const [f6, f7, f8] = c.F.slice(6, 9);
      c.F.splice(6, 3, ...c.L.slice(6, 9));
      c.L.splice(6, 3, ...c.B.slice(6, 9));
      c.B.splice(6, 3, ...c.R.slice(6, 9));
      c.R.splice(6, 3, f6, f7, f8);
      break;
    }

    case 'F': {
      c.F = rotateFaceCW(c.F);

      const u = [c.U[6], c.U[7], c.U[8]];
      c.U[6] = c.L[8]; c.U[7] = c.L[5]; c.U[8] = c.L[2];
      c.L[2] = c.D[0]; c.L[5] = c.D[1]; c.L[8] = c.D[2];
      c.D[0] = c.R[6]; c.D[1] = c.R[3]; c.D[2] = c.R[0];
      c.R[0] = u[0]; c.R[3] = u[1]; c.R[6] = u[2];
      break;
    }

    case 'B': {
      c.B = rotateFaceCW(c.B);

      const u = [c.U[0], c.U[1], c.U[2]];
      c.U[0] = c.R[2]; c.U[1] = c.R[5]; c.U[2] = c.R[8];
      c.R[2] = c.D[8]; c.R[5] = c.D[7]; c.R[8] = c.D[6];
      c.D[6] = c.L[0]; c.D[7] = c.L[3]; c.D[8] = c.L[6];
      c.L[0] = u[2]; c.L[3] = u[1]; c.L[6] = u[0];
      break;
    }

    case 'L': {
      c.L = rotateFaceCW(c.L);

      const u = [c.U[0], c.U[3], c.U[6]];
      c.U[0] = c.B[8]; c.U[3] = c.B[5]; c.U[6] = c.B[2];
      c.B[2] = c.D[6]; c.B[5] = c.D[3]; c.B[8] = c.D[0];
      c.D[0] = c.F[0]; c.D[3] = c.F[3]; c.D[6] = c.F[6];
      c.F[0] = u[0]; c.F[3] = u[1]; c.F[6] = u[2];
      break;
    }

    case 'R': {
      c.R = rotateFaceCW(c.R);

      const u = [c.U[2], c.U[5], c.U[8]];
      c.U[2] = c.F[2]; c.U[5] = c.F[5]; c.U[8] = c.F[8];
      c.F[2] = c.D[2]; c.F[5] = c.D[5]; c.F[8] = c.D[8];
      c.D[2] = c.B[6]; c.D[5] = c.B[3]; c.D[8] = c.B[0];
      c.B[0] = u[2]; c.B[3] = u[1]; c.B[6] = u[0];
      break;
    }

    default:
      return cube;
  }

  return c;
}

export const COLORS_ORDER = ['W', 'R', 'B', 'O', 'G', 'Y'];

export function nextColor(current) {
  const idx = COLORS_ORDER.indexOf(current);
  return COLORS_ORDER[(idx + 1) % COLORS_ORDER.length];
}
