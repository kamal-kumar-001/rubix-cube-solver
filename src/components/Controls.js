import CubeScanner from "./CubeScanner";

export default function Controls({
  onMove,
  onReset,
  mode,
  setMode,
  onScanCamera,
  canSolve,
  onSolve,
  isPlaying,
  onFaceDetected,
  solutionMoves,
  solutionIndex,
  onNextStep,
  onPrevStep,
  onToggleAuto,
  isAutoPlaying,
}) {
  const moves = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"];
  const hasSolution = solutionMoves && solutionMoves.length > 0;
  const isSolved = hasSolution && solutionIndex >= solutionMoves.length;
  const nextMove = hasSolution && !isSolved ? solutionMoves[solutionIndex] : null;


  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('play')}
          className={`flex-1 py-2 rounded ${
            mode === 'play' ? 'bg-black text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Play
        </button>
        <button
          onClick={() => setMode('scan')}
          className={`flex-1 py-2 rounded ${
            mode === 'scan' ? 'bg-black text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Scan
        </button>
      </div>

      {/* Moves */}
      {mode === 'play' && (
        <div className="grid grid-cols-4 gap-2">
          {moves.map(m => (
            <button
              key={m}
              disabled={isPlaying}
              onClick={() => onMove(m)}
              className="rounded bg-neutral-800 text-white py-2"
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Scan tools */}
      {mode === 'scan' && (
        <CubeScanner onFaceDetected={onFaceDetected} />
        // <button
        //   onClick={onScanCamera}
        //   className="w-full rounded bg-blue-600 text-white py-2"
        // >
        //   Scan with Camera (coming soon)
        // </button>
      )}

      <button
        onClick={onReset}
        className="w-full rounded bg-red-500 text-white py-2"
      >
        Reset
      </button>
      <button
  disabled={!canSolve || isPlaying}
  onClick={onSolve}
  className={`w-full py-2 rounded ${
    canSolve
      ? 'bg-green-600 text-white'
      : 'bg-gray-300 text-gray-900 cursor-not-allowed'
  }`}
>
  Solve
</button>

      {hasSolution && (
        <div className="space-y-2 rounded border border-gray-200 p-3">
          <div className="text-sm text-gray-500 font-medium">
            Step {Math.min(solutionIndex + 1, solutionMoves.length)} / {solutionMoves.length}
          </div>
          <div className="text-sm text-gray-700">
            {isSolved ? 'Solved' : `Next move: ${nextMove}`}
          </div>
          <div className="flex gap-2">
            <button
              disabled={solutionIndex <= 0 || isPlaying || isAutoPlaying}
              onClick={onPrevStep}
              className="flex-1 rounded bg-neutral-800 text-white py-2"
            >
              Prev
            </button>
            <button
              disabled={isSolved || isPlaying || isAutoPlaying}
              onClick={onNextStep}
              className="flex-1 rounded bg-neutral-800 text-white py-2"
            >
              Next
            </button>
          </div>
          <button
            disabled={isSolved || isPlaying}
            onClick={onToggleAuto}
            className={`w-full rounded py-2 ${
              isAutoPlaying ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'
            }`}
          >
            {isAutoPlaying ? 'Pause Auto' : 'Auto Step (5s)'}
          </button>
        </div>
      )}

    </div>
  );
}
