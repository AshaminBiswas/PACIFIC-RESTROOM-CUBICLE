import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useDesignStore,
  MATERIALS,
  type DesignObject,
  type ObjectType,
} from "../../../lib/designStore";

/* ─── Geometry by type ──────────────────────────────────────────────────── */

function ObjectGeometry({ type, dims }: { type: ObjectType; dims: THREE.Vector3 }) {
  switch (type) {
    case "wall":
    case "panel":
    case "door":
      return <boxGeometry args={[dims.x, dims.y, dims.z]} />;
    case "box":
      return <boxGeometry args={[dims.x, dims.y, dims.z]} />;
    case "cylinder":
      return <cylinderGeometry args={[dims.x / 2, dims.x / 2, dims.y, 32]} />;
    case "shelf":
      return <boxGeometry args={[dims.x, dims.y, dims.z]} />;
    default:
      return <boxGeometry args={[dims.x, dims.y, dims.z]} />;
  }
}

/* ─── Selection outline ─────────────────────────────────────────────────── */

function SelectionOutline({ dims, type }: { dims: THREE.Vector3; type: ObjectType }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + 0.1 * Math.sin(t * 3);
    }
  });

  const scale = 1.03;

  return (
    <mesh ref={ref} scale={[scale, scale, scale]}>
      {type === "cylinder" ? (
        <cylinderGeometry args={[dims.x / 2, dims.x / 2, dims.y, 32]} />
      ) : (
        <boxGeometry args={[dims.x, dims.y, dims.z]} />
      )}
      <meshBasicMaterial
        color="#7FB706"
        transparent
        opacity={0.2}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Edge highlight on hover ───────────────────────────────────────────── */

function HoverEdges({ dims, type }: { dims: THREE.Vector3; type: ObjectType }) {
  const geo = useMemo(() => {
    let g: THREE.BufferGeometry;
    if (type === "cylinder") {
      g = new THREE.CylinderGeometry(dims.x / 2, dims.x / 2, dims.y, 32);
    } else {
      g = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
    }
    return new THREE.EdgesGeometry(g);
  }, [dims.x, dims.y, dims.z, type]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#7FB706" linewidth={1} transparent opacity={0.7} />
    </lineSegments>
  );
}

/* ─── Main DesignObject Component ───────────────────────────────────────── */

interface DesignObjectProps {
  obj: DesignObject;
}

export function DesignObjectMesh({ obj }: DesignObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const selectedId = useDesignStore((s) => s.selectedId);
  const activeTool = useDesignStore((s) => s.activeTool);
  const selectObject = useDesignStore((s) => s.selectObject);
  const paintObject = useDesignStore((s) => s.paintObject);
  const removeObject = useDesignStore((s) => s.removeObject);

  const isSelected = selectedId === obj.id;

  // Find material definition
  const mat = MATERIALS.find((m) => m.id === obj.materialId) ?? MATERIALS[0];

  // Convert dimensions from mm → metres for the scene
  const dims = useMemo(
    () => new THREE.Vector3(obj.dimensions.x / 1000, obj.dimensions.y / 1000, obj.dimensions.z / 1000),
    [obj.dimensions.x, obj.dimensions.y, obj.dimensions.z]
  );

  const handleClick = (e: any) => {
    e.stopPropagation();

    if (obj.locked) return;

    if (activeTool === "paint") {
      paintObject(obj.id);
      return;
    }
    if (activeTool === "eraser") {
      removeObject(obj.id);
      return;
    }

    selectObject(obj.id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (!obj.locked) {
      setHovered(true);
      document.body.style.cursor =
        activeTool === "paint"
          ? "crosshair"
          : activeTool === "eraser"
            ? "not-allowed"
            : "pointer";
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "default";
  };

  if (!obj.visible) return null;

  // Special look for doors – slightly recessed appearance
  const isDoor = obj.type === "door";

  return (
    <group
      position={[obj.position.x, obj.position.y, obj.position.z]}
      rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
      scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <ObjectGeometry type={obj.type} dims={dims} />
        <meshStandardMaterial
          color={mat.color}
          roughness={mat.roughness}
          metalness={mat.metalness}
          transparent={mat.opacity < 1}
          opacity={mat.opacity}
          side={mat.opacity < 1 ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>

      {/* Door accent strip */}
      {isDoor && (
        <mesh position={[0, dims.y * 0.05, dims.z / 2 + 0.001]}>
          <planeGeometry args={[dims.x * 0.08, dims.y * 0.15]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {/* Selection glow */}
      {isSelected && <SelectionOutline dims={dims} type={obj.type} />}

      {/* Hover edge highlight */}
      {hovered && !isSelected && <HoverEdges dims={dims} type={obj.type} />}
    </group>
  );
}
