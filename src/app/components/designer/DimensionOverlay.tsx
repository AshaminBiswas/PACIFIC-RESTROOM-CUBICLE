import { useMemo } from "react";
import { Html } from "@react-three/drei";
import { useDesignStore } from "../../../lib/designStore";

/**
 * DimensionOverlay — Shows width × depth × height labels on the selected
 * object using drei's Html component for crisp 2D text overlaid on 3D.
 */
export function DimensionOverlay() {
  const showDimensions = useDesignStore((s) => s.showDimensions);
  const selectedObject = useDesignStore((s) => s.getSelectedObject());

  const labels = useMemo(() => {
    if (!selectedObject) return null;
    const { position, dimensions } = selectedObject;

    // Convert dimensions from mm to scene units (metres) for positioning
    const w = dimensions.x / 1000;
    const h = dimensions.y / 1000;
    const d = dimensions.z / 1000;

    return {
      // Width label — along X, positioned at the bottom-front edge
      width: {
        pos: [position.x, position.y - h / 2 - 0.08, position.z + d / 2 + 0.1] as [number, number, number],
        text: `${dimensions.x}mm`,
        color: "#ff6b6b",
      },
      // Height label — along Y, positioned at the right edge
      height: {
        pos: [position.x + w / 2 + 0.12, position.y, position.z] as [number, number, number],
        text: `${dimensions.y}mm`,
        color: "#51cf66",
      },
      // Depth label — along Z, positioned at the bottom-right edge
      depth: {
        pos: [position.x + w / 2 + 0.05, position.y - h / 2 - 0.08, position.z] as [number, number, number],
        text: `${dimensions.z}mm`,
        color: "#74b9ff",
      },
    };
  }, [selectedObject]);

  if (!showDimensions || !labels) return null;

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 600,
    padding: "2px 7px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    userSelect: "none",
    pointerEvents: "none",
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  return (
    <group>
      {/* Width (X) */}
      <Html position={labels.width.pos} center distanceFactor={5} zIndexRange={[50, 0]}>
        <div
          style={{
            ...labelStyle,
            background: "rgba(255,107,107,0.15)",
            border: "1px solid rgba(255,107,107,0.4)",
            color: labels.width.color,
          }}
        >
          W {labels.width.text}
        </div>
      </Html>

      {/* Height (Y) */}
      <Html position={labels.height.pos} center distanceFactor={5} zIndexRange={[50, 0]}>
        <div
          style={{
            ...labelStyle,
            background: "rgba(81,207,102,0.15)",
            border: "1px solid rgba(81,207,102,0.4)",
            color: labels.height.color,
          }}
        >
          H {labels.height.text}
        </div>
      </Html>

      {/* Depth (Z) */}
      <Html position={labels.depth.pos} center distanceFactor={5} zIndexRange={[50, 0]}>
        <div
          style={{
            ...labelStyle,
            background: "rgba(116,185,255,0.15)",
            border: "1px solid rgba(116,185,255,0.4)",
            color: labels.depth.color,
          }}
        >
          D {labels.depth.text}
        </div>
      </Html>
    </group>
  );
}
