import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Save, FolderOpen, FileJson, Trash2, Download,
  Undo2, Redo2, MousePointer2, Eye, Grid3x3,
  Camera, FileDown, Link2, HelpCircle, X,
} from "lucide-react";
import { useDesignStore } from "../../../lib/designStore";
// @ts-ignore
import logo from "../../../image/logo/logo.webp";

/* ─── Menu Item Types ──────────────────────────────────────────────────── */
interface MenuAction {
  label: string;
  icon?: React.ComponentType<any>;
  shortcut?: string;
  action?: () => void;
  separator?: never;
  disabled?: boolean;
}
interface Separator { separator: true; label?: never; icon?: never; shortcut?: never; action?: never; disabled?: never; }
type MenuItem = MenuAction | Separator;

interface Menu { label: string; items: MenuItem[]; }

/* ─── Dropdown Component ─────────────────────────────────────────────── */
function Dropdown({ menu, onClose }: { menu: Menu; onClose: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        minWidth: 220,
        background: "#2a2a2a",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "0 4px 4px 4px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        zIndex: 200,
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      {menu.items.map((item, i) => {
        if ("separator" in item && item.separator) {
          return <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />;
        }
        const Icon = (item as MenuAction).icon;
        return (
          <button
            key={i}
            disabled={(item as MenuAction).disabled}
            onClick={() => {
              (item as MenuAction).action?.();
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "6px 14px",
              background: "none",
              border: "none",
              color: (item as MenuAction).disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: (item as MenuAction).disabled ? "not-allowed" : "pointer",
              textAlign: "left",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => { if (!(item as MenuAction).disabled) (e.target as HTMLElement).style.background = "rgba(0,120,212,0.25)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "none"; }}
          >
            {Icon && <Icon size={13} style={{ flexShrink: 0, opacity: 0.7 }} />}
            <span style={{ flex: 1 }}>{(item as MenuAction).label}</span>
            {(item as MenuAction).shortcut && (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                {(item as MenuAction).shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── AutoCAD Menu Bar ───────────────────────────────────────────────── */
export function AutoCADMenuBar({
  onSave, onLoad, onImportFile, onExportJSON, onExportPDF, onExportPNG, onShareLink,
}: {
  onSave: () => void;
  onLoad: () => void;
  onImportFile: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
  onShareLink: () => void;
}) {
  const undo        = useDesignStore((s) => s.undo);
  const redo        = useDesignStore((s) => s.redo);
  const past        = useDesignStore((s) => s.past);
  const future      = useDesignStore((s) => s.future);
  const clearAll    = useDesignStore((s) => s.clearAll);
  const setTool     = useDesignStore((s) => s.setTool);
  const selectedId  = useDesignStore((s) => s.selectedId);
  const removeObject = useDesignStore((s) => s.removeObject);
  const duplicateObject = useDesignStore((s) => s.duplicateObject);
  const toggleShowGrid  = useDesignStore((s) => s.toggleShowGrid);
  const toggleSnapToGrid = useDesignStore((s) => s.toggleSnapToGrid);
  const toggleShowDimensions = useDesignStore((s) => s.toggleShowDimensions);
  const setCameraPreset = useDesignStore((s) => s.setCameraPreset);
  const projectName = useDesignStore((s) => s.projectName);
  const setProjectName = useDesignStore((s) => s.setProjectName);
  const [editingName, setEditingName] = useState(false);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menus: Menu[] = [
    {
      label: "File",
      items: [
        { label: "Save to Browser",  icon: Save,       shortcut: "Ctrl+S",  action: onSave },
        { label: "Load from Browser", icon: FolderOpen, shortcut: "Ctrl+O", action: onLoad },
        { separator: true },
        { label: "Import JSON File", icon: FileJson,    action: onImportFile },
        { separator: true },
        { label: "Export PNG",       icon: Camera,      action: onExportPNG },
        { label: "Export PDF",       icon: FileDown,    action: onExportPDF },
        { label: "Export JSON",      icon: FileJson,    action: onExportJSON },
        { label: "Copy Share Link",  icon: Link2,       action: onShareLink },
        { separator: true },
        { label: "Clear Scene",      icon: Trash2,      action: () => { if (confirm("Clear all objects?")) clearAll(); } },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo",             icon: Undo2,       shortcut: "Ctrl+Z",  action: undo,  disabled: past.length === 0 },
        { label: "Redo",             icon: Redo2,       shortcut: "Ctrl+Y",  action: redo,  disabled: future.length === 0 },
        { separator: true },
        { label: "Duplicate Selected", icon: MousePointer2, shortcut: "Ctrl+D", action: () => { if (selectedId) duplicateObject(selectedId); }, disabled: !selectedId },
        { label: "Delete Selected",  icon: Trash2,      shortcut: "Del",     action: () => { if (selectedId) removeObject(selectedId); }, disabled: !selectedId },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Toggle Grid",       icon: Grid3x3,    shortcut: "G",  action: toggleShowGrid },
        { label: "Toggle Snap",       icon: Eye,        shortcut: "S",  action: toggleSnapToGrid },
        { label: "Toggle Dimensions", icon: Eye,        shortcut: "D",  action: toggleShowDimensions },
        { separator: true },
        { label: "3D Perspective",    action: () => setCameraPreset("perspective") },
        { label: "Top View",          action: () => setCameraPreset("top") },
        { label: "Front View",        action: () => setCameraPreset("front") },
        { label: "Side View",         action: () => setCameraPreset("side") },
      ],
    },
    {
      label: "Draw",
      items: [
        { label: "Select",            shortcut: "V",  action: () => setTool("select") },
        { separator: true },
        { label: "Wall Panel",        shortcut: "W",  action: () => setTool("draw_wall") },
        { label: "Flat Panel",        shortcut: "P",  action: () => setTool("draw_panel") },
        { label: "Box / Locker",      shortcut: "B",  action: () => setTool("draw_box") },
        { label: "Column",            shortcut: "C",  action: () => setTool("draw_cylinder") },
        { label: "Door",              shortcut: "D",  action: () => setTool("draw_door") },
        { label: "Shelf",             action: () => setTool("draw_shelf") },
      ],
    },
    {
      label: "Modify",
      items: [
        { label: "Move",    shortcut: "G",  action: () => setTool("move") },
        { label: "Rotate",  shortcut: "R",  action: () => setTool("rotate") },
        { label: "Scale",   shortcut: "S",  action: () => setTool("scale") },
        { separator: true },
        { label: "Paint Material", shortcut: "I",  action: () => setTool("paint") },
        { label: "Delete (Eraser)", shortcut: "X", action: () => setTool("eraser") },
        { label: "Measure Distance", action: () => setTool("measure") },
      ],
    },
    {
      label: "Help",
      items: [
        { label: "Keyboard Shortcuts", icon: HelpCircle, action: () => alert("V=Select  G=Move  R=Rotate  S=Scale\nW=Wall  B=Box  D=Door  P=Panel  C=Column\nI=Paint  X=Erase  Ctrl+Z=Undo  Ctrl+Y=Redo") },
        { label: "Command Reference",  action: () => alert("Open the command line (↑ arrow above status bar) and type HELP") },
      ],
    },
  ];

  return (
    <header
      style={{
        height: 36,
        background: "#1c1c1c",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        zIndex: 100,
        userSelect: "none",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <img src={logo} alt="Pacific" style={{ height: 20, borderRadius: "50%" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#7FB706", letterSpacing: "-0.01em" }}>
          Pacific Design Studio
        </span>
      </div>

      {/* Menus */}
      <div ref={menuBarRef} style={{ display: "flex", alignItems: "stretch", height: "100%", position: "relative" }}>
        {menus.map((menu) => (
          <div key={menu.label} style={{ position: "relative" }}>
            <button
              onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
              style={{
                height: "100%",
                padding: "0 12px",
                background: openMenu === menu.label ? "rgba(0,120,212,0.3)" : "none",
                border: "none",
                color: openMenu === menu.label ? "#fff" : "rgba(255,255,255,0.7)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: "background 0.1s, color 0.1s",
              }}
              onMouseEnter={(e) => {
                if (openMenu && openMenu !== menu.label) setOpenMenu(menu.label);
                (e.currentTarget as HTMLElement).style.background = "rgba(0,120,212,0.2)";
              }}
              onMouseLeave={(e) => {
                if (openMenu !== menu.label) (e.currentTarget as HTMLElement).style.background = "none";
              }}
            >
              {menu.label}
            </button>
            {openMenu === menu.label && (
              <Dropdown menu={menu} onClose={() => setOpenMenu(null)} />
            )}
          </div>
        ))}
      </div>

      {/* Project Name (center) */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {editingName ? (
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,120,212,0.5)",
              borderRadius: 4, padding: "2px 8px", color: "#fff", fontSize: 12,
              fontFamily: "'Inter', system-ui, sans-serif", outline: "none", width: 220,
            }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.5)",
              fontSize: 12, cursor: "pointer", padding: "2px 8px",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
            title="Click to rename project"
          >
            {projectName}
          </button>
        )}
      </div>

      {/* Right: Back to site */}
      <Link
        to="/"
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "0 14px", height: "100%",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.5)", fontSize: 11,
          textDecoration: "none", fontFamily: "'Inter', system-ui, sans-serif",
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
      >
        <X size={12} /> Exit Studio
      </Link>
    </header>
  );
}
