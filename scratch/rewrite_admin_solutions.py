 import re

with open("src/app/pages/admin/AdminSolutions.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure imports are there
content = content.replace('Trash2, X, Upload, Eye, EyeOff } from "lucide-react";', 
'Trash2, X, Upload, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";\nimport Editor from "react-simple-wysiwyg";\nimport type { ProductColor } from "../../../lib/database.types";')

# Update empty state
content = content.replace('description: "", icon_name', 'description: "", bottom_description: "", icon_name')
content = content.replace('clients: [] as string[], sort_order', 'clients: [] as string[], colors: [] as ProductColor[], sort_order')

# Update state variables in component
state_hook_idx = content.find('const [form, setForm] = useState({ ...empty });')
state_hook_end = state_hook_idx + len('const [form, setForm] = useState({ ...empty });')
content = content[:state_hook_end] + '\n  const [isExpanded, setIsExpanded] = useState(false);\n  const colorFileRef = useRef<HTMLInputElement>(null);\n  const [colorName, setColorName] = useState("");' + content[state_hook_end:]

# Update openCreate
content = content.replace('setShow(true); setErr(""); };', 'setShow(true); setIsExpanded(false); setErr(""); };')

# Update openEdit
content = content.replace('description: s.description, icon_name', 'description: s.description, bottom_description: s.bottom_description || "", icon_name')
content = content.replace('clients: [...s.clients], sort_order', 'clients: [...s.clients], colors: s.colors || [], sort_order')

# Update save
content = content.replace('setShow(false); refetch();', 'refetch(); return { success: true, slug };')
content = content.replace('setErr(e.message); } finally', 'setErr(e.message); return { success: false, slug: null }; } finally')

# Add handleSaveAndClose and handleSaveAndPreview
save_idx = content.find('const del = async (id: string)')
save_functions = """
  const handleSaveAndClose = async () => {
    const res = await save();
    if (res?.success) setShow(false);
  };

  const handleSaveAndPreview = async () => {
    const res = await save();
    if (res?.success && res.slug) {
      window.open(`/solutions/${res.slug}`, "_blank");
      setShow(false);
    }
  };

  const handleColorImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadImage(f, "solutions");
    if (url) {
      if (!colorName.trim()) {
        setErr("Please enter a color name before uploading.");
        return;
      }
      setForm((p) => ({
        ...p,
        colors: [...(p.colors || []), { name: colorName.trim(), image_url: url }],
      }));
      setColorName("");
      if (colorFileRef.current) colorFileRef.current.value = "";
    }
  };

"""
content = content[:save_idx] + save_functions + content[save_idx:]

# Update modal wrapper classes
content = content.replace('className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-12"', 'className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 overflow-hidden p-4 sm:p-6"')

modal_inner_re = r'className="w-full max-w-2xl bg-\[#0a0a1a\] border border-white/10 rounded-2xl"'
content = re.sub(modal_inner_re, 'className={`w-full bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isExpanded ? "max-w-[98vw] h-[95vh]" : "max-w-3xl max-h-[85vh]"}`}', content)

header_re = r'<div className="flex items-center justify-between p-6 border-b border-white/10"><h3 className="text-lg font-bold text-white">\{editing \? "Edit" : "New"\} Solution</h3><button onClick=\{[^}]+\} className="p-2 rounded-lg hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button></div>'
header_repl = """
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-white">{editing ? "Edit Solution" : "New Solution"}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" title={isExpanded ? "Collapse" : "Expand"}>
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button onClick={() => setShow(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>
"""
content = re.sub(header_re, header_repl.strip(), content)

content = content.replace('className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"', 'className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar"')

# Replace description textarea with Editor
desc_re = r'<div><label className="block text-sm text-gray-300 mb-1">Description</label><textarea [^>]+/></div>'
desc_repl = """
<div>
  <label className="block text-sm text-gray-300 mb-1">Description</label>
  <div className="bg-[#0a0a1a] border border-white/10 rounded-xl overflow-auto resize-y min-h-[200px] max-h-[800px] flex flex-col [&_.rsw-editor]:flex-1 [&_.rsw-editor]:text-white [&_.rsw-toolbar]:bg-white/5 [&_.rsw-toolbar]:border-b [&_.rsw-toolbar]:border-white/10 [&_.rsw-btn]:text-gray-300 hover:[&_.rsw-btn]:text-white [&_.rsw-btn[data-active='true']]:bg-[#7FB706] [&_.rsw-btn[data-active='true']]:text-white">
    <Editor value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
  </div>
</div>
"""
content = re.sub(desc_re, desc_repl.strip(), content)

# Inject bottom_description and colors right before the save buttons footer
footer_re = r'<div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">.*?</button></div>'
footer_idx = re.search(footer_re, content).start()

new_fields = """
              {/* Bottom Description */}
              <div className="border-t border-white/5 pt-4">
                <label className="block text-sm font-semibold text-white mb-2">Additional Description (Below Specs)</label>
                <div className="bg-[#0a0a1a] border border-white/10 rounded-xl overflow-auto resize-y min-h-[150px] max-h-[600px] flex flex-col [&_.rsw-editor]:flex-1 [&_.rsw-editor]:text-white [&_.rsw-toolbar]:bg-white/5 [&_.rsw-toolbar]:border-b [&_.rsw-toolbar]:border-white/10 [&_.rsw-btn]:text-gray-300 hover:[&_.rsw-btn]:text-white [&_.rsw-btn[data-active='true']]:bg-[#7FB706] [&_.rsw-btn[data-active='true']]:text-white">
                  <Editor value={form.bottom_description || ""} onChange={(e) => setForm((f) => ({ ...f, bottom_description: e.target.value }))} />
                </div>
              </div>

              {/* Colors */}
              <div className="border-t border-white/5 pt-4">
                <label className="block text-sm font-semibold text-white mb-2">Colors & Finishes</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Color Name (e.g. Matte Black)" className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7FB706]" />
                  <input ref={colorFileRef} type="file" accept="image/*" onChange={handleColorImg} className="hidden" />
                  <button type="button" onClick={() => colorFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-[#7FB706]/20 text-[#7FB706] rounded-xl text-sm">
                    <Upload className="w-4 h-4" /> Upload Swatch
                  </button>
                </div>
                {form.colors && form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {form.colors.map((c, i) => (
                      <div key={i} className="relative group flex flex-col items-center gap-1">
                        <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                        <span className="text-xs text-gray-400">{c.name}</span>
                        <button type="button" onClick={() => setForm((p) => ({ ...p, colors: (p.colors || []).filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
"""

new_footer = """
            <div className="flex items-center justify-between p-6 border-t border-white/10 shrink-0">
              <button onClick={() => setShow(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
              <div className="flex items-center gap-3">
                <button onClick={handleSaveAndPreview} disabled={saving || !form.title} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 text-sm font-medium transition-colors">Save & Preview</button>
                <button onClick={handleSaveAndClose} disabled={saving || !form.title} className="px-6 py-2 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] disabled:opacity-50 text-sm font-medium transition-colors">{saving ? "Saving…" : editing ? "Update" : "Create"}</button>
              </div>
            </div>
"""

content = content[:footer_idx] + new_fields + "            </div>\n" + new_footer + content[footer_idx + len(re.search(footer_re, content).group(0)):]

# Fix trailing tags: I replaced `</div><div class="flex items-center justify-end gap-3 p-6...`
# Wait, the original footer was `</div><div className="flex items-center justify-end gap-3...`?
# NO, the original code had:
# `</div>\n            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">...`
# Ah! In my string `new_fields`, I did not include the `</div>` that closed the body div!
# I will make sure the body div is closed by finding `</div>\n            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10"` and replacing it.
# Let's fix this matching properly:

with open("src/app/pages/admin/AdminSolutions.tsx", "w", encoding="utf-8") as f:
    f.write(content)
