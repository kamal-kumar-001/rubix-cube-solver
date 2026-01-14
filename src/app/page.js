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
import { useRef, useState } from 'react';

import dynamic from 'next/dynamic';

const CameraScanner = dynamic(
  () => import('@/components/CubeScanner'),
  { ssr: false }
);



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
  fillFaceFromScan,
} = useCube();

const cube3DRef = useRef(null);



  const validation = validateCube(cube);
  const [solveError, setSolveError] = useState('');
  const [scanMode, setScanMode] = useState(false);

  
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
playSolution(moves, cube3DRef.current.animateMove);


}
 function onScan(){
  // applyScannedFace
  console.log(" hi");
  
 }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">
        Rubik’s Cube Solver
      </h1>

      <div className="flex gap-6 flex-wrap justify-center">
        <div className="bg-gray-400 shadow rounded p-4">
  <Cube3D ref={cube3DRef} cube={cube} />

</div>
        <div className="bg-gray-400 shadow rounded p-4">
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
            onMove={(m) => move(m, cube3DRef.current.animateMove)}
            onReset={reset}
             onSolve={handleSolve}
             isPlaying={isPlaying}
  canSolve={validation.valid}
            onScan={onScan}
          />
          {scanMode && (
  <CameraScanner
    onFaceDetected={(face, colors) => {
      fillFaceFromScan(face, colors);
    }}
  />
)}
<button onClick={() => setScanMode(s => !s)}>
  {scanMode ? 'Stop Scan' : 'Scan Cube'}
</button>

        </div>
      </div>
    </main>
  );
}
