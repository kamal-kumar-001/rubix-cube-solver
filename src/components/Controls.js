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
  onScan,
}) {
  const moves = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"];


  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('play')}
          className={`flex-1 py-2 rounded ${
            mode === 'play' ? 'bg-black text-white' : 'bg-gray-200'
          }`}
        >
          Play
        </button>
        <button
          onClick={() => setMode('scan')}
          className={`flex-1 py-2 rounded ${
            mode === 'scan' ? 'bg-black text-white' : 'bg-gray-200'
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
        <CubeScanner onScan={onScan}/>
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
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  Solve
</button>

    </div>
  );
}
