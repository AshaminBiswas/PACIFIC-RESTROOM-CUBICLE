import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Lock, Unlock, Trash2, Plus,
  ChevronRight, ChevronDown, Search,
  MousePointer2, Square, Box, Circle, DoorOpen, Layers,
} from "lucide-react";
import { useDesignStore } from "../../../lib/designStore";

const TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  wall:      Square,
  panel:     Square,
  box:       Box,
  cylinder:  Circle,
  door:      DoorOpen,
  shelf:     Layers,
};

const TYPE_COLORS: Record<string, string> = {
  wall:     "#74b9ff",
  panel:    "#a8e6cf",
  box:      "#fdcb6e",
  cylinder: "#e17055",
  door:     "#55efc4",
  shelf:    "#fd79a8",
};

/* ─── Scene Outliner ────────────────────────────────────────────────────── */

export function SceneOutliner() {
  const objects        = useDesignStore((s) => s.objects);
  const selectedId     = useDesignStore((s) => s.selectedId);
  const selectObject   = useDesignStore((s) => s.selectObject);
  const updateObject   = useDesignStore((s) => s.updateObject);
  const removeObject   = useDesignStore((s) => s.removeObject);
  const layers         = useDesignStore((s) => s.layers);
  const activeLayerId  = useDesignStore((s) => s.activeLayerId);
  const addLayer       = useDesignStore((s) => s.addLayer);
  const removeLayer    = useDesignStore((s) => s.removeLayer);
  const toggleLayerVisibility = useDesignStore((s) => s.toggleLayerVisibility);
  const toggleLayerLock       = useDesignStore((s) => s.toggleLayerLock);
  const setActiveLayer        = useDesignStore((s) => s.setActiveLayer);

  const [search, setSearch]             = useState("");
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editingName, setEditingName]   = useState("");
  const [outlinerOpen, setOutlinerOpen] = useState(true);
  const [layersOpen, setLayersOpen]     = useState(true);

  const filtered = objects.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.type.toLowerCase().includes(search.toLowerCase())
  );

  const sectionHeader = (label: string, open: boolean, toggle: () => void, count?: number) => (
    <button
      onClick={toggle}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        background: "rgba(255,255,255,0.03)",
        border: "none",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.7)",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      {label}
      {count !== undefined && (
        <span style={{
          marginLeft: "auto",
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          fontWeight: 400,
        }}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Search */}
      <div style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position: "relative" }}>
          <Search size={11} style={{
            position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.3)",
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter objects..."
            style={{
              width: "100%", padding: "4px 8px 4px 24px",
              borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)", color: "#fff",
              fontSize: 11, fontFamily: "'Inter', system-ui, sans-serif",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Objects Section */}
      {sectionHeader("Objects", outlinerOpen, () => setOutlinerOpen((p) => !p), filtered.length)}

      <AnimatePresence>
        {outlinerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden", flex: "1 1 auto", overflowY: "auto" }}
          >
            {filtered.length === 0 && (
              <div style={{
                padding: "16px 10px",
                textAlign: "center",
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
              }}>
                No objects in scene
              </div>
            )}
            {filtered.map((obj) => {
              const Icon  = TYPE_ICONS[obj.type] || MousePointer2;
              const color = TYPE_COLORS[obj.type] || "#aaa";
              const isSel = selectedId === obj.id;
              const isEditing = editingId === obj.id;

              return (
                <div
                  key={obj.id}
                  onClick={() => selectObject(obj.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 8px",
                    cursor: "pointer",
                    background: isSel
                      ? "rgba(0,120,212,0.18)"
                      : "transparent",
                    borderLeft: isSel ? "2px solid #0078d4" : "2px solid transparent",
                    transition: "background 0.1s",
                  }}
                >
                  <Icon size={12} style={{ color, flexShrink: 0 }} />
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => {
                        if (editingName.trim()) updateObject(obj.id, { name: editingName.trim() });
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (editingName.trim()) updateObject(obj.id, { name: editingName.trim() });
                          setEditingId(null);
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flex: 1, background: "rgba(255,255,255,0.08)",
                        border: "1px solid #0078d4", borderRadius: 3,
                        color: "#fff", fontSize: 11, padding: "1px 4px",
                        fontFamily: "'Inter', system-ui, sans-serif",
                        outline: "none",
                      }}
                    />
                  ) : (
                    <span
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(obj.id);
                        setEditingName(obj.name);
                      }}
                      style={{
                        flex: 1, fontSize: 11, color: isSel ? "#fff" : "rgba(255,255,255,0.75)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        fontFamily: "'Inter', system-ui, sans-serif",
                      }}
                    >
                      {obj.name}
                    </span>
                  )}

                  {/* Visibility */}
                  <button
                    onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
                    title={obj.visible ? "Hide" : "Show"}
                  >
                    {obj.visible ? <Eye size={11} /> : <EyeOff size={11} style={{ color: "rgba(255,255,255,0.15)" }} />}
                  </button>
                  {/* Lock */}
                  <button
                    onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { locked: !obj.locked }); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: obj.locked ? "#fdcb6e" : "rgba(255,255,255,0.25)", flexShrink: 0 }}
                    title={obj.locked ? "Unlock" : "Lock"}
                  >
                    {obj.locked ? <Lock size={11} /> : <Unlock size={11} />}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "rgba(255,80,80,0.4)", flexShrink: 0 }}
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layers Section */}
      {sectionHeader("Layers", layersOpen, () => setLayersOpen((p) => !p), layers.length)}

      <AnimatePresence>
        {layersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden", flex: "0 0 auto" }}
          >
            {layers.map((layer) => {
              const isActive = activeLayerId === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 8px",
                    cursor: "pointer",
                    background: isActive ? "rgba(0,120,212,0.12)" : "transparent",
                    borderLeft: isActive ? "2px solid #0078d4" : "2px solid transparent",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Color dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: layer.color, flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }} />
                  <span style={{
                    flex: 1, fontSize: 11, color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {layer.name}
                  </span>
                  {/* Vis */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "rgba(255,255,255,0.35)" }}
                  >
                    {layer.visible ? <Eye size={11} /> : <EyeOff size={11} style={{ color: "rgba(255,255,255,0.15)" }} />}
                  </button>
                  {/* Lock */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: layer.locked ? "#fdcb6e" : "rgba(255,255,255,0.25)" }}
                  >
                    {layer.locked ? <Lock size={11} /> : <Unlock size={11} />}
                  </button>
                  {/* Remove (not layer_0) */}
                  {layer.id !== "layer_0" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "rgba(255,80,80,0.4)" }}
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              );
            })}
            {/* Add layer */}
            <button
              onClick={() => addLayer(`Layer ${layers.length}`)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 5,
                padding: "5px 8px", background: "none", border: "none",
                color: "rgba(255,255,255,0.3)", cursor: "pointer",
                fontSize: 11, fontFamily: "'Inter', system-ui, sans-serif",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Plus size={11} /> Add Layer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
