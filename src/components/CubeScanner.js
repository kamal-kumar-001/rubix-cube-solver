'use client';

import { useEffect } from 'react';
import { useCameraScanner } from '@/hooks/useCameraScanner';
import { closestCubeColor } from '@/lib/colorUtils';
import { FACE_BY_CENTER } from '@/lib/cubeConstants';

export default function CameraScanner({ onFaceDetected }) {
  const { videoRef, canvasRef, sampleColors } = useCameraScanner();

useEffect(() => {
  if (typeof window === 'undefined') return;
  if (!navigator?.mediaDevices?.getUserMedia) {
    console.error('Camera API not supported');
    return;
  }

  async function initCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      console.warn('Environment camera failed, falling back', err);

      // 🔁 fallback for laptops
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  }

  initCamera();
}, []);


  return (
    <div className="relative">
      <video ref={videoRef} className="w-full rounded-lg" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="border border-white/40" />
        ))}
      </div>
    </div>
  );
}
