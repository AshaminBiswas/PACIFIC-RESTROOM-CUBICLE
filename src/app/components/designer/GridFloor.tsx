import { useRef } from "react";
import { Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";
import { useDesignStore } from "../../../lib/designStore";

/**
 * GridFloor – Renders an infinite‑style grid on the XZ plane with major/minor
 * lines, axis colour indicators, and shadow reception.
 */
export function GridFloor() {
  const showGrid = useDesignStore((s) => s.showGrid);
  const gridSize = useDesignStore((s) => s.gridSize);
  const meshRef = useRef<THREE.Mesh>(null);

  if (!showGrid) return null;

  // Convert mm grid size to metres for the 3D scene
  const cellSize = gridSize / 1000;
  const sectionSize = cellSize * 10;

  return (
    <group>
      {/* Grid helper from drei */}
      <Grid
        args={[30, 30]}
        cellSize={cellSize}
        sectionSize={sectionSize}
        cellColor="#2a2a3e"
        sectionColor="#4a4a6e"
        cellThickness={0.6}
        sectionThickness={1.2}
        fadeDistance={20}
        fadeStrength={1.5}
        infiniteGrid
        position={[0, 0, 0]}
      />

      {/* Shadow‑receiving ground plane */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>

      {/* Axis indicators — short coloured lines at the origin */}
      {/* X axis (red) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0.002, 0, 2, 0.002, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff4060" linewidth={2} />
      </line>

      {/* Z axis (blue) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0.002, 0, 0, 0.002, 2])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4080ff" linewidth={2} />
      </line>

      {/* Gizmo viewport helper — bottom‑right orientation cube */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport
          axisColors={["#ff4060", "#40c040", "#4080ff"]}
          labelColor="white"
        />
      </GizmoHelper>
    </group>
  );
}
