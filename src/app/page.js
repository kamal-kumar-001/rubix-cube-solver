"use client";
import ColorPicker from '@/components/ColorPicker';
import Controls from '@/components/Controls';
import Cube3D from '@/components/Cube3D';
import FlatCube from '@/components/FlatCube';
import { useCube } from '@/hooks/useCube';
import { cubeToSolverState } from '@/lib/cubeAdapter';
import { normalizeMoves } from '@/lib/normalizeMoves';
import { solver } from '@/lib/solver';
import { validateCube } from '@/lib/validator';
import { useState } from 'react';




export default function Home() {
  const {
  cube,
  mode,
  setMode,
  move,
  reset,
  setSticker,
  selectedColor,
  setSelectedColor,
  playSolution,
  isPlaying,
} = useCube();


  const validation = validateCube(cube);
  const [solveError, setSolveError] = useState('');

  
  function handleSolve() {
  setSolveError('');

  const validation = validateCube(cube);
  if (!validation.valid) {
    setSolveError('Cube is invalid. Please fix scan errors.');
    return;
  }

  const state = cubeToSolverState(cube);
  const result = solver.solve(state);

  if (result === false) {
    setSolveError('This cube configuration cannot be solved. Please check again');
    return;
  }

  if (!result) {
    setSolveError('Cube is already solved.');
    return;
  }

  const rawMoves = result.split(' ');
const moves = normalizeMoves(rawMoves);

// console.log(moves);
playSolution(moves);

}


  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">
        Rubik’s Cube Solver
      </h1>

      <div className="flex gap-6 flex-wrap justify-center">
        <div className="bg-white shadow rounded p-4">
  <Cube3D cube={cube} />
</div>
        <div className="bg-white shadow rounded p-4">
          <FlatCube
            cube={cube}
            scanMode={mode === 'scan'}
            onStickerClick={setSticker}
          />

{mode === 'scan' && (
  <div className="mt-4 space-y-3">
    <p className="text-sm font-medium text-center">
      Select color
    </p>
    <ColorPicker
      selected={selectedColor}
      onSelect={setSelectedColor}
    />
    {solveError && (
  <p className="mt-3 text-sm text-red-600 text-center font-medium">
    {solveError}
  </p>
)}
  </div>
)}
          {/* Validation status */}
          {mode === 'scan' && (
            <div className="mt-3 text-sm">
              {validation.valid ? (
                <p className="text-green-600 font-medium">
                  ✓ Cube is valid
                </p>
              ) : (
                <ul className="text-red-600 space-y-1">
                  {validation.errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="w-[320px] bg-white shadow rounded p-4">
          <Controls
            mode={mode}
            setMode={setMode}
            onMove={move}
            onReset={reset}
             onSolve={handleSolve}
  canSolve={validation.valid}
            onScanCamera={() => alert('Camera scanning coming next')}
          />
        </div>
      </div>
    </main>
  );
}
