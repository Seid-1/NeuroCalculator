import React, { useRef, useEffect, useState } from "react";
import { X, Camera, Check } from "lucide-react";

interface CameraScannerProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setIsInitializing(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(
        "Unable to access camera. Please ensure permissions are granted."
      );
      console.error(err);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror if user facing, but typically we want environment.
        // Just draw directly for environment.
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get base64 string (JPEG for efficiency)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64Data = dataUrl.split(",")[1];

        stopCamera();
        onCapture(base64Data);
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-20">
        <span className="text-white font-medium tracking-wide drop-shadow-md">
          Scan Problem
        </span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2 bg-white/10 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Close"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Camera View */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-900">
        {error ? (
          <div className="px-8 text-center">
            <div className="text-red-400 mb-2 font-bold">Camera Error</div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              {/* Darkened areas */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Clear aperture */}
              <div className="w-72 h-48 md:w-80 md:h-56 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] rounded-2xl relative">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl -mt-1 -ml-1 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl -mt-1 -mr-1 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl -mb-1 -ml-1 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl -mb-1 -mr-1 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>

                {/* Scanning line animation */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            </div>

            {/* Hidden Canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="h-32 bg-black/90 flex justify-center items-center relative z-20">
        {!error && !isInitializing && (
          <button
            onClick={handleCapture}
            className="group relative"
            aria-label="Capture"
            title="Capture"
          >
            <div className="w-20 h-20 rounded-full border-4 border-white/30 group-hover:border-white/50 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
            </div>
          </button>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
