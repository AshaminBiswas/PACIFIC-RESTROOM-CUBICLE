import { motion } from "motion/react";
import { useDesignStore, type CameraPreset } from "../../../lib/designStore";

interface CubeFace {
  preset: CameraPreset;
  label: string;
  style: React.CSSProperties;
}

const FACES: CubeFace[] = [
  { preset: "top",         label: "TOP",    style: { top: 0,   left: "50%", transform: "translateX(-50%)" } },
  { preset: "front",       label: "FRONT",  style: { top: "50%", left: 0,   transform: "translateY(-50%)" } },
  { preset: "side",        label: "RIGHT",  style: { top: "50%", right: 0,  transform: "translateY(-50%)" } },
  { preset: "perspective", label: "3D",     style: { bottom: 0, left: "50%", transform: "translateX(-50%)" } },
];

export function ViewCube() {
  const setCameraPreset = useDesignStore((s) => s.setCameraPreset);
  const cameraPreset    = useDesignStore((s) => s.cameraPreset);

  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        width: 90,
        height: 90,
        zIndex: 20,
        userSelect: "none",
      }}
    >
      {/* Cube body */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: 8,
          background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          CUBE
        </span>
      </div>

      {/* Face buttons */}
      {FACES.map((face) => {
        const isActive = cameraPreset === face.preset;
        return (
          <motion.button
            key={face.preset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setCameraPreset(face.preset)}
            style={{
              position: "absolute",
              ...face.style,
              width: 32,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              border: isActive
                ? "1px solid #0078d4"
                : "1px solid rgba(255,255,255,0.15)",
              background: isActive
                ? "rgba(0,120,212,0.25)"
                : "rgba(30,30,30,0.9)",
              color: isActive ? "#60a8e8" : "rgba(255,255,255,0.6)",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              backdropFilter: "blur(4px)",
              transition: "all 0.15s",
              boxShadow: isActive ? "0 0 8px rgba(0,120,212,0.4)" : "none",
            }}
          >
            {face.label}
          </motion.button>
        );
      })}
    </div>
  );
}
