import {
  MousePointer2, Move, RotateCcw, Maximize2,
  RectangleHorizontal, Square, Box, Circle,
  DoorOpen, Layers, Paintbrush, Eraser,
  Ruler, Crosshair, Type,
} from "lucide-react";
import { useDesignStore, type ToolType } from "../../../lib/designStore";

/* ─── Tool definitions ──────────────────────────────────────────────────── */

interface ToolDef {
  id: ToolType;
  icon: React.ComponentType<any>;
  label: string;
  shortcut?: string;
  group: "select" | "draw" | "action";
}

const TOOLS: ToolDef[] = [
  // Select/Transform
  { id: "select",        icon: MousePointer2,       label: "Select",      shortcut: "V", group: "select" },
  { id: "move",          icon: Move,                label: "Move",        shortcut: "G", group: "select" },
  { id: "rotate",        icon: RotateCcw,           label: "Rotate",      shortcut: "R", group: "select" },
  { id: "scale",         icon: Maximize2,           label: "Scale",       shortcut: "S", group: "select" },
  // Draw
  { id: "draw_wall",     icon: RectangleHorizontal, label: "Wall",        shortcut: "W", group: "draw" },
  { id: "draw_panel",    icon: Square,              label: "Panel",       shortcut: "P", group: "draw" },
  { id: "draw_box",      icon: Box,                 label: "Box",         shortcut: "B", group: "draw" },
  { id: "draw_cylinder", icon: Circle,              label: "Column",      shortcut: "C", group: "draw" },
  { id: "draw_door",     icon: DoorOpen,            label: "Door",        shortcut: "D", group: "draw" },
  { id: "draw_shelf",    icon: Layers,              label: "Shelf",                      group: "draw" },
  // Actions
  { id: "paint",         icon: Paintbrush,          label: "Paint",       shortcut: "I", group: "action" },
  { id: "eraser",        icon: Eraser,              label: "Erase",       shortcut: "X", group: "action" },
  { id: "measure",       icon: Ruler,               label: "Measure",                    group: "action" },
  { id: "text_annotation",icon: Type,               label: "Annotate",                   group: "action" },
];

const GROUP_LABELS: Record<string, string> = {
  select: "SELECTION",
  draw:   "DRAW",
  action: "MODIFY",
};

/* ─── Divider ────────────────────────────────────────────────────────── */
const Divider = () => (
  <div style={{
    height: 1,
    width: "80%",
    background: "rgba(255,255,255,0.07)",
    margin: "2px auto",
  }} />
);

const GroupLabel = ({ label }: { label: string }) => (
  <div style={{
    fontSize: 7,
    color: "rgba(255,255,255,0.2)",
    fontFamily: "'Inter', system-ui, sans-serif",
    letterSpacing: "0.07em",
    textAlign: "center",
    padding: "4px 0 1px",
    fontWeight: 700,
  }}>
    {label}
  </div>
);

/* ─── Component ──────────────────────────────────────────────────────── */
export function DesignToolbar() {
  const activeTool = useDesignStore((s) => s.activeTool);
  const setTool    = useDesignStore((s) => s.setTool);

  const selectTools = TOOLS.filter((t) => t.group === "select");
  const drawTools   = TOOLS.filter((t) => t.group === "draw");
  const actionTools = TOOLS.filter((t) => t.group === "action");

  const renderTool = (tool: ToolDef) => {
    const Icon     = tool.icon;
    const isActive = activeTool === tool.id;

    return (
      <button
        key={tool.id}
        onClick={() => setTool(tool.id)}
        title={tool.shortcut ? `${tool.label}  [${tool.shortcut}]` : tool.label}
        style={{
          width: 38,
          height: 38,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          borderRadius: 5,
          border: isActive
            ? "1px solid rgba(0,120,212,0.7)"
            : "1px solid transparent",
          background: isActive
            ? "rgba(0,120,212,0.2)"
            : "transparent",
          color: isActive ? "#60a8e8" : "rgba(255,255,255,0.55)",
          cursor: "pointer",
          transition: "all 0.12s",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(255,255,255,0.07)";
            el.style.color = "#fff";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "rgba(255,255,255,0.55)";
          }
        }}
      >
        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} />
        {/* Keyboard shortcut badge */}
        {tool.shortcut && (
          <span style={{
            position: "absolute",
            bottom: 2,
            right: 3,
            fontSize: 7,
            color: isActive ? "rgba(96,168,232,0.7)" : "rgba(255,255,255,0.2)",
            fontFamily: "monospace",
            lineHeight: 1,
          }}>
            {tool.shortcut}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 46,
        background: "#1e1e1e",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px 0",
        zIndex: 30,
        overflowY: "auto",
        overflowX: "hidden",
        gap: 1,
      }}
    >
      {/* Crosshair indicator at top */}
      <div style={{ marginBottom: 6, color: "rgba(255,255,255,0.15)" }}>
        <Crosshair size={14} />
      </div>

      <GroupLabel label={GROUP_LABELS.select} />
      {selectTools.map(renderTool)}
      <Divider />

      <GroupLabel label={GROUP_LABELS.draw} />
      {drawTools.map(renderTool)}
      <Divider />

      <GroupLabel label={GROUP_LABELS.action} />
      {actionTools.map(renderTool)}
    </div>
  );
}
