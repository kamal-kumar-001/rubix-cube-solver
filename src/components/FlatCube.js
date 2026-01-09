const COLORS = {
  W: 'bg-white',
  Y: 'bg-yellow-400',
  G: 'bg-green-500',
  B: 'bg-blue-500',
  O: 'bg-orange-500',
  R: 'bg-red-500',
};

function Face({ faceKey, face, onClick, scanMode }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {face.map((color, i) => (
        <div
          key={i}
          onClick={() => scanMode && onClick(faceKey, i)}
          className={`
            w-8 h-8 border border-black
            ${COLORS[color]}
            ${scanMode ? 'cursor-pointer hover:scale-105' : ''}
          `}
        />
      ))}
    </div>
  );
}

export default function FlatCube({ cube, onStickerClick, scanMode }) {
  return (
    <div className="space-y-2 select-none">
      <div className="flex justify-center">
        <Face faceKey="U" face={cube.U} onClick={onStickerClick} scanMode={scanMode} />
      </div>

      <div className="flex gap-2 justify-center">
        <Face faceKey="L" face={cube.L} onClick={onStickerClick} scanMode={scanMode} />
        <Face faceKey="F" face={cube.F} onClick={onStickerClick} scanMode={scanMode} />
        <Face faceKey="R" face={cube.R} onClick={onStickerClick} scanMode={scanMode} />
        <Face faceKey="B" face={cube.B} onClick={onStickerClick} scanMode={scanMode} />
      </div>

      <div className="flex justify-center">
        <Face faceKey="D" face={cube.D} onClick={onStickerClick} scanMode={scanMode} />
      </div>
    </div>
  );
}
