import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import CubicleModel from "./CubicleModel";
import { useCubicleStore } from "../../../lib/cubicleStore";
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Rotate3d,
  Compass
} from "lucide-react";

// Helper component to listen for reset camera trigger and handle controls
function CameraController({ orbitControlsRef }: { orbitControlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const resetCameraKey = useCubicleStore((state) => state.resetCameraKey);

  useEffect(() => {
    if (resetCameraKey > 0) {
      // Smooth reset of camera position
      camera.position.set(2.8, 2.2, 3.8);
      camera.lookAt(0, 0.5, 0);
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, 0.5, 0);
        orbitControlsRef.current.update();
      }
    }
  }, [resetCameraKey, camera, orbitControlsRef]);

  return null;
}

export default function CubicleViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const incrementResetCamera = useCubicleStore((state) => state.incrementResetCamera);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error enabling fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Monitor fullscreen changes (e.g. if user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Zoom helpers
  const handleZoom = (factor: number) => {
    if (!orbitControlsRef.current) return;
    const controls = orbitControlsRef.current;
    
    // Zoom in/out by adjusting target distance (radius)
    // R3F OrbitControls zoom is controlled by camera zoom (ortho) or camera translation (perspective)
    const camera = controls.object;
    if (camera) {
      camera.position.multiplyScalar(factor);
      controls.update();
    }
  };

  const resetView = () => {
    incrementResetCamera();
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 border border-white/10 shadow-2xl transition-all ${
        isFullscreen ? "h-screen w-screen rounded-none z-50 fixed inset-0" : ""
      }`}
    >
      {/* 3D Canvas */}
      <Canvas 
        shadows 
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <PerspectiveCamera makeDefault position={[2.8, 2.2, 3.8]} fov={50} />
        
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          castShadow 
          position={[5, 8, 5]} 
          intensity={1.2} 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0001} 
        />
        <pointLight position={[-4, 5, -3]} intensity={0.5} />
        <spotLight position={[0, 5, 0]} intensity={0.3} penumbra={1} castShadow />

        {/* Dynamic Model */}
        <CubicleModel />

        {/* Orbit Controls */}
        <OrbitControls 
          ref={orbitControlsRef} 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // don't go under floor
          minDistance={1.5}
          maxDistance={8}
          target={[0, 0.5, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
        />

        {/* Camera controller for triggers */}
        <CameraController orbitControlsRef={orbitControlsRef} />
      </Canvas>

      {/* Floating 3D Control Overlay */}
      <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl z-10">
        {/* Auto Rotate */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
            autoRotate 
              ? "bg-[#7FB706] text-black shadow-lg shadow-[#7FB706]/20" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          title="Toggle Auto Rotate"
        >
          <Rotate3d className="w-5 h-5" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom(0.85)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:scale-105 active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(1.15)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:scale-105 active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        {/* Reset View */}
        <button
          onClick={resetView}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:scale-105 active:scale-95"
          title="Reset Camera View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover:scale-105 active:scale-95 border-l border-white/10 pl-3 ml-1"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Floating Compass Indicator */}
      <div className="absolute top-6 left-6 pointer-events-none bg-slate-950/60 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/5 flex items-center space-x-2 text-xs text-gray-400">
        <Compass className={`w-4 h-4 text-[#B5F823] ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: '6s' }} />
        <span className="font-mono tracking-wider text-[10px]">3D INTERACTIVE VIEWER</span>
      </div>
    </div>
  );
}
