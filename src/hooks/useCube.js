import { useState, useRef } from 'react';
import { SOLVED_CUBE, applyMove } from '@/lib/cubeLogic';
import { CENTER_COLOR } from '@/lib/cubeConstants';
import { getStickerIndex } from '@/lib/stickerMap';

export function useCube() {
  const [cube, setCube] = useState(SOLVED_CUBE);
  const [mode, setMode] = useState('play');
  const [selectedColor, setSelectedColor] = useState('W');
  



  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef(null);
  const [solutionMovesState, setSolutionMovesState] = useState([]);
  const [solutionIndexState, setSolutionIndexState] = useState(0);
  const solutionMovesRef = useRef([]);
  const solutionIndexRef = useRef(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef(null);
  const autoInFlightRef = useRef(false);

  function playMove(move, animate3D, setCube) {
  return new Promise(resolve => {
    animate3D(move, () => {
      setCube(prev => applyMove(prev, move));
      resolve();
    });
  });
}


  async function move(notation, animate3D) {
  if (mode !== 'play' || isPlaying) return;

  setIsPlaying(true);
  await playMove(notation, animate3D, setCube);
  setIsPlaying(false);
}


  function reset() {
    stopPlayback();
    stopAutoPlay();
    clearSolution();
    setCube(SOLVED_CUBE);
  }

  function setSticker(face, index) {
    if (mode !== 'scan' || index === 4 || isPlaying) return;

    setCube(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[face][index] = selectedColor;
      return copy;
    });
  }

async function playSolution(moves, animate3D) {
  if (!moves.length) return;

  setIsPlaying(true);

  for (const move of moves) {
    await playMove(move, animate3D, setCube);
  }

  setIsPlaying(false);
}

function setSolution(moves) {
  stopAutoPlay();
  solutionMovesRef.current = moves;
  solutionIndexRef.current = 0;
  setSolutionMovesState(moves);
  setSolutionIndexState(0);
}

function clearSolution() {
  solutionMovesRef.current = [];
  solutionIndexRef.current = 0;
  setSolutionMovesState([]);
  setSolutionIndexState(0);
}

function invertMove(move) {
  if (move.endsWith("'")) return move.slice(0, -1);
  return `${move}'`;
}

async function nextSolutionStep(animate3D) {
  const moves = solutionMovesRef.current;
  const index = solutionIndexRef.current;
  if (index >= moves.length || isPlaying) return false;

  setIsPlaying(true);
  await playMove(moves[index], animate3D, setCube);
  setSolutionIndexState(index + 1);
  solutionIndexRef.current = index + 1;
  setIsPlaying(false);

  if (solutionIndexRef.current >= moves.length) {
    stopAutoPlay();
  }
  return true;
}

async function prevSolutionStep(animate3D) {
  const moves = solutionMovesRef.current;
  const index = solutionIndexRef.current;
  if (index <= 0 || isPlaying) return false;

  setIsPlaying(true);
  await playMove(invertMove(moves[index - 1]), animate3D, setCube);
  setSolutionIndexState(index - 1);
  solutionIndexRef.current = index - 1;
  setIsPlaying(false);
  return true;
}

function startAutoPlay(animate3D, delayMs = 5000) {
  if (isAutoPlaying || solutionMovesRef.current.length === 0) return;

  setIsAutoPlaying(true);
  autoPlayRef.current = setInterval(async () => {
    if (autoInFlightRef.current) return;
    autoInFlightRef.current = true;
    await nextSolutionStep(animate3D);
    autoInFlightRef.current = false;
  }, delayMs);
}

function stopAutoPlay() {
  if (autoPlayRef.current) {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = null;
  }
  setIsAutoPlaying(false);
}

function applyScannedFace(colors) {
  const center = colors[4];
  const face = faceFromCenter(center);

  if (!face) {
    alert('Unknown face scanned');
    return;
  }

  setCube(prev => ({
    ...prev,
    [face]: colors,
  }));
}

function fillFaceFromScan(face, colors) {
  setCube(prev => {
    const next = structuredClone(prev);

    let i = 0;
    for (let b = 1; b >= -1; b--) {
      for (let a = -1; a <= 1; a++) {
        const index = getStickerIndex(face, a, b);
        next[face][index] = colors[i++];
      }
    }

    // lock center
    next[face][4] = CENTER_COLOR[face];

    return next;
  });
}




  function stopPlayback() {
    if (playbackRef.current) {
      clearInterval(playbackRef.current);
      playbackRef.current = null;
    }
    setIsPlaying(false);
  }

  return {
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
    solutionMoves: solutionMovesState,
    solutionIndex: solutionIndexState,
    setSolution,
    clearSolution,
    nextSolutionStep,
    prevSolutionStep,
    startAutoPlay,
    stopAutoPlay,
    isAutoPlaying,
  };
}
