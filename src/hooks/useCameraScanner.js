import { useEffect, useRef } from 'react';

export function useCameraScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!navigator?.mediaDevices?.getUserMedia) return;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });

        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (e) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    }

    initCamera();
  }, []);

  function sampleColors(points) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    return points.map(({ x, y }) => {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      return { r: pixel[0], g: pixel[1], b: pixel[2] };
    });
  }

  return { videoRef, canvasRef, sampleColors };
}
