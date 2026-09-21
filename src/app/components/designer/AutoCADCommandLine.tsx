import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDesignStore } from "../../../lib/designStore";
import { ChevronUp, Terminal } from "lucide-react";

/* ─── AutoCAD Command Line ──────────────────────────────────────────────── */

export function AutoCADCommandLine() {
  const commandHistory  = useDesignStore((s) => s.commandHistory);
  const activeCommand   = useDesignStore((s) => s.activeCommand);
  const setActiveCommand = useDesignStore((s) => s.setActiveCommand);
  const executeCommand  = useDesignStore((s) => s.executeCommand);
  const activeTool      = useDesignStore((s) => s.activeTool);
  const cursorPos       = useDesignStore((s) => s.cursorPos);

  const [historyIndex, setHistoryIndex] = useState(-1);
  const [localHistory, setLocalHistory] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const inputRef    = useRef<HTMLInputElement>(null);
  const historyRef  = useRef<HTMLDivElement>(null);

  // Scroll history to bottom on update
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Tool-to-prompt mapping
  const toolPrompts: Record<string, string> = {
    select:         "SELECT: Click an object to select, or drag to box-select",
    move:           "MOVE: Drag the transform gizmo or enter coordinates",
    rotate:         "ROTATE: Drag the rotation gizmo",
    scale:          "SCALE: Drag the scale handle",
    draw_wall:      "WALL: Click and drag to place a wall panel",
    draw_panel:     "PANEL: Click and drag to place a flat panel",
    draw_box:       "BOX: Click and drag to place a box / locker",
    draw_cylinder:  "COLUMN: Click to place a column",
    draw_door:      "DOOR: Click and drag to place a door",
    draw_shelf:     "SHELF: Click to place a shelf",
    paint:          "PAINT: Select a material from the Materials tab, then click objects",
    eraser:         "ERASE: Click an object to delete it",
    measure:        "MEASURE: Click two points to measure distance",
    text_annotation:"TEXT: Click to place a text annotation",
    draw_line:      "LINE: Click to start, click again to end a dimension line",
  };

  const prompt = toolPrompts[activeTool] || "Command: ";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = activeCommand.trim();
      if (cmd) {
        setLocalHistory((h) => [cmd, ...h]);
        executeCommand(cmd);
        setActiveCommand("");
        setHistoryIndex(-1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, localHistory.length - 1);
      setHistoryIndex(newIdx);
      if (localHistory[newIdx]) setActiveCommand(localHistory[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIdx);
      setActiveCommand(newIdx === -1 ? "" : (localHistory[newIdx] || ""));
    } else if (e.key === "Escape") {
      setActiveCommand("");
      setHistoryIndex(-1);
    }
  };

  return (
    <div
      style={{
        background: "#141414",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* History toggle button */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            ref={historyRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 96, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              overflowY: "auto",
              padding: "4px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {commandHistory.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  lineHeight: "18px",
                  color: line.startsWith(">")
                    ? "#60a8e8"
                    : line.startsWith("Unknown")
                    ? "#ff6b6b"
                    : "rgba(255,255,255,0.5)",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                }}
              >
                {line}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command input row */}
      <div style={{ display: "flex", alignItems: "center", height: 32, padding: "0 8px", gap: 6 }}>
        {/* Expand history */}
        <button
          onClick={() => setExpanded((p) => !p)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: expanded ? "#60a8e8" : "rgba(255,255,255,0.3)",
            padding: 2, display: "flex", alignItems: "center",
          }}
          title="Toggle command history"
        >
          <ChevronUp
            size={14}
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          />
        </button>

        <Terminal size={12} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />

        {/* Prompt label */}
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.35)",
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          flexShrink: 0,
        }}>
          {prompt.split(":")[0]}:
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          value={activeCommand}
          onChange={(e) => setActiveCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command or press HELP..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#60a8e8",
            fontSize: 11,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        />

        {/* Live coordinates */}
        <div style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.02em",
          flexShrink: 0,
          display: "flex",
          gap: 6,
        }}>
          <span style={{ color: "#ff6b6b" }}>X: {(cursorPos.x * 1000).toFixed(0)}</span>
          <span style={{ color: "#51cf66" }}>Y: {(cursorPos.z * 1000).toFixed(0)}</span>
          <span style={{ color: "#74b9ff" }}>Z: {(cursorPos.y * 1000).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
