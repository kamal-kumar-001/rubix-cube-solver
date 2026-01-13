import { useState, useRef } from 'react';
import { SOLVED_CUBE, applyMove } from '@/lib/cubeLogic';

export function useCube() {
  const [cube, setCube] = useState(SOLVED_CUBE);
  const [mode, setMode] = useState('play');
  const [selectedColor, setSelectedColor] = useState('W');


  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef(null);

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
  };
}
