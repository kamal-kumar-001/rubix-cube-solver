class RubiksCubeSolver {
  constructor() {
    this.phase = 0;
    this.currentState = null;
    this.goalState = null;
    this.solution = '';
  }

  applyMove(move, inState) {
    const affectedCubies = [
      [0, 1, 2, 3, 0, 1, 2, 3],   // U
      [4, 7, 6, 5, 4, 5, 6, 7],   // D
      [0, 9, 4, 8, 0, 3, 5, 4],   // F
      [2, 10, 6, 11, 2, 1, 7, 6], // B
      [3, 11, 7, 9, 3, 2, 6, 5],  // L
      [1, 8, 5, 10, 1, 0, 4, 7],  // R
    ];

    let turns = (move % 3) + 1;
    const face = Math.floor(move / 3);
    let state = inState.slice();

    while (turns-- > 0) {
      const oldState = state.slice();
      for (let i = 0; i < 8; i++) {
        const isCorner = i > 3;
        const target = affectedCubies[face][i] + isCorner * 12;
        const killer =
          affectedCubies[face][(i & 3) === 3 ? i - 3 : i + 1] +
          isCorner * 12;

        const orientationDelta =
          i < 4
            ? face > 1 && face < 4
            : face < 2
            ? 0
            : 2 - (i & 1);

        state[target] = oldState[killer];
        state[target + 20] = oldState[killer + 20] + orientationDelta;

        if (turns === 0) {
          state[target + 20] %= 2 + isCorner;
        }
      }
    }
    return state;
  }

  inverse(move) {
    return move + 2 - 2 * (move % 3);
  }

  getId(state) {
    // Phase 1: Edge orientations
    if (this.phase < 2) {
      return JSON.stringify(state.slice(20, 32));
    }

    // Phase 2: Corner orientations + E slice
    if (this.phase < 3) {
      const result = state.slice(31, 40);
      for (let e = 0; e < 12; e++) {
        result[0] |= (Math.floor(state[e] / 8)) << e;
      }
      return JSON.stringify(result);
    }

    // Phase 3: Parity + slices
    if (this.phase < 4) {
      const result = [0, 0, 0];
      for (let e = 0; e < 12; e++) {
        result[0] |= ((state[e] > 7 ? 2 : state[e] & 1)) << (2 * e);
      }
      for (let c = 0; c < 8; c++) {
        result[1] |= ((state[c + 12] - 12) & 5) << (3 * c);
      }
      for (let i = 12; i < 20; i++) {
        for (let j = i + 1; j < 20; j++) {
          result[2] ^= state[i] > state[j];
        }
      }
      return JSON.stringify(result);
    }

    // Phase 4: Full state
    return JSON.stringify(state);
  }

  setState(cube) {
    const parts = cube.split(' ');
    if (parts.length !== 20) {
      this.currentState = 'Not enough cubies provided';
      return false;
    }

    const goal = [
      'UF', 'UR', 'UB', 'UL',
      'DF', 'DR', 'DB', 'DL',
      'FR', 'FL', 'BR', 'BL',
      'UFR', 'URB', 'UBL', 'ULF',
      'DRF', 'DFL', 'DLB', 'DBR'
    ];

    this.currentState = new Array(40).fill(0);
    this.goalState = new Array(40).fill(0);

    for (let i = 0; i < 20; i++) {
      this.goalState[i] = i;

      let cubie = parts[i];
      while ((this.currentState[i] = goal.indexOf(cubie)) === -1) {
        cubie = cubie.slice(1) + cubie[0];
        this.currentState[i + 20]++;
        if (this.currentState[i + 20] > 2) {
          this.currentState = 'Cannot solve: Invalid cube';
          return false;
        }
      }
      goal[goal.indexOf(cubie)] = '';
    }

    return this.verifyState();
  }

  verifyState() {
    if (!Array.isArray(this.currentState)) return false;

    let sum = this.currentState.slice(20, 32).reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) {
      this.currentState = 'Edge orientation error';
      return false;
    }

    sum = this.currentState.slice(32, 40).reduce((a, b) => a + b, 0);
    if (sum % 3 !== 0) {
      this.currentState = 'Corner orientation error';
      return false;
    }

    const getParity = (arr) => {
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
          if (arr[j] > arr[i]) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            count++;
          }
        }
      }
      return count;
    };

    sum =
      getParity(this.currentState.slice(0, 12)) +
      getParity(this.currentState.slice(12, 20));

    if (sum % 2 !== 0) {
      this.currentState = 'Parity error';
      return false;
    }

    return true;
  }

  solve(cube) {
    this.solution = '';
    this.phase = 0;

    if (cube && !this.setState(cube)) return false;
    if (!cube && !this.verifyState()) return false;

    while (++this.phase < 5) {
      this.startPhase();
    }

    this.prepareSolution();
    return this.solution;
  }

  startPhase() {
    const currentId = this.getId(this.currentState);
    const goalId = this.getId(this.goalState);
    if (currentId === goalId) return;

    const queue = [this.currentState, this.goalState];
    const direction = { [currentId]: 1, [goalId]: 2 };
    const predecessor = {};
    const lastMove = {};

    const applicableMoves = [0, 262143, 259263, 74943, 74898];

    while (true) {
      const oldState = queue.shift();
      const oldId = this.getId(oldState);
      const oldDir = direction[oldId];

      for (let move = 0; move < 18; move++) {
        if (!(applicableMoves[this.phase] & (1 << move))) continue;

        const newState = this.applyMove(move, oldState);
        const newId = this.getId(newState);

        if (direction[newId] && direction[newId] !== oldDir) {
          let m = move;
          let a = oldId, b = newId;

          if (oldDir > 1) {
            [a, b] = [b, a];
            m = this.inverse(move);
          }

          const algorithm = [m];
          while (a !== currentId) {
            algorithm.unshift(lastMove[a]);
            a = predecessor[a];
          }
          while (b !== goalId) {
            algorithm.push(this.inverse(lastMove[b]));
            b = predecessor[b];
          }

          for (const mv of algorithm) {
            for (let i = 0; i < (mv % 3) + 1; i++) {
              this.solution += 'UDFBLR'[Math.floor(mv / 3)];
            }
            this.currentState = this.applyMove(mv, this.currentState);
          }
          return;
        }

        if (!direction[newId]) {
          direction[newId] = oldDir;
          lastMove[newId] = move;
          predecessor[newId] = oldId;
          queue.push(newState);
        }
      }
    }
  }

  prepareSolution() {
    const moves = this.solution.match(/(\w)\1*/g);
    if (!moves) return (this.solution = '');

    const result = [];
    for (const m of moves) {
      const len = m.length % 4;
      if (len === 1) result.push(m[0]);
      else if (len === 2) result.push(`${m[0]}2`);
      else if (len === 3) result.push(`${m[0]}'`);
    }
    this.solution = result.join(' ');
  }
}

export default RubiksCubeSolver;
export const solver = new RubiksCubeSolver();
