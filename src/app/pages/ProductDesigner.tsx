import { useEffect, useCallback, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  Save,
  FolderOpen,
  Trash2,
  Sparkles,
  Grid3x3,
  FileJson,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { DesignCanvas3D } from "../components/designer/DesignCanvas3D";
import { DesignToolbar } from "../components/designer/DesignToolbar";
import { DesignSidebar } from "../components/designer/DesignSidebar";
import { useDesignStore } from "../../lib/designStore";
// @ts-ignore
import logo from "../../image/logo/logo.webp";

/* ─── Keyboard shortcuts ─────────────────────────────────────────────────── */

function useKeyboardShortcuts() {
  const setTool = useDesignStore((s) => s.setTool);
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const removeObject = useDesignStore((s) => s.removeObject);
  const selectedId = useDesignStore((s) => s.selectedId);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when focused on inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const key = e.key.toLowerCase();

      // Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (key === "z" && !e.shiftKey) { e.preventDefault(); undo(); return; }
        if (key === "z" && e.shiftKey) { e.preventDefault(); redo(); return; }
        if (key === "y") { e.preventDefault(); redo(); return; }
        return;
      }

      // Tool shortcuts
      switch (key) {
        case "v": setTool("select"); break;
        case "g": setTool("move"); break;
        case "r": setTool("rotate"); break;
        case "s": setTool("scale"); break;
        case "w": setTool("draw_wall"); break;
        case "p": setTool("draw_panel"); break;
        case "b": setTool("draw_box"); break;
        case "c": setTool("draw_cylinder"); break;
        case "d": setTool("draw_door"); break;
        case "i": setTool("paint"); break;
        case "x": setTool("eraser"); break;
        case "delete":
        case "backspace":
          if (selectedId) removeObject(selectedId);
          break;
        case "escape":
          useDesignStore.getState().cancelDraw();
          useDesignStore.getState().selectObject(null);
          setTool("select");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setTool, undo, redo, removeObject, selectedId]);
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function ProductDesigner() {
  const [searchParams] = useSearchParams();
  const projectName = useDesignStore((s) => s.projectName);
  const setProjectName = useDesignStore((s) => s.setProjectName);
  const objects = useDesignStore((s) => s.objects);
  const gridSize = useDesignStore((s) => s.gridSize);
  const snapToGrid = useDesignStore((s) => s.snapToGrid);
  const clearAll = useDesignStore((s) => s.clearAll);
  const exportConfig = useDesignStore((s) => s.exportConfig);
  const importConfig = useDesignStore((s) => s.importConfig);
  const loadTemplate = useDesignStore((s) => s.loadTemplate);
  const activeTool = useDesignStore((s) => s.activeTool);
  const [editingName, setEditingName] = useState(false);

  useKeyboardShortcuts();

  // Load template from URL param ?template=<id>
  useEffect(() => {
    const tmpl = searchParams.get("template");
    if (tmpl) loadTemplate(tmpl);
  }, []);

  // Load config from URL param ?config=<base64>
  useEffect(() => {
    const cfg = searchParams.get("config");
    if (cfg) {
      try {
        const json = atob(cfg);
        importConfig(json);
      } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage
  const handleSave = useCallback(() => {
    const json = exportConfig();
    localStorage.setItem("pacific_design_studio", json);
    alert("Design saved locally!");
  }, [exportConfig]);

  // Load from localStorage
  const handleLoad = useCallback(() => {
    const json = localStorage.getItem("pacific_design_studio");
    if (json) {
      importConfig(json);
    } else {
      alert("No saved design found.");
    }
  }, [importConfig]);

  // Import JSON file
  const fileRef = useRef<HTMLInputElement>(null);
  const handleImportFile = useCallback(() => {
    fileRef.current?.click();
  }, []);
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") importConfig(reader.result);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [importConfig]
  );

  // Tool labels for status bar
  const toolLabels: Record<string, string> = {
    select: "Select", move: "Move", rotate: "Rotate", scale: "Scale",
    draw_wall: "Draw Wall", draw_panel: "Draw Panel", draw_box: "Draw Box",
    draw_cylinder: "Draw Column", draw_door: "Draw Door", draw_shelf: "Add Shelf",
    paint: "Paint Material", eraser: "Delete Objects",
  };

  const headerBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: "all 0.15s",
  };

  return (
    <>
      <SEO
        title="3D Design Studio | Pacific Products & Solutions"
        description="Design your perfect restroom, locker, or partition layout in our interactive 3D Design Studio. Customize materials, dimensions, and export specifications."
        keywords={["3D design", "cubicle configurator", "restroom design", "partition designer", "locker layout"]}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "linear-gradient(180deg, #030213 0%, #0a0a1e 100%)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#fff",
        }}
      >
        {/* ─── Top Header Bar ─────────────────────────────────────────── */}
        <header
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(3,2,19,0.95)",
            backdropFilter: "blur(12px)",
            zIndex: 50,
            flexShrink: 0,
          }}
        >
          {/* Left: Logo + project name */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <img src={logo} alt="Pacific" style={{ height: 28, borderRadius: "50%" }} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#7FB706",
                  letterSpacing: "-0.02em",
                }}
              >
                Design Studio
              </span>
            </Link>

            <div
              style={{
                width: 1,
                height: 20,
                background: "rgba(255,255,255,0.1)",
                margin: "0 4px",
              }}
            />

            {/* Editable project name */}
            {editingName ? (
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => { if (e.key === "Enter") setEditingName(false); }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(127,183,6,0.3)",
                  borderRadius: 5,
                  padding: "3px 8px",
                  color: "#fff",
                  fontSize: 13,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  outline: "none",
                  width: 200,
                }}
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: "3px 6px",
                  borderRadius: 4,
                  transition: "background 0.15s",
                }}
              >
                {projectName}
              </button>
            )}
          </div>

          {/* Right: Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={handleSave} style={headerBtnStyle} title="Save to browser">
              <Save size={14} /> Save
            </button>
            <button onClick={handleLoad} style={headerBtnStyle} title="Load from browser">
              <FolderOpen size={14} /> Load
            </button>
            <button onClick={handleImportFile} style={headerBtnStyle} title="Import JSON file">
              <FileJson size={14} /> Import
            </button>
            <button
              onClick={() => {
                if (confirm("Clear all objects? This action can be undone.")) clearAll();
              }}
              style={{ ...headerBtnStyle, borderColor: "rgba(255,80,80,0.15)", color: "rgba(255,100,100,0.7)" }}
              title="Clear all"
            >
              <Trash2 size={14} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <Link
              to="/"
              style={{
                ...headerBtnStyle,
                textDecoration: "none",
                marginLeft: 6,
              }}
            >
              Back to Site
            </Link>
          </div>
        </header>

        {/* ─── Main Workspace ─────────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* 3D Canvas */}
          <DesignCanvas3D />

          {/* Floating toolbar */}
          <DesignToolbar />

          {/* Properties sidebar */}
          <DesignSidebar />

          {/* Welcome overlay if scene is empty */}
          {objects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <Sparkles size={48} style={{ margin: "0 auto 16px", color: "rgba(127,183,6,0.4)" }} />
              <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
                Start Designing
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", marginTop: 6, maxWidth: 320 }}>
                Use the toolbar on the left to draw walls, panels, and boxes.
                Or load a template from the sidebar on the right.
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.15)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <kbd style={kbdStyle}>W</kbd> Wall
                <kbd style={kbdStyle}>B</kbd> Box
                <kbd style={kbdStyle}>D</kbd> Door
                <kbd style={kbdStyle}>V</kbd> Select
                <kbd style={kbdStyle}>Ctrl+Z</kbd> Undo
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── Bottom Status Bar ──────────────────────────────────────── */}
        <footer
          style={{
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(3,2,19,0.95)",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            flexShrink: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>
              <Grid3x3 size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
              Grid: {gridSize}mm {snapToGrid ? "(snap)" : "(free)"}
            </span>
            <span>Objects: {objects.length}</span>
            <span>Tool: {toolLabels[activeTool] || activeTool}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>Pacific Products & Solutions — Design Studio v1.0</span>
          </div>
        </footer>
      </div>
    </>
  );
}

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 5px",
  borderRadius: 3,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  fontSize: 10,
  fontFamily: "monospace",
  color: "rgba(255,255,255,0.3)",
};
