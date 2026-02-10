'use client';

import { useState } from 'react';
import { useCameraScanner } from '@/hooks/useCameraScanner';
import { closestCubeColor } from '@/lib/colorUtils';
import { FACE_BY_CENTER } from '@/lib/cubeConstants';

export default function CameraScanner({ onFaceDetected }) {
  const {
    videoRef,
    canvasRef,
    sampleColors,
    startCamera,
    stopCamera,
    isReady,
    isStarting,
    error: cameraError,
  } = useCameraScanner();
  const [status, setStatus] = useState('Align a face in the grid, then capture.');
  const [error, setError] = useState('');

  function getSamplePoints(video) {
    const w = video.videoWidth;
    const h = video.videoHeight;
    const gridSize = Math.min(w, h) * 0.6;
    const left = (w - gridSize) / 2;
    const top = (h - gridSize) / 2;
    const step = gridSize / 3;

    const points = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        points.push({
          x: left + step * (col + 0.5),
          y: top + step * (row + 0.5),
        });
      }
    }
    return points;
  }

  function handleCapture() {
    setError('');
    const video = videoRef.current;
    if (!isReady || !video || video.videoWidth === 0) {
      setError('Camera not ready yet. Please wait a moment.');
      return;
    }

    const points = getSamplePoints(video);
    const rgbSamples = sampleColors(points, 12);
    const colors = rgbSamples.map(closestCubeColor);
    const center = colors[4];
    const face = FACE_BY_CENTER[center];
    if (!face) {
      setError('Center color not recognized. Try better lighting.');
      return;
    }

    setStatus(`Detected ${face} face (center ${center}).`);
    onFaceDetected?.(face, colors);
  }


  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={startCamera}
          disabled={isReady || isStarting}
          className={`flex-1 rounded py-2 ${
            isReady ? 'bg-gray-300 text-gray-600' : 'bg-emerald-600 text-white'
          }`}
        >
          {isReady ? 'Camera On' : isStarting ? 'Starting...' : 'Start Camera'}
        </button>
        <button
          onClick={stopCamera}
          disabled={!isReady}
          className="flex-1 rounded bg-gray-600  py-2"
        >
          Stop Camera
        </button>
      </div>

      <div className="relative">
        <video ref={videoRef} className="w-full rounded-lg" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/40" />
          ))}
        </div>
      </div>

      <button
        onClick={handleCapture}
        className="w-full rounded bg-blue-600 text-white py-2"
      >
        Capture Face
      </button>

      {status && (
        <div className="text-xs text-gray-700">
          {status}
        </div>
      )}
      {(error || cameraError) && (
        <div className="text-xs text-red-600">
          {error || cameraError}
        </div>
      )}

    </div>
  );
}
