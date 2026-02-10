import { useEffect, useRef, useState } from 'react';

export function useCameraScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!navigator?.mediaDevices?.getUserMedia) return;

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  async function startCamera() {
    if (isStarting || streamRef.current) return;
    setError('');
    setIsStarting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });

      streamRef.current = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(() => {});
        setIsReady(true);
      };
    } catch (e) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        streamRef.current = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
          setIsReady(true);
        };
      } catch (err) {
        setError('Camera permission denied or unavailable.');
      }
    } finally {
      setIsStarting(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }

  function sampleColors(points, sampleSize = 10) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const half = Math.floor(sampleSize / 2);

    return points.map(({ x, y }) => {
      const sx = Math.max(0, Math.floor(x - half));
      const sy = Math.max(0, Math.floor(y - half));
      const sw = Math.min(sampleSize, canvas.width - sx);
      const sh = Math.min(sampleSize, canvas.height - sy);
      const data = ctx.getImageData(sx, sy, sw, sh).data;

      let r = 0, g = 0, b = 0;
      const count = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      };
    });
  }

  return {
    videoRef,
    canvasRef,
    sampleColors,
    startCamera,
    stopCamera,
    isReady,
    isStarting,
    error,
  };
}
