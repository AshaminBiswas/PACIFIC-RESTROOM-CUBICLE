import { useState } from "react";
import {
  MousePointer2, Move, RotateCcw, Maximize2,
  RectangleHorizontal, Square, Box, Circle,
  DoorOpen, Layers, Paintbrush, Eraser,
  Undo2, Redo2, LayoutTemplate, Boxes,
  Camera, FileDown, FileJson, Link2,
  MessageSquareQuote, Grid3x3, Ruler, Eye,
  EyeOff, RotateCw, MonitorUp, ArrowUp,
  ArrowRight, Ruler as MeasureIcon, Type,
} from "lucide-react";
import { useDesignStore, type ToolType, type CameraPreset, TEMPLATES, COMPONENT_LIBRARY } from "../../../lib/designStore";

/* ─── Ribbon Tab definitions ────────────────────────────────────────────── */

type RibbonTab = "Home" | "Insert" | "View" | "Output";

const RIBBON_BG      = "#252525";
const RIBBON_BORDER  = "rgba(255,255,255,0.07)";
const ACCENT         = "#0078d4";
const ACCENT_DIM     = "rgba(0,120,212,0.15)";

/* ─── Tool Button ────────────────────────────────────────────────────── */
function RibbonTool({
  id, icon: Icon, label, shortcut, active, onClick, small,
}: {
  id: string; icon: React.ComponentType<any>; label: string;
  shortcut?: string; active?: boolean; onClick: () => void; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      style={{
        display: "flex",
        flexDirection: small ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: small ? 5 : 3,
        width: small ? "auto" : 52,
        minWidth: small ? 70 : 52,
        height: small ? 24 : 56,
        padding: small ? "0 8px" : "6px 4px",
        borderRadius: 5,
        border: active ? `1px solid ${ACCENT}` : "1px solid transparent",
        background: active ? ACCENT_DIM : "transparent",
        color: active ? "#60a8e8" : "rgba(255,255,255,0.7)",
        cursor: "pointer",
        transition: "all 0.12s",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.color = "#fff";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
        }
      }}
    >
      <Icon size={small ? 13 : 18} strokeWidth={active ? 2.2 : 1.8} />
      <span style={{
        fontSize: small ? 11 : 9,
        lineHeight: 1.1,
        textAlign: "center",
        fontWeight: active ? 600 : 400,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}>
        {small ? label : label.split(" ").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
      </span>
    </button>
  );
}

/* ─── Ribbon Group ───────────────────────────────────────────────────── */
function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${RIBBON_BORDER}`,
      paddingRight: 8,
      marginRight: 4,
      minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        {children}
      </div>
      <div style={{
        fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "center",
        paddingTop: 3, letterSpacing: "0.05em", textTransform: "uppercase",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Home Tab ───────────────────────────────────────────────────────── */
function HomeTab() {
  const activeTool = useDesignStore((s) => s.activeTool);
  const setTool    = useDesignStore((s) => s.setTool);
  const undo       = useDesignStore((s) => s.undo);
  const redo       = useDesignStore((s) => s.redo);
  const past       = useDesignStore((s) => s.past);
  const future     = useDesignStore((s) => s.future);

  const tool = (id: ToolType, icon: any, label: string, shortcut?: string) => (
    <RibbonTool id={id} icon={icon} label={label} shortcut={shortcut}
      active={activeTool === id} onClick={() => setTool(id)} />
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: "100%" }}>
      {/* Clipboard */}
      <RibbonGroup label="History">
        <RibbonTool id="undo" icon={Undo2} label="Undo" shortcut="Ctrl+Z"
          active={false} onClick={undo} small />
        <RibbonTool id="redo" icon={Redo2} label="Redo" shortcut="Ctrl+Y"
          active={false} onClick={redo} small />
      </RibbonGroup>

      {/* Select tools */}
      <RibbonGroup label="Select">
        {tool("select", MousePointer2, "Select", "V")}
        {tool("move",   Move,          "Move",   "G")}
        {tool("rotate", RotateCcw,     "Rotate", "R")}
        {tool("scale",  Maximize2,     "Scale",  "S")}
      </RibbonGroup>

      {/* Draw tools */}
      <RibbonGroup label="Draw">
        {tool("draw_wall",     RectangleHorizontal, "Wall",   "W")}
        {tool("draw_panel",    Square,              "Panel",  "P")}
        {tool("draw_box",      Box,                 "Box",    "B")}
        {tool("draw_cylinder", Circle,              "Column", "C")}
        {tool("draw_door",     DoorOpen,            "Door",   "D")}
        {tool("draw_shelf",    Layers,              "Shelf")}
      </RibbonGroup>

      {/* Modify tools */}
      <RibbonGroup label="Modify">
        {tool("paint",   Paintbrush, "Paint",   "I")}
        {tool("eraser",  Eraser,     "Erase",   "X")}
        {tool("measure", MeasureIcon, "Measure")}
      </RibbonGroup>
    </div>
  );
}

/* ─── Insert Tab ─────────────────────────────────────────────────────── */
function InsertTab() {
  const addComponent  = useDesignStore((s) => s.addComponent);
  const loadTemplate  = useDesignStore((s) => s.loadTemplate);
  const [catFilter, setCatFilter] = useState<string>("all");

  const categories = [
    "all",
    "Restroom Cubicles",
    "Locker Systems",
    "Partitions & Screens",
    "Cladding & Wall Panels",
    "Hardware & Accessories",
  ];

  const filtered = catFilter === "all"
    ? COMPONENT_LIBRARY
    : COMPONENT_LIBRARY.filter((c) => c.category === catFilter);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: "100%", overflow: "hidden" }}>
      {/* Components */}
      <RibbonGroup label="Components">
        <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 60, overflow: "hidden" }}>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{
              background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4, color: "rgba(255,255,255,0.7)", fontSize: 10,
              padding: "2px 4px", cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {categories.map((c) => <option key={c} value={c} style={{ background: "#2a2a2a" }}>{c}</option>)}
          </select>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap", maxHeight: 38, overflow: "hidden" }}>
            {filtered.slice(0, 8).map((comp) => (
              <button
                key={comp.id}
                onClick={() => addComponent(comp.id)}
                title={comp.name + "\n" + comp.description}
                style={{
                  width: 28, height: 28, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)", cursor: "pointer",
                  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ACCENT_DIM; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              >
                {comp.emoji}
              </button>
            ))}
          </div>
        </div>
      </RibbonGroup>

      {/* Templates */}
      <RibbonGroup label="Templates">
        <div style={{ display: "flex", gap: 2 }}>
          {TEMPLATES.slice(0, 5).map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => loadTemplate(tmpl.id)}
              title={tmpl.name + "\n" + tmpl.description}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 2, width: 44, height: 56, borderRadius: 5,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)", cursor: "pointer",
                fontSize: 11, color: "rgba(255,255,255,0.7)",
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ACCENT_DIM; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              <span style={{ fontSize: 18 }}>{tmpl.emoji}</span>
              <span style={{ fontSize: 8, textAlign: "center", lineHeight: 1.1, opacity: 0.6 }}>
                {tmpl.name.split(" ").slice(0, 2).join("\n")}
              </span>
            </button>
          ))}
        </div>
      </RibbonGroup>
    </div>
  );
}

/* ─── View Tab ───────────────────────────────────────────────────────── */
function ViewTab() {
  const showGrid           = useDesignStore((s) => s.showGrid);
  const snapToGrid         = useDesignStore((s) => s.snapToGrid);
  const showDimensions     = useDesignStore((s) => s.showDimensions);
  const toggleShowGrid     = useDesignStore((s) => s.toggleShowGrid);
  const toggleSnapToGrid   = useDesignStore((s) => s.toggleSnapToGrid);
  const toggleShowDimensions = useDesignStore((s) => s.toggleShowDimensions);
  const setCameraPreset    = useDesignStore((s) => s.setCameraPreset);
  const cameraPreset       = useDesignStore((s) => s.cameraPreset);
  const gridSize           = useDesignStore((s) => s.gridSize);
  const setGridSize        = useDesignStore((s) => s.setGridSize);

  const camBtn = (id: CameraPreset, icon: any, label: string) => (
    <RibbonTool id={id} icon={icon} label={label}
      active={cameraPreset === id}
      onClick={() => setCameraPreset(id)} />
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: "100%" }}>
      {/* Camera */}
      <RibbonGroup label="Camera">
        {camBtn("perspective", RotateCw,  "3D View")}
        {camBtn("top",         ArrowUp,   "Top")}
        {camBtn("front",       MonitorUp, "Front")}
        {camBtn("side",        ArrowRight,"Side")}
      </RibbonGroup>

      {/* Display */}
      <RibbonGroup label="Display">
        <RibbonTool id="grid" icon={Grid3x3} label="Grid"
          active={showGrid} onClick={toggleShowGrid} />
        <RibbonTool id="snap" icon={showGrid ? Eye : EyeOff} label="Snap"
          active={snapToGrid} onClick={toggleSnapToGrid} />
        <RibbonTool id="dims" icon={Ruler} label="Dimensions"
          active={showDimensions} onClick={toggleShowDimensions} />
      </RibbonGroup>

      {/* Grid Size */}
      <RibbonGroup label="Grid Size">
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center", height: "100%" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Size (mm)</span>
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            style={{
              background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4, color: "rgba(255,255,255,0.7)", fontSize: 11,
              padding: "3px 6px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {[25, 50, 100, 200, 500].map((v) => (
              <option key={v} value={v} style={{ background: "#2a2a2a" }}>{v}</option>
            ))}
          </select>
        </div>
      </RibbonGroup>
    </div>
  );
}

/* ─── Output Tab ─────────────────────────────────────────────────────── */
function OutputTab({
  onExportPNG, onExportPDF, onExportJSON, onShareLink,
  onRequestQuote,
}: {
  onExportPNG: () => void; onExportPDF: () => void;
  onExportJSON: () => void; onShareLink: () => void;
  onRequestQuote: () => void;
}) {
  const objects      = useDesignStore((s) => s.objects);
  const projectName  = useDesignStore((s) => s.projectName);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: "100%" }}>
      <RibbonGroup label="Export">
        <RibbonTool id="png" icon={Camera}   label="PNG"   onClick={onExportPNG}  active={false} />
        <RibbonTool id="pdf" icon={FileDown} label="PDF"   onClick={onExportPDF}  active={false} />
        <RibbonTool id="json" icon={FileJson} label="JSON" onClick={onExportJSON} active={false} />
        <RibbonTool id="share" icon={Link2}  label="Share" onClick={onShareLink}  active={false} />
      </RibbonGroup>

      <RibbonGroup label="Quote">
        <RibbonTool id="quote" icon={MessageSquareQuote} label="Request Quote"
          active={false} onClick={onRequestQuote} />
      </RibbonGroup>

      <RibbonGroup label="Summary">
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          gap: 3, padding: "4px 8px", height: 56,
        }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            Project: <span style={{ color: "rgba(255,255,255,0.7)" }}>{projectName}</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            Objects: <span style={{ color: "#60a8e8", fontFamily: "monospace" }}>{objects.length}</span>
          </div>
        </div>
      </RibbonGroup>
    </div>
  );
}

/* ─── Main Ribbon ────────────────────────────────────────────────────── */
export function AutoCADRibbon({
  onExportPNG, onExportPDF, onExportJSON, onShareLink, onRequestQuote,
}: {
  onExportPNG: () => void; onExportPDF: () => void;
  onExportJSON: () => void; onShareLink: () => void;
  onRequestQuote: () => void;
}) {
  const [activeTab, setActiveTab] = useState<RibbonTab>("Home");

  const TABS: RibbonTab[] = ["Home", "Insert", "View", "Output"];

  return (
    <div style={{
      background: RIBBON_BG,
      borderBottom: `1px solid ${RIBBON_BORDER}`,
      flexShrink: 0,
      zIndex: 90,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        padding: "0 8px",
        gap: 2,
        borderBottom: `1px solid ${RIBBON_BORDER}`,
        height: 24,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0 14px",
              height: "100%",
              background: activeTab === tab ? RIBBON_BG : "transparent",
              border: "none",
              borderBottom: activeTab === tab ? `2px solid ${ACCENT}` : "2px solid transparent",
              color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: activeTab === tab ? 600 : 400,
              transition: "all 0.12s",
              letterSpacing: "0.02em",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        padding: "6px 10px 4px",
        height: 78,
        overflow: "hidden",
      }}>
        {activeTab === "Home"   && <HomeTab />}
        {activeTab === "Insert" && <InsertTab />}
        {activeTab === "View"   && <ViewTab />}
        {activeTab === "Output" && (
          <OutputTab
            onExportPNG={onExportPNG} onExportPDF={onExportPDF}
            onExportJSON={onExportJSON} onShareLink={onShareLink}
            onRequestQuote={onRequestQuote}
          />
        )}
      </div>
    </div>
  );
}
