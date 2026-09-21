import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Settings2, Palette, ChevronDown, ChevronRight,
  Copy, Lock, Unlock, Trash2, Minus, Plus,
  Camera, FileDown, FileJson, Link2, MessageSquareQuote, X,
} from "lucide-react";
import {
  useDesignStore, MATERIALS, type DesignMaterial,
} from "../../../lib/designStore";
import { SceneOutliner } from "./SceneOutliner";

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const BG        = "#1e1e1e";
const BG_PANEL  = "#252525";
const BORDER    = "rgba(255,255,255,0.07)";
const TEXT_DIM  = "rgba(255,255,255,0.4)";
const TEXT      = "rgba(255,255,255,0.8)";
const ACCENT    = "#0078d4";
const ACCENT_DIM = "rgba(0,120,212,0.15)";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "5px 8px",
  borderRadius: 4,
  border: `1px solid ${BORDER}`,
  background: "#1a1a1a",
  color: TEXT,
  fontSize: 11,
  fontFamily: "'Inter', system-ui, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

/* ─── Accordion Section ──────────────────────────────────────────────── */
function AccordionSection({
  label, icon: Icon, children, defaultOpen = true,
}: {
  label: string; icon?: React.ComponentType<any>;
  children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 6,
          padding: "7px 10px", background: "none", border: "none",
          color: TEXT, cursor: "pointer", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.02em", fontFamily: "'Inter', system-ui, sans-serif",
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
      >
        {Icon && <Icon size={12} style={{ opacity: 0.6 }} />}
        <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
        {open ? <ChevronDown size={11} style={{ opacity: 0.4 }} /> : <ChevronRight size={11} style={{ opacity: 0.4 }} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "4px 10px 10px" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Dim Input ──────────────────────────────────────────────────────── */
function DimInput({
  label, value, onChange, color, unit = "mm",
}: {
  label: string; value: number; onChange: (v: number) => void;
  color: string; unit?: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color, fontWeight: 600, marginBottom: 2, letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
        <button
          onClick={() => onChange(Math.max(10, value - 50))}
          style={{
            width: 18, height: 22, borderRadius: 3, border: `1px solid ${BORDER}`,
            background: "#1a1a1a", color: TEXT_DIM, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Minus size={9} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(10, Number(e.target.value)))}
          style={{
            ...inputStyle, textAlign: "center", padding: "3px 2px",
            fontSize: 11, width: "100%",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <button
          onClick={() => onChange(value + 50)}
          style={{
            width: 18, height: 22, borderRadius: 3, border: `1px solid ${BORDER}`,
            background: "#1a1a1a", color: TEXT_DIM, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Plus size={9} />
        </button>
      </div>
      <div style={{ fontSize: 8, color: TEXT_DIM, textAlign: "right", marginTop: 1 }}>{unit}</div>
    </div>
  );
}

/* ─── Properties Panel ───────────────────────────────────────────────── */
function PropertiesPanel() {
  const sel           = useDesignStore((s) => s.getSelectedObject());
  const updateObject  = useDesignStore((s) => s.updateObject);
  const removeObject  = useDesignStore((s) => s.removeObject);
  const duplicateObject = useDesignStore((s) => s.duplicateObject);
  const _pushHistory  = useDesignStore((s) => s._pushHistory);

  if (!sel) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <Settings2 size={32} style={{ margin: "12px auto 10px", opacity: 0.15, display: "block" }} />
        <div style={{ fontSize: 12, color: TEXT_DIM }}>No object selected</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
          Click an object in the viewport to inspect its properties
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    wall: "Wall Panel", panel: "Flat Panel", box: "Box / Locker",
    cylinder: "Column", door: "Door", shelf: "Shelf",
  };

  return (
    <>
      {/* Type badge + Name */}
      <div style={{ marginBottom: 8 }}>
        <span style={{
          display: "inline-block", padding: "2px 8px", borderRadius: 3,
          background: ACCENT_DIM, color: "#60a8e8",
          fontSize: 10, fontWeight: 600, marginBottom: 6,
          border: `1px solid rgba(0,120,212,0.3)`,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {typeLabels[sel.type] || sel.type}
        </span>
        <input
          value={sel.name}
          onChange={(e) => updateObject(sel.id, { name: e.target.value })}
          style={{ ...inputStyle, fontSize: 12 }}
          placeholder="Object name"
        />
      </div>

      {/* Transform */}
      <AccordionSection label="Transform" defaultOpen={true}>
        <div style={{ fontSize: 10, color: TEXT_DIM, marginBottom: 4 }}>Position (mm)</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          <DimInput label="X" value={Math.round(sel.position.x * 1000)} color="#ff6b6b"
            onChange={(v) => { _pushHistory(); updateObject(sel.id, { position: { ...sel.position, x: v / 1000 } }); }} />
          <DimInput label="Y" value={Math.round(sel.position.y * 1000)} color="#51cf66"
            onChange={(v) => { _pushHistory(); updateObject(sel.id, { position: { ...sel.position, y: v / 1000 } }); }} />
          <DimInput label="Z" value={Math.round(sel.position.z * 1000)} color="#74b9ff"
            onChange={(v) => { _pushHistory(); updateObject(sel.id, { position: { ...sel.position, z: v / 1000 } }); }} />
        </div>
        <div style={{ fontSize: 10, color: TEXT_DIM, marginBottom: 4 }}>Rotation (°)</div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["x", "y", "z"] as const).map((axis) => (
            <DimInput key={axis} label={axis.toUpperCase()}
              value={Math.round((sel.rotation[axis] * 180) / Math.PI)}
              color={axis === "x" ? "#ff6b6b" : axis === "y" ? "#51cf66" : "#74b9ff"}
              unit="°"
              onChange={(deg) => {
                _pushHistory();
                updateObject(sel.id, { rotation: { ...sel.rotation, [axis]: (deg * Math.PI) / 180 } });
              }}
            />
          ))}
        </div>
      </AccordionSection>

      {/* Dimensions */}
      <AccordionSection label="Dimensions" defaultOpen={true}>
        <div style={{ display: "flex", gap: 4 }}>
          <DimInput label="Width" value={sel.dimensions.x} color="#ff6b6b"
            onChange={(v) => { _pushHistory(); updateObject(sel.id, { dimensions: { ...sel.dimensions, x: v } }); }} />
          <DimInput label="Height" value={sel.dimensions.y} color="#51cf66"
            onChange={(v) => {
              _pushHistory();
              updateObject(sel.id, { dimensions: { ...sel.dimensions, y: v }, position: { ...sel.position, y: v / 2000 } });
            }} />
          <DimInput label="Depth" value={sel.dimensions.z} color="#74b9ff"
            onChange={(v) => { _pushHistory(); updateObject(sel.id, { dimensions: { ...sel.dimensions, z: v } }); }} />
        </div>
      </AccordionSection>

      {/* Material */}
      <AccordionSection label="Material" icon={Palette} defaultOpen={false}>
        <select
          value={sel.materialId}
          onChange={(e) => {
            _pushHistory();
            const mat = MATERIALS.find((m) => m.id === e.target.value);
            if (mat) updateObject(sel.id, { materialId: mat.id, color: mat.color });
          }}
          style={{ ...inputStyle, cursor: "pointer", marginBottom: 6 }}
        >
          {MATERIALS.map((m) => (
            <option key={m.id} value={m.id} style={{ background: "#1a1a1a", color: "#fff" }}>
              {m.name}
            </option>
          ))}
        </select>
        {/* Color preview */}
        {(() => {
          const mat = MATERIALS.find((m) => m.id === sel.materialId);
          if (!mat) return null;
          return (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 8px", borderRadius: 4,
              background: "#1a1a1a", border: `1px solid ${BORDER}`,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 3, background: mat.color,
                border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{mat.name}</div>
                <div style={{ fontSize: 9, color: TEXT_DIM }}>
                  {mat.category.toUpperCase()} · R{mat.roughness} · M{mat.metalness}
                </div>
              </div>
            </div>
          );
        })()}
      </AccordionSection>

      {/* Actions */}
      <AccordionSection label="Actions" defaultOpen={true}>
        <div style={{ display: "flex", gap: 5 }}>
          <button
            onClick={() => duplicateObject(sel.id)}
            style={{
              flex: 1, padding: "6px 0", borderRadius: 4,
              border: `1px solid ${BORDER}`, background: "#1a1a1a",
              color: TEXT, cursor: "pointer", fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            <Copy size={12} /> Duplicate
          </button>
          <button
            onClick={() => { _pushHistory(); updateObject(sel.id, { locked: !sel.locked }); }}
            style={{
              width: 34, height: 30, borderRadius: 4,
              border: sel.locked ? "1px solid rgba(253,203,110,0.4)" : `1px solid ${BORDER}`,
              background: sel.locked ? "rgba(253,203,110,0.1)" : "#1a1a1a",
              color: sel.locked ? "#fdcb6e" : TEXT_DIM,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            title={sel.locked ? "Unlock" : "Lock"}
          >
            {sel.locked ? <Lock size={13} /> : <Unlock size={13} />}
          </button>
          <button
            onClick={() => removeObject(sel.id)}
            style={{
              width: 34, height: 30, borderRadius: 4,
              border: "1px solid rgba(255,80,80,0.25)",
              background: "rgba(255,60,60,0.06)", color: "#ff6b6b",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </AccordionSection>
    </>
  );
}

/* ─── Materials Palette ──────────────────────────────────────────────── */
function MaterialsPalette() {
  const activeMaterialId = useDesignStore((s) => s.activeMaterialId);
  const setActiveMaterial = useDesignStore((s) => s.setActiveMaterial);
  const setTool          = useDesignStore((s) => s.setTool);

  const categories: { label: string; items: DesignMaterial[] }[] = [
    { label: "HPL Finishes",     items: MATERIALS.filter((m) => m.category === "hpl") },
    { label: "Hardware",         items: MATERIALS.filter((m) => m.category === "hardware") },
    { label: "Glass",            items: MATERIALS.filter((m) => m.category === "glass") },
    { label: "Metal",            items: MATERIALS.filter((m) => m.category === "metal") },
  ];

  return (
    <div>
      <div style={{ fontSize: 10, color: TEXT_DIM, marginBottom: 8, padding: "0 2px" }}>
        Select a material, then click objects to paint them
      </div>
      {categories.map((cat) => (
        <div key={cat.label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: TEXT_DIM, letterSpacing: "0.06em", marginBottom: 5, textTransform: "uppercase" }}>
            {cat.label}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
            {cat.items.map((mat) => {
              const isActive = activeMaterialId === mat.id;
              return (
                <button
                  key={mat.id}
                  onClick={() => { setActiveMaterial(mat.id); setTool("paint"); }}
                  title={mat.name}
                  style={{
                    width: "100%", aspectRatio: "1", borderRadius: 5,
                    border: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                    background: mat.color, cursor: "pointer",
                    boxShadow: isActive ? `0 0 8px rgba(0,120,212,0.5)` : "0 1px 3px rgba(0,0,0,0.4)",
                    position: "relative", overflow: "hidden",
                    transition: "all 0.12s",
                  }}
                >
                  {mat.metalness > 0.5 && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent 60%)",
                    }} />
                  )}
                  {mat.opacity < 1 && (
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.1) 0% 25%, transparent 0% 50%)",
                      backgroundSize: "6px 6px",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Export Panel ───────────────────────────────────────────────────── */
function ExportPanel() {
  const exportConfig = useDesignStore((s) => s.exportConfig);
  const objects      = useDesignStore((s) => s.objects);
  const projectName  = useDesignStore((s) => s.projectName);
  const [showQuote, setShowQuote] = useState(false);

  const handlePNG = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${projectName.replace(/\s+/g, "_")}_design.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  }, [projectName]);

  const handleJSON = useCallback(() => {
    const json = exportConfig();
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${projectName.replace(/\s+/g, "_")}_config.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportConfig, projectName]);

  const handleShare = useCallback(() => {
    const json    = exportConfig();
    const encoded = btoa(json);
    const url     = `${window.location.origin}/design-studio?config=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied!");
  }, [exportConfig]);

  const handlePDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setFillColor(28, 28, 28); doc.rect(0, 0, 297, 30, "F");
    doc.setTextColor(127, 183, 6); doc.setFontSize(16);
    doc.text("Pacific Products — Design Studio", 15, 16);
    doc.setTextColor(255, 255, 255); doc.setFontSize(10);
    doc.text(projectName, 15, 23);
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png", 0.9);
      doc.addImage(imgData, "PNG", 10, 35, 160, 110);
    }
    let y = 46;
    doc.setTextColor(30, 30, 30); doc.setFontSize(11);
    doc.text("Object Summary", 195, y); y += 10;
    doc.setFontSize(9);
    objects.slice(0, 20).forEach((obj) => {
      doc.text(`${obj.name} — ${obj.dimensions.x}×${obj.dimensions.y}×${obj.dimensions.z}mm`, 195, y);
      y += 7;
      if (y > 185) { doc.addPage(); y = 20; }
    });
    doc.setFontSize(7); doc.setTextColor(150, 150, 150);
    doc.text(`Generated ${new Date().toLocaleDateString()} | Pacific Products & Solutions`, 15, 200);
    doc.save(`${projectName.replace(/\s+/g, "_")}_specification.pdf`);
  }, [projectName, objects]);

  const btnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8, width: "100%",
    padding: "8px 10px", borderRadius: 5, border: `1px solid ${BORDER}`,
    background: "#1a1a1a", color: TEXT, cursor: "pointer", fontSize: 11,
    fontFamily: "'Inter', system-ui, sans-serif", marginBottom: 4,
    transition: "background 0.1s",
  };

  return (
    <>
      <button style={btnStyle} onClick={handlePNG}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ACCENT_DIM; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; }}>
        <Camera size={13} /> PNG Screenshot
      </button>
      <button style={btnStyle} onClick={handlePDF}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ACCENT_DIM; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; }}>
        <FileDown size={13} /> PDF Specification
      </button>
      <button style={btnStyle} onClick={handleJSON}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ACCENT_DIM; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; }}>
        <FileJson size={13} /> Export JSON
      </button>
      <button style={btnStyle} onClick={handleShare}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ACCENT_DIM; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; }}>
        <Link2 size={13} /> Copy Share Link
      </button>
      <button
        onClick={() => setShowQuote(true)}
        style={{
          width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 6,
          border: "none", background: "linear-gradient(135deg, #0078d4, #005fa3)",
          color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: "0 4px 16px rgba(0,120,212,0.3)",
        }}
      >
        <MessageSquareQuote size={15} /> Request Quote
      </button>
      {showQuote && <QuoteModal onClose={() => setShowQuote(false)} config={exportConfig()} objectCount={objects.length} projectName={projectName} />}
    </>
  );
}

/* ─── Quote Modal ────────────────────────────────────────────────────── */
function QuoteModal({ onClose, config, objectCount, projectName }: {
  onClose: () => void; config: string; objectCount: number; projectName: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = new FormData();
      payload.append("access_key", "3e3c8393-92e9-4ef1-b498-cafed760b5ab");
      payload.append("subject", `Design Studio Quote: ${projectName}`);
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("message", form.message);
      payload.append("design_objects", String(objectCount));
      payload.append("project", projectName);
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
      setSent(true);
    } catch { setSent(true); }
    setSending(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: "#1e1e1e", border: `1px solid ${BORDER}`,
          borderRadius: 10, padding: 28, width: 360,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Request a Quote</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_DIM }}>
            <X size={16} />
          </button>
        </div>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Quote request sent!</div>
            <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 6 }}>Our team will get back to you within 24 hours.</div>
            <button onClick={onClose} style={{ marginTop: 18, padding: "8px 24px", borderRadius: 6, border: "none", background: ACCENT, color: "#fff", cursor: "pointer", fontSize: 13 }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["name", "email", "phone"] as const).map((field) => (
              <input
                key={field}
                required={field !== "phone"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === "email" ? " *" : field === "phone" ? "" : " *")}
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                style={{ ...inputStyle, padding: "8px 10px" }}
              />
            ))}
            <textarea
              placeholder="Additional requirements..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, padding: "8px 10px", resize: "none" }}
            />
            <div style={{ fontSize: 10, color: TEXT_DIM }}>
              Project: {projectName} · {objectCount} objects in design
            </div>
            <button
              type="submit"
              disabled={sending}
              style={{
                padding: "10px", borderRadius: 6, border: "none",
                background: sending ? "rgba(0,120,212,0.5)" : ACCENT,
                color: "#fff", cursor: sending ? "not-allowed" : "pointer",
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {sending ? "Sending..." : "Send Request"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Tab Definitions ────────────────────────────────────────────────── */
type SideTab = "properties" | "materials" | "outliner" | "export";
const TABS: { id: SideTab; label: string; icon: React.ComponentType<any> }[] = [
  { id: "properties", label: "Props",    icon: Settings2 },
  { id: "materials",  label: "Materials", icon: Palette },
  { id: "outliner",   label: "Scene",    icon: Settings2 },
  { id: "export",     label: "Output",   icon: FileDown },
];

/* ─── Main Sidebar ────────────────────────────────────────────────────── */
export function DesignSidebar() {
  const [activeTab, setActiveTab] = useState<SideTab>("properties");

  return (
    <div style={{
      position: "absolute",
      right: 0, top: 0, bottom: 0,
      width: 260,
      background: BG,
      borderLeft: `1px solid ${BORDER}`,
      display: "flex",
      flexDirection: "column",
      zIndex: 30,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: `1px solid ${BORDER}`,
        background: BG_PANEL,
        flexShrink: 0,
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "8px 4px",
                background: "none",
                border: "none",
                borderBottom: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                color: isActive ? "#fff" : TEXT_DIM,
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: "0.02em",
                transition: "all 0.12s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {activeTab === "properties" && <PropertiesPanel />}
        {activeTab === "materials"  && (
          <div style={{ padding: "10px 10px" }}>
            <MaterialsPalette />
          </div>
        )}
        {activeTab === "outliner"   && <SceneOutliner />}
        {activeTab === "export"     && (
          <div style={{ padding: 10 }}>
            <ExportPanel />
          </div>
        )}
      </div>
    </div>
  );
}
