import { useState, useRef } from 'react';
import { SOLVED_CUBE, applyMove } from '@/lib/cubeLogic';

export function useCube() {
  const [cube, setCube] = useState(SOLVED_CUBE);
  const [mode, setMode] = useState('play');
  const [selectedColor, setSelectedColor] = useState('W');

  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef(null);

  function move(notation) {
    if (mode !== 'play' || isPlaying) return;
    setCube(prev => applyMove(prev, notation));
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

function playSolution(moves) {

  setIsPlaying(true);

  let i = 0;

  const step = () => {
    const move = moves[i]; 
    setCube(prev => applyMove(prev, move));
    i++;

    if (i < moves.length) {
      playbackRef.current = setTimeout(step, 500);
    } else {
      setIsPlaying(false);
    }
  };

  step();
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
