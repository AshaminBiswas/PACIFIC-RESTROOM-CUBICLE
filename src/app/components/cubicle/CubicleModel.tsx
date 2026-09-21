import React from "react";
import { useCubicleStore } from "../../../lib/cubicleStore";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function CubicleModel() {
  const { category, model, dimensions, materials, accessories, getStallCount, getLockerGrid } = useCubicleStore();

  // Convert dimensions from mm to meters
  const w = dimensions.width / 1000;
  const d = dimensions.depth / 1000;
  const h = dimensions.height / 1000;

  // Color mappings based on materials.finish selection
  const getFinishColor = (finishOverride?: string) => {
    const activeFinish = finishOverride || materials.finish;
    switch (activeFinish) {
      case "cream":
        return "#f5f3e9"; // Cream (Image 2, 3)
      case "sage":
        return "#7f9282"; // Sage green (Image 3, 5)
      case "purple":
        return "#6b4a62"; // Royal purple (Image 4)
      case "oak":
        return "#cf9d6f"; // Natural Oak Wood grain hue
      case "charcoal":
        return "#32373d"; // Charcoal Dark Grey
      default:
        return "#f5f3e9";
    }
  };

  const getHardwareColor = () => {
    switch (materials.hardware) {
      case "brass":
        return "#e5c158"; // Golden brass (knobs/hinges in images)
      case "chrome":
        return "#cbd5e1"; // Shiny steel
      case "black":
        return "#1e293b"; // Matte black
      default:
        return "#e5c158";
    }
  };

  const mainColor = getFinishColor();
  const hwColor = getHardwareColor();
  const hwMetalness = materials.hardware === "chrome" ? 0.9 : 0.7;
  const hwRoughness = 0.2;

  // Shared wood panel material properties
  const isPlywood = materials.type === "plywood";
  const woodPanelMaterialProps = {
    color: mainColor,
    roughness: isPlywood ? 0.75 : 0.4,
    metalness: 0.0,
    bumpScale: 0.05
  };

  // ── RENDER TOILET CUBICLES ──
  const renderToiletCubicles = () => {
    const stalls = getStallCount();
    const stallWidth = w / stalls;
    const doorWidth = Math.min(0.68, stallWidth * 0.75); // door is slightly smaller than stall width
    const pilasterWidth = (stallWidth - doorWidth) / 2;
    const clearance = 0.15; // 150mm floor clearance
    const panelHeight = h - clearance;

    return (
      <group>
        {/* Rear Wall Wall Plane */}
        <mesh position={[0, h / 2, -d / 2]} receiveShadow>
          <boxGeometry args={[w + 0.1, h, 0.02]} />
          <meshStandardMaterial color="#c8c6c0" roughness={0.9} />
        </mesh>

        {/* Side walls (Left & Right outer bounds) */}
        <mesh position={[-w / 2, panelHeight / 2 + clearance, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.02, panelHeight, d]} />
          <meshStandardMaterial {...woodPanelMaterialProps} />
        </mesh>
        <mesh position={[w / 2, panelHeight / 2 + clearance, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.02, panelHeight, d]} />
          <meshStandardMaterial {...woodPanelMaterialProps} />
        </mesh>

        {/* Dynamic Divider walls between stalls */}
        {Array.from({ length: stalls - 1 }).map((_, idx) => {
          const xPos = -w / 2 + (idx + 1) * stallWidth;
          return (
            <mesh key={idx} position={[xPos, panelHeight / 2 + clearance, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.018, panelHeight, d - 0.05]} />
              <meshStandardMaterial {...woodPanelMaterialProps} />
            </mesh>
          );
        })}

        {/* Front Fascia: Doors & Pilasters */}
        {Array.from({ length: stalls }).map((_, idx) => {
          const stallStartX = -w / 2 + idx * stallWidth;
          const leftPilasterX = stallStartX + pilasterWidth / 2;
          const rightPilasterX = stallStartX + stallWidth - pilasterWidth / 2;
          const doorX = stallStartX + stallWidth / 2;

          // Door geometries (slanted top for Arch model, rectangular for Classic)
          const renderDoorPanel = () => {
            const doorThickness = 0.02;

            if (model === "arch") {
              // Custom Extruded Shape for Arched door (slanted top-left corner as seen in Image 3 & 4)
              const shape = new THREE.Shape();
              const hw = doorWidth / 2;
              const hh = panelHeight / 2;

              // Draw counter-clockwise shape centered at [0, 0]
              shape.moveTo(-hw, -hh);
              shape.lineTo(hw, -hh);
              shape.lineTo(hw, hh); // Top right corner
              shape.lineTo(-hw / 3, hh); // Top edge slant start
              shape.lineTo(-hw, hh - 0.18); // Slanted cutout down to top-left edge
              shape.closePath();

              const extrudeSettings = {
                depth: doorThickness,
                bevelEnabled: true,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0.002,
                bevelThickness: 0.002
              };

              return (
                <mesh position={[doorX, panelHeight / 2 + clearance, d / 2]} castShadow>
                  <extrudeGeometry args={[shape, extrudeSettings]} />
                  <meshStandardMaterial {...woodPanelMaterialProps} />
                </mesh>
              );
            } else {
              // Classic standard straight door
              return (
                <mesh position={[doorX, panelHeight / 2 + clearance, d / 2]} castShadow>
                  <boxGeometry args={[doorWidth, panelHeight, doorThickness]} />
                  <meshStandardMaterial {...woodPanelMaterialProps} />
                </mesh>
              );
            }
          };

          // Support Pilaster Columns
          const renderPilaster = (xPos: number, isRightmost: boolean) => {
            const pThickness = 0.035; // 35mm thick pilasters
            
            if (model === "arch") {
              // Rounded top dome pilasters (Images 3, 4, 5)
              const pHeight = h + 0.1; // Extends slightly higher than doors
              return (
                <group position={[xPos, 0, d / 2]}>
                  {/* Main post */}
                  <mesh position={[0, pHeight / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[pilasterWidth, pHeight, pThickness]} />
                    <meshStandardMaterial {...woodPanelMaterialProps} />
                  </mesh>
                  {/* Rounded cylinder top cap */}
                  <mesh position={[0, pHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[pilasterWidth / 2, pilasterWidth / 2, pThickness, 16]} />
                    <meshStandardMaterial {...woodPanelMaterialProps} />
                  </mesh>
                  {/* Floor Leveling Leg support */}
                  {accessories.supportLeg && (
                    <mesh position={[0, clearance / 2, 0]}>
                      <cylinderGeometry args={[0.015, 0.015, clearance]} />
                      <meshStandardMaterial color={hwColor} metalness={hwMetalness} roughness={hwRoughness} />
                    </mesh>
                  )}
                </group>
              );
            } else {
              // Classic straight rectangular posts (Image 2)
              return (
                <group position={[xPos, 0, d / 2]}>
                  <mesh position={[0, h / 2 + 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[pilasterWidth, h - 0.1, pThickness]} />
                    <meshStandardMaterial color="#8b7d41" roughness={0.4} /> {/* Gold/brass pilaster cover (Image 2) */}
                  </mesh>
                  {/* Floor Leveling Leg */}
                  {accessories.supportLeg && (
                    <mesh position={[0, 0.08, 0]}>
                      <cylinderGeometry args={[0.02, 0.02, 0.16]} />
                      <meshStandardMaterial color={hwColor} metalness={hwMetalness} roughness={hwRoughness} />
                    </mesh>
                  )}
                </group>
              );
            }
          };

          return (
            <group key={idx}>
              {/* Left Pilaster for this stall */}
              {renderPilaster(leftPilasterX, false)}

              {/* Render rightmost pilaster only on last stall */}
              {idx === stalls - 1 && renderPilaster(rightPilasterX, true)}

              {/* Door Panel */}
              {renderDoorPanel()}

              {/* Door Hardware: Lock and Handle Knobs */}
              <group position={[doorX + doorWidth / 2 - 0.06, 1.0, d / 2 + 0.015]}>
                {/* Gold round handle knob */}
                <mesh castShadow>
                  <sphereGeometry args={[0.022, 16, 16]} />
                  <meshStandardMaterial color={hwColor} metalness={hwMetalness} roughness={hwRoughness} />
                </mesh>
                {/* Backplate */}
                <mesh position={[0, 0, -0.005]}>
                  <cylinderGeometry args={[0.028, 0.028, 0.008]} rotation={[Math.PI / 2, 0, 0]} />
                  <meshStandardMaterial color={hwColor} metalness={hwMetalness} roughness={hwRoughness} />
                </mesh>
                {/* Indicator lock status plate (Red/Green indicator) */}
                {accessories.indicatorLock && (
                  <group position={[0, 0.08, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.018, 0.018, 0.005]} />
                      <meshStandardMaterial color={hwColor} metalness={hwMetalness} />
                    </mesh>
                    <mesh position={[0, 0, 0.004]}>
                      <boxGeometry args={[0.01, 0.01, 0.002]} />
                      <meshBasicMaterial color="#e74c3c" /> {/* Locked Red indicator default */}
                    </mesh>
                  </group>
                )}
              </group>

              {/* Hook and coat accessories on partition (rendered on the interior side of the door) */}
              {accessories.coatHook && (
                <mesh position={[doorX, 1.5, d / 2 - 0.02]} castShadow>
                  <boxGeometry args={[0.015, 0.03, 0.03]} />
                  <meshStandardMaterial color={hwColor} metalness={hwMetalness} />
                </mesh>
              )}
            </group>
          );
        })}

        {/* LED Backlight illumination line along the top frame header */}
        {accessories.ledBacklight && (
          <mesh position={[0, h + 0.01, d / 2]}>
            <boxGeometry args={[w, 0.006, 0.02]} />
            <meshBasicMaterial color="#b2f823" />
          </mesh>
        )}
      </group>
    );
  };

  // ── RENDER TOILET URINAL PARTITION ──
  const renderUrinalPartitions = () => {
    const renderPartitionPlate = () => {
      if (model === "arch") {
        // Arched dome partition shape
        const shape = new THREE.Shape();
        const hw = d / 2;
        const hh = h / 2;

        shape.moveTo(-hw, -hh);
        shape.lineTo(hw, -hh);
        shape.lineTo(hw, hh - 0.15);
        shape.quadraticCurveTo(0, hh, -hw, hh - 0.15); // curved top arch
        shape.closePath();

        const extrudeSettings = {
          depth: 0.024,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.001,
          bevelThickness: 0.001
        };

        return (
          <mesh position={[0, h / 2 + 0.4, 0]} castShadow>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial {...woodPanelMaterialProps} />
          </mesh>
        );
      } else {
        // Standard rectangular partition screen
        return (
          <mesh position={[0, h / 2 + 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.024, h, d]} />
            <meshStandardMaterial {...woodPanelMaterialProps} />
          </mesh>
        );
      }
    };

    return (
      <group>
        {/* Back mounting wall */}
        <mesh position={[0, 1.0, -d / 2 - 0.01]} receiveShadow>
          <boxGeometry args={[1.5, 2.0, 0.02]} />
          <meshStandardMaterial color="#c8c6c0" roughness={0.9} />
        </mesh>

        {/* Main Partition divider board */}
        {renderPartitionPlate()}

        {/* Metal wall mounting clamps/brackets */}
        {accessories.bracketClamps && (
          <group>
            <mesh position={[0, 1.2, -d / 2]} castShadow>
              <boxGeometry args={[0.04, 0.03, 0.04]} />
              <meshStandardMaterial color={hwColor} metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.6, -d / 2]} castShadow>
              <boxGeometry args={[0.04, 0.03, 0.04]} />
              <meshStandardMaterial color={hwColor} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* Urinal Support leg on outer edge */}
        {accessories.supportLeg && (
          <mesh position={[0, 0.2, d / 2 - 0.04]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.4]} />
            <meshStandardMaterial color={hwColor} metalness={0.8} roughness={0.2} />
          </mesh>
        )}
      </group>
    );
  };

  // ── RENDER LOCKER GRID SYSTEM ──
  const renderLockerSystem = () => {
    const { cols, rows } = getLockerGrid();
    const casingThickness = 0.024; // 24mm outer wooden casing
    const doorGap = 0.004; // 4mm door margin gaps

    const innerW = w - casingThickness * 2;
    const innerH = h - casingThickness * 2;
    const compW = innerW / cols;
    const compH = innerH / rows;

    return (
      <group>
        {/* Main Outer Box Cabinet Casing */}
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#3e2723" roughness={0.85} /> {/* Dark wood base structure */}
        </mesh>
        {/* Hollow interior overlay (creates casing borders) */}
        <mesh position={[0, h / 2, 0.002]}>
          <boxGeometry args={[w - 0.02, h - 0.02, d]} />
          <meshStandardMaterial color="#1e1310" roughness={0.9} />
        </mesh>

        {/* Generate procedurally matching locker compartments */}
        {Array.from({ length: cols }).map((_, cIdx) => {
          return Array.from({ length: rows }).map((_, rIdx) => {
            const compX = -innerW / 2 + (cIdx + 0.5) * compW;
            const compY = -innerH / 2 + (rIdx + 0.5) * compH + h / 2;

            // COLOR ASSIGNMENT MATCHING THE DYNAMIC MULTI-TONE LOCKER (Image 1)
            // Top Row: Cream
            // Middle Rows: Sage Green
            // Bottom Row: Charcoal Grey/Black
            // If custom wood grain selected, use the wood grain throughout!
            let compartmentColor = mainColor;
            if (materials.finish === "cream" || materials.finish === "sage" || materials.finish === "charcoal") {
              if (rIdx === rows - 1) {
                compartmentColor = getFinishColor("cream");
              } else if (rIdx === 0) {
                compartmentColor = getFinishColor("charcoal");
              } else {
                compartmentColor = getFinishColor("sage");
              }
            }

            return (
              <group key={`${cIdx}-${rIdx}`}>
                {/* Individual Door Panel */}
                <mesh position={[compX, compY, d / 2 + 0.004]} castShadow>
                  <boxGeometry args={[compW - doorGap, compH - doorGap, 0.016]} />
                  <meshStandardMaterial 
                    color={compartmentColor} 
                    roughness={isPlywood ? 0.75 : 0.4} 
                    metalness={0.0} 
                  />
                </mesh>

                {/* Cabinet Door Knob (Brass Gold or Metal Knob) */}
                {accessories.goldKnob && (
                  <group position={[compX + compW / 2 - 0.05, compY, d / 2 + 0.02]}>
                    <mesh castShadow>
                      <sphereGeometry args={[0.012, 16, 16]} />
                      <meshStandardMaterial color={hwColor} metalness={0.9} roughness={0.15} />
                    </mesh>
                    <mesh position={[0, 0, -0.006]}>
                      <cylinderGeometry args={[0.006, 0.006, 0.012]} rotation={[Math.PI / 2, 0, 0]} />
                      <meshStandardMaterial color={hwColor} metalness={0.9} />
                    </mesh>
                  </group>
                )}

                {/* Keyhole and Key details (under the knob, Image 1) */}
                {accessories.keyLock && (
                  <group position={[compX + compW / 2 - 0.05, compY - 0.04, d / 2 + 0.013]}>
                    <mesh>
                      <cylinderGeometry args={[0.005, 0.005, 0.002]} rotation={[Math.PI / 2, 0, 0]} />
                      <meshStandardMaterial color={hwColor} metalness={0.8} />
                    </mesh>
                    {/* Small keyhole slit */}
                    <mesh position={[0, 0, 0.001]}>
                      <boxGeometry args={[0.001, 0.004, 0.001]} />
                      <meshBasicMaterial color="#000000" />
                    </mesh>
                  </group>
                )}

                {/* Optional Digital Keypad Lock */}
                {accessories.digitalLock && (
                  <mesh position={[compX + compW / 2 - 0.05, compY + 0.04, d / 2 + 0.015]}>
                    <boxGeometry args={[0.02, 0.04, 0.006]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.6} />
                  </mesh>
                )}

                {/* Top Center Identification Plate */}
                {accessories.numberPlate && (
                  <mesh position={[compX, compY + compH / 2 - 0.04, d / 2 + 0.013]}>
                    <boxGeometry args={[0.04, 0.018, 0.002]} />
                    <meshStandardMaterial color={hwColor} metalness={0.7} roughness={0.3} />
                  </mesh>
                )}
              </group>
            );
          });
        })}
      </group>
    );
  };

  return (
    <group>
      {/* Floor Reference Grid */}
      <gridHelper args={[10, 10, "#475569", "#cbd5e1"]} position={[0, 0, 0]} />

      {/* Render selected system */}
      {category === "toilet_cubicle" && renderToiletCubicles()}
      {category === "toilet_partition" && renderUrinalPartitions()}
      {category === "locker_system" && renderLockerSystem()}

      {/* ── ENGINEERING MEASUREMENTS ── */}
      {/* 1. Width Dimension Guide */}
      <group position={[0, 0.02, d / 2 + 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.004, 0.004, w]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <mesh position={[-w / 2, 0, 0]}>
          <boxGeometry args={[0.01, 0.08, 0.02]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <mesh position={[w / 2, 0, 0]}>
          <boxGeometry args={[0.01, 0.08, 0.02]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <Html position={[0, 0.04, 0]} center>
          <div className="bg-[#7FB706] text-black font-semibold font-mono text-[11px] px-2.5 py-0.5 rounded shadow-lg border border-[#B5F823] whitespace-nowrap">
            W: {dimensions.width} mm
          </div>
        </Html>
      </group>

      {/* 2. Depth Dimension Guide */}
      <group position={[w / 2 + 0.2, 0.02, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, d]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <mesh position={[0, 0, -d / 2]}>
          <boxGeometry args={[0.02, 0.08, 0.01]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <mesh position={[0, 0, d / 2]}>
          <boxGeometry args={[0.02, 0.08, 0.01]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <Html position={[0, 0.04, 0]} center>
          <div className="bg-[#7FB706] text-black font-semibold font-mono text-[11px] px-2.5 py-0.5 rounded shadow-lg border border-[#B5F823] whitespace-nowrap">
            D: {dimensions.depth} mm
          </div>
        </Html>
      </group>

      {/* 3. Height Dimension Guide */}
      <group position={[w / 2 + 0.08, h / 2, d / 2]}>
        <mesh>
          <cylinderGeometry args={[0.004, 0.004, h]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <mesh position={[0, -h / 2, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.02]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[0.08, 0.01, 0.02]} />
          <meshBasicMaterial color="#7FB706" />
        </mesh>
        <Html position={[0.06, 0, 0]} center>
          <div className="bg-[#7FB706] text-black font-semibold font-mono text-[11px] px-2.5 py-0.5 rounded shadow-lg border border-[#B5F823] whitespace-nowrap">
            H: {dimensions.height} mm
          </div>
        </Html>
      </group>
    </group>
  );
}
