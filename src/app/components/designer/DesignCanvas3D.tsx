import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  TransformControls,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { useDesignStore, type CameraPreset, type ToolType } from "../../../lib/designStore";
import { DesignObjectMesh } from "./DesignObject";
import { DimensionOverlay } from "./DimensionOverlay";
import { GridFloor } from "./GridFloor";

/* ─── Camera Preset Positions ─────────────────────────────────────────── */

const CAMERA_PRESETS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  perspective: { position: [4, 3, 5],    target: [0, 0.5, 0] },
  front:       { position: [0, 1.2, 6],  target: [0, 1.2, 0] },
  top:         { position: [0, 8, 0.001], target: [0, 0, 0] },
  side:        { position: [6, 1.2, 0],  target: [0, 1.2, 0] },
};

/* ─── Camera Controller ───────────────────────────────────────────────── */

function CameraController() {
  const cameraPreset  = useDesignStore((s) => s.cameraPreset);
  const cameraResetKey = useDesignStore((s) => s.cameraResetKey);
  const { camera }    = useThree();
  const controlsRef   = useRef<any>(null);

  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraPreset];
    camera.position.set(...preset.position);
    camera.lookAt(...preset.target);
    if (controlsRef.current) {
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, [cameraPreset, cameraResetKey, camera]);

  const activeTool = useDesignStore((s) => s.activeTool);
  const isDrawing  = activeTool.startsWith("draw_");

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.12}
      minDistance={1}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2 - 0.05}
      mouseButtons={{
        LEFT:   isDrawing ? undefined as any : THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT:  THREE.MOUSE.PAN,
      }}
    />
  );
}

/* ─── Crosshair Ghost (cursor follow for draw tools) ─────────────────── */

function CrosshairGhost() {
  const activeTool  = useDesignStore((s) => s.activeTool);
  const drawState   = useDesignStore((s) => s.drawState);
  const setCursorPos = useDesignStore((s) => s.setCursorPos);
  const snap        = useDesignStore((s) => s.snap);
  const [ghostPos, setGhostPos] = useState<[number, number, number]>([0, 0, 0]);
  const isDrawTool  = activeTool.startsWith("draw_") || activeTool === "measure";

  useFrame(({ raycaster, pointer, camera }) => {
    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    if (intersection) {
      const sx = snap(intersection.x);
      const sz = snap(intersection.z);
      setGhostPos([sx, 0, sz]);
      // Update store for command line display
      setCursorPos({ x: sx, y: intersection.y, z: sz });
    }
  });

  if (!isDrawTool || drawState.isDrawing) return null;

  return (
    <group position={ghostPos}>
      {/* Horizontal crosshair lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.002]} />
        <meshBasicMaterial color="#0078d4" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <planeGeometry args={[0.6, 0.002]} />
        <meshBasicMaterial color="#0078d4" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {/* Center dot */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#0078d4" transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Drawing Plane ───────────────────────────────────────────────────── */

function DrawingPlane() {
  const activeTool        = useDesignStore((s) => s.activeTool);
  const startDraw         = useDesignStore((s) => s.startDraw);
  const updateDrawPreview = useDesignStore((s) => s.updateDrawPreview);
  const finishDraw        = useDesignStore((s) => s.finishDraw);
  const selectObject      = useDesignStore((s) => s.selectObject);
  const drawState         = useDesignStore((s) => s.drawState);
  const snap              = useDesignStore((s) => s.snap);

  const isDrawTool = activeTool.startsWith("draw_");

  const getHitPoint = useCallback(
    (e: any): THREE.Vector3 | null => {
      if (!e.point) return null;
      return new THREE.Vector3(snap(e.point.x), 0, snap(e.point.z));
    },
    [snap]
  );

  const handlePointerDown = useCallback(
    (e: any) => {
      if (!isDrawTool) {
        selectObject(null);
        return;
      }
      e.stopPropagation();
      const pt = getHitPoint(e);
      if (pt) startDraw({ x: pt.x, y: pt.y, z: pt.z });
    },
    [isDrawTool, getHitPoint, startDraw, selectObject]
  );

  const handlePointerMove = useCallback(
    (e: any) => {
      if (!drawState.isDrawing) return;
      e.stopPropagation();
      const pt = getHitPoint(e);
      if (pt) updateDrawPreview({ x: pt.x, y: pt.y, z: pt.z });
    },
    [drawState.isDrawing, getHitPoint, updateDrawPreview]
  );

  const handlePointerUp = useCallback(
    (e: any) => {
      if (!drawState.isDrawing) return;
      e.stopPropagation();
      const pt = getHitPoint(e);
      if (pt) finishDraw({ x: pt.x, y: pt.y, z: pt.z });
    },
    [drawState.isDrawing, getHitPoint, finishDraw]
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.002, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      visible={true}
    >
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/* ─── Draw Preview Rect ───────────────────────────────────────────────── */

function DrawPreview() {
  const drawState = useDesignStore((s) => s.drawState);

  if (!drawState.isDrawing || !drawState.drawStart || !drawState.drawPreview) return null;

  const s = drawState.drawStart;
  const e = drawState.drawPreview;
  const cx = (s.x + e.x) / 2;
  const cz = (s.z + e.z) / 2;
  const w  = Math.abs(e.x - s.x) || 0.05;
  const d  = Math.abs(e.z - s.z) || 0.05;

  return (
    <group>
      {/* Fill preview */}
      <mesh position={[cx, 0.01, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#0078d4" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Outline edges */}
      <lineSegments position={[cx, 0.012, cz]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial color="#0078d4" transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
}

/* ─── Transform Gizmo ─────────────────────────────────────────────────── */

function ObjectTransformControls() {
  const selectedObject  = useDesignStore((s) => s.getSelectedObject());
  const activeTool      = useDesignStore((s) => s.activeTool);
  const updateObject    = useDesignStore((s) => s.updateObject);
  const _pushHistory    = useDesignStore((s) => s._pushHistory);
  const meshRef         = useRef<THREE.Group>(null);

  const mode = useMemo(() => {
    if (activeTool === "move")   return "translate" as const;
    if (activeTool === "rotate") return "rotate"    as const;
    if (activeTool === "scale")  return "scale"     as const;
    return null;
  }, [activeTool]);

  useEffect(() => {
    if (meshRef.current && selectedObject) {
      meshRef.current.position.set(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      meshRef.current.rotation.set(selectedObject.rotation.x, selectedObject.rotation.y, selectedObject.rotation.z);
      meshRef.current.scale.set(selectedObject.scale.x, selectedObject.scale.y, selectedObject.scale.z);
    }
  }, [selectedObject?.id, selectedObject?.position, selectedObject?.rotation, selectedObject?.scale]);

  if (!selectedObject || !mode || selectedObject.locked) return null;

  return (
    <TransformControls
      mode={mode}
      size={0.6}
      object={meshRef.current || undefined}
      onMouseDown={() => _pushHistory()}
      onMouseUp={() => {
        if (!meshRef.current) return;
        const p = meshRef.current.position;
        const r = meshRef.current.rotation;
        const sc = meshRef.current.scale;
        updateObject(selectedObject.id, {
          position: { x: p.x,  y: p.y,  z: p.z  },
          rotation: { x: r.x,  y: r.y,  z: r.z  },
          scale:    { x: sc.x, y: sc.y, z: sc.z },
        });
      }}
    >
      <group ref={meshRef} />
    </TransformControls>
  );
}

/* ─── Scene Content ───────────────────────────────────────────────────── */

function SceneContent() {
  const objects = useDesignStore((s) => s.objects);

  return (
    <>
      {/* Lighting — slightly warmer/brighter for the CAD dark theme */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <directionalLight position={[0, 2, -5]} intensity={0.2} color="#4488ff" />

      <Environment preset="city" />
      <ContactShadows position={[0, 0, 0]} opacity={0.25} scale={20} blur={3} far={5} />

      <GridFloor />

      {objects.map((obj) => (
        <DesignObjectMesh key={obj.id} obj={obj} />
      ))}

      <DimensionOverlay />
      <CrosshairGhost />
      <DrawingPlane />
      <DrawPreview />
      <ObjectTransformControls />
      <CameraController />
    </>
  );
}

/* ─── Main Canvas Export ─────────────────────────────────────────────── */

export function DesignCanvas3D() {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 3, 5], fov: 50, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        // Needed for PNG export
        preserveDrawingBuffer: true,
      }}
      style={{ background: "transparent" }}
      onPointerMissed={() => {
        useDesignStore.getState().selectObject(null);
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
