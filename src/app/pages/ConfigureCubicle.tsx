import React, { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero";
import { SEO } from "../components/SEO";
import { Button } from "../components/Button";
import { useCubicleStore, ProductCategory, WoodMaterialType, FinishType, HardwareFinish } from "../../lib/cubicleStore";
import CubicleViewer from "../components/cubicle/CubicleViewer";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { 
  Sliders, 
  Palette, 
  Grid, 
  Download, 
  FileText, 
  Share2, 
  Check, 
  Info,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  RefreshCw,
  LayoutGrid,
  ShieldAlert,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { jsPDF } from "jspdf";

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

export default function ConfigureCubicle() {
  const { 
    category,
    model,
    dimensions, 
    materials, 
    accessories, 
    setCategory,
    setModel,
    setDimension, 
    setMaterial, 
    toggleAccessory, 
    resetConfig,
    getStallCount,
    getLockerGrid,
    getEstimatedPriceRange,
    getConfigJson
  } = useCubicleStore();

  const [activeTab, setActiveTab] = useState<"dimensions" | "materials" | "accessories">("dimensions");
  
  // Lead Form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    requirement: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load configuration from URL query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat") as ProductCategory;
    const mod = params.get("mod");
    const w = params.get("w");
    const d = params.get("d");
    const h = params.get("h");
    const type = params.get("type") as WoodMaterialType;
    const finish = params.get("finish") as FinishType;
    const hw = params.get("hw") as HardwareFinish;
    const acc = params.get("acc");

    if (cat) setCategory(cat);
    if (mod) setModel(mod);
    
    // Slight delay to ensure category default dimensions are set first
    setTimeout(() => {
      if (w) setDimension("width", parseInt(w));
      if (d) setDimension("depth", parseInt(d));
      if (h) setDimension("height", parseInt(h));
      if (type) setMaterial("type", type);
      if (finish) setMaterial("finish", finish);
      if (hw) setMaterial("hardware", hw);

      if (acc) {
        const activeList = acc.split(",");
        (Object.keys(accessories) as Array<keyof typeof accessories>).forEach((key) => {
          const isActive = activeList.includes(key);
          if (accessories[key] !== isActive) {
            toggleAccessory(key);
          }
        });
      }
    }, 50);
  }, []);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── EXPORTS ──
  
  // 1. Download PNG Preview
  const downloadPng = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      triggerToast("⚠️ 3D viewer is rendering, please wait a moment.");
      return;
    }
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `pacific-${category}-design-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      triggerToast("✅ Design preview image downloaded!");
    } catch (err) {
      console.error("PNG export error:", err);
      triggerToast("❌ Failed to capture 3D view. Please try again.");
    }
  };

  // 2. Download PDF Summary
  const downloadPdf = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      triggerToast("⚠️ 3D viewer is loading, please wait.");
      return;
    }

    try {
      const priceRange = getEstimatedPriceRange();
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Header Dark Bar
      doc.setFillColor(3, 2, 19); 
      doc.rect(0, 0, 210, 42, "F");

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("PACIFIC PRODUCTS & SOLUTIONS", 15, 18);
      
      const categoryLabel = category.toUpperCase().replace("_", " ");
      doc.setTextColor(181, 248, 35); 
      doc.setFontSize(11);
      doc.text(`COMMERCIAL ${categoryLabel} - 3D SPECIFICATION REPORT`, 15, 28);

      // Quote Info
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 15);
      doc.text(`Model: ${model.toUpperCase()}`, 160, 22);
      doc.text("Ref: PP-RESTROOM-2026", 160, 29);

      // Screenshot Image
      const imgData = canvas.toDataURL("image/png");
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 48, 180, 102, "F");
      doc.addImage(imgData, "PNG", 15, 48, 180, 102);

      // Section 1: Dimensions
      doc.setFillColor(127, 183, 6); 
      doc.rect(15, 157, 3, 6, "F");
      doc.setTextColor(3, 2, 19);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Dimension Specifications", 22, 162);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(`• Width (Overall): ${dimensions.width} mm`, 20, 172);
      doc.text(`• Depth (Overall): ${dimensions.depth} mm`, 20, 179);
      doc.text(`• Height (Overall): ${dimensions.height} mm`, 20, 186);

      if (category === "toilet_cubicle") {
        doc.text(`• Stall Count: ${getStallCount()} Stalls`, 110, 172);
      } else if (category === "locker_system") {
        const { cols, rows } = getLockerGrid();
        doc.text(`• Grid Size: ${cols} Columns x ${rows} Rows (${cols * rows} Boxes)`, 110, 172);
      } else {
        doc.text("• Installation: Wall Mounted Screen", 110, 172);
      }

      // Section 2: Materials & Board Finish
      doc.setFillColor(127, 183, 6); 
      doc.rect(15, 196, 3, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Material & Hardware Finishes", 22, 201);

      doc.setFont("helvetica", "normal");
      doc.text(`• Wooden Material Core: ${materials.type.toUpperCase()}`, 20, 211);
      doc.text(`• Finish Color Option: ${materials.finish.toUpperCase()}`, 20, 218);
      doc.text(`• Hardware/Knob Finish: ${materials.hardware.toUpperCase()}`, 20, 225);

      // Active Accessories
      const activeAccsList = Object.entries(accessories)
        .filter(([key, active]) => {
          if (!active) return false;
          // Only filter accessories relevant to current category
          if (category === "locker_system") {
            return ["goldKnob", "keyLock", "digitalLock", "numberPlate"].includes(key);
          } else {
            return ["indicatorLock", "coatHook", "ledBacklight", "supportLeg", "bracketClamps"].includes(key);
          }
        })
        .map(([name]) => name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()))
        .join(", ") || "None";
      
      doc.text(`• Active Accessories: ${activeAccsList}`, 110, 211);

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 234, 195, 234);

      // Estimation Box
      doc.setFillColor(233, 253, 191); 
      doc.rect(15, 239, 180, 23, "F");
      
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("ESTIMATED FACTORY PRICE RANGE", 20, 246);
      
      doc.setTextColor(127, 183, 6); 
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(`INR ${priceRange.min.toLocaleString()} - INR ${priceRange.max.toLocaleString()}`, 20, 255);

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("* Budget range is indicative. Final quote includes site templates, shipping, and taxes.", 95, 250);
      doc.text("* Send inquiry details below for wholesale commercial pricing recommendations.", 95, 254);

      // Footer
      doc.setFillColor(3, 2, 19);
      doc.rect(0, 275, 210, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.text("Pacific Products & Solutions | Restroom Partitions & Commercial Lockers", 20, 284);
      doc.setTextColor(181, 248, 35);
      doc.text("Web: www.pacificproduct.in | Email: info@pacificproduct.in | Tel: +91 98185 92113", 20, 289);

      doc.save(`Pacific-Restroom-Quote-${Date.now()}.pdf`);
      triggerToast("✅ PDF Quotation report downloaded!");
    } catch (err) {
      console.error("PDF export error:", err);
      triggerToast("❌ Failed to compile PDF summary.");
    }
  };

  // 3. Share URL
  const shareConfiguration = () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set("cat", category);
      url.searchParams.set("mod", model);
      url.searchParams.set("w", dimensions.width.toString());
      url.searchParams.set("d", dimensions.depth.toString());
      url.searchParams.set("h", dimensions.height.toString());
      url.searchParams.set("type", materials.type);
      url.searchParams.set("finish", materials.finish);
      url.searchParams.set("hw", materials.hardware);

      const activeAccs = Object.entries(accessories)
        .filter(([_, active]) => active)
        .map(([name]) => name)
        .join(",");
      if (activeAccs) url.searchParams.set("acc", activeAccs);

      navigator.clipboard.writeText(url.toString());
      triggerToast("🔗 Configuration link copied! You can share this URL.");
    } catch (err) {
      console.error("Share error:", err);
      triggerToast("❌ Could not compile shareable URL.");
    }
  };

  // ── FORM SUBMISSION ──
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setLeadForm({ ...leadForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const priceRange = getEstimatedPriceRange();
    const activeAccsList = Object.entries(accessories)
      .filter(([_, active]) => active)
      .map(([name]) => name)
      .join(", ") || "None";

    const systemInfoText = `
--- 3D DESIGN SPECIFICATIONS ---
Product Category: ${category.toUpperCase().replace("_", " ")}
Model: ${model.toUpperCase()}
Dimensions:
- Width: ${dimensions.width}mm
- Depth: ${dimensions.depth}mm
- Height: ${dimensions.height}mm
${category === "toilet_cubicle" ? `- Stalls Count: ${getStallCount()} Stalls` : ""}
${category === "locker_system" ? `- Grid Size: ${getLockerGrid().cols} Columns x ${getLockerGrid().rows} Rows` : ""}

Materials:
- Wood Type: ${materials.type.toUpperCase()} (HPL/Plywood)
- Finish Finish: ${materials.finish.toUpperCase()}
- Hardware Color: ${materials.hardware.toUpperCase()}

Active Accessories:
- Add-ons: ${activeAccsList}

Estimated Commercial Quote:
- INR ${priceRange.min.toLocaleString()} - INR ${priceRange.max.toLocaleString()}
    `.trim();

    const completeConfigJson = getConfigJson();

    try {
      // 1. Submit to Supabase table contact_queries (if configured)
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase
          .from("contact_queries")
          .insert([{
            name: leadForm.name,
            email: leadForm.email,
            phone: leadForm.phone,
            company: leadForm.company || null,
            requirement: `Commercial ${category.replace("_", " ")} Quote (${leadForm.city})`,
            message: `User message details: ${leadForm.requirement}\n\n${systemInfoText}\n\nFull JSON Configuration:\n${completeConfigJson}`
          }]);

        if (dbError) {
          console.error("Supabase insert error:", dbError);
        }
      }

      // 2. Submit to Web3Forms API
      if (WEB3FORMS_ACCESS_KEY) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: leadForm.name,
            email: leadForm.email,
            phone: leadForm.phone,
            company: leadForm.company || "N/A",
            requirement: `Restroom & Locker System Inquiry (${leadForm.city})`,
            message: `User Requirement: ${leadForm.requirement}\n\n${systemInfoText}`,
            config_json: completeConfigJson,
            subject: `New Commercial Restroom/Locker Lead from ${leadForm.name}`,
            from_name: "Pacific Products Configurator",
            replyTo: leadForm.email,
            autoresponse: `Hi ${leadForm.name},\n\nThank you for configuring your commercial restroom/locker system on Pacific Products and Solutions!\n\nWe have received your custom 3D design for our ${category.replace("_", " ")} (${model} model). An estimation manager will review your parameters (Width: ${dimensions.width}mm, Finish: ${materials.finish}) and email a formal pricing breakdown shortly.\n\nBest regards,\nThe Pacific Products Team`
          })
        });
      }

      setSubmitSuccess(true);
      setLeadForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        requirement: ""
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError("Failed to submit inquiry. Please try again or email us directly at info@pacificproduct.in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const priceRange = getEstimatedPriceRange();
  const categoryLabel = category.replace("_", " ");

  return (
    <div className="min-h-screen pt-20 bg-[#030213] text-white transition-colors relative">
      <SEO 
        title="Commercial Toilet Cubicles & Lockers 3D Configurator | Pacific"
        description="Design and configure commercial toilet cubicles, partitions, and locker systems in real-time. Select HPL or Plywood materials, colors, and hardware specs."
        canonical="/configure-cubicle"
      />

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-slate-900 border border-[#7FB706] text-white px-4 py-3 rounded-2xl shadow-2xl z-50 transition-all font-medium text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B5F823] animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Hero Header */}
      <PageHero 
        title="Commercial Toilet &amp; Locker Configurator"
        accentWord="Configurator"
        subtitle="Visualize and customize Toilet Cubicles, Urinal Partitions, and Modular Lockers in interactive 3D. Tailor dimensions, panel materials (HPL / Plywood), colors, and hardware before requesting quotes."
        breadcrumb="Commercial Configurator"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Selection Bar */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <span className="text-[11px] font-bold text-[#7FB706] uppercase tracking-widest block mb-4">Step 1: Choose Product Category</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "toilet_cubicle", title: "Toilet Cubicles", desc: "Commercial toilet partition cubicles with multiple stalls" },
              { id: "toilet_partition", title: "Toilet Partitions", desc: "Urinal divider privacy screens & wall mount dividers" },
              { id: "locker_system", title: "Locker Systems", desc: "Multi-compartment storage grids with safety locks" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as ProductCategory)}
                className={`p-5 rounded-2xl border text-left transition-all hover:scale-102 flex flex-col justify-between ${
                  category === cat.id 
                    ? "bg-[#7FB706]/10 border-[#7FB706] ring-1 ring-[#7FB706] shadow-xl" 
                    : "bg-slate-900/40 border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <h4 className={`font-bold text-base ${category === cat.id ? "text-[#B5F823]" : "text-white"}`}>
                    {cat.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="mt-4 flex items-center text-[10px] uppercase font-bold tracking-wider text-[#7FB706] justify-end">
                  {category === cat.id ? <span className="flex items-center gap-1">Selected <Check className="w-3 h-3" /></span> : "Select Model"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main interactive area: Configurator Left, 3D Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16" id="configurator-section">
          
          {/* LEFT: Configuration controls */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">
            
            {/* Tabs Selector */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab("dimensions")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "dimensions" 
                    ? "bg-[#7FB706] text-white shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Dimensions
              </button>
              <button
                onClick={() => setActiveTab("materials")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "materials" 
                    ? "bg-[#7FB706] text-white shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Materials
              </button>
              <button
                onClick={() => setActiveTab("accessories")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "accessories" 
                    ? "bg-[#7FB706] text-white shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Accessories
              </button>
            </div>

            {/* TAB CONTENT: DIMENSIONS */}
            {activeTab === "dimensions" && (
              <div className="space-y-5">
                
                {/* Model design category switcher */}
                <div className="space-y-3">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Model Design Style</span>
                  <div className="grid grid-cols-2 gap-3">
                    {category === "toilet_cubicle" && (
                      <>
                        <button
                          onClick={() => setModel("classic")}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${
                            model === "classic" ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" : "bg-slate-950/40 border-white/10 text-gray-400"
                          }`}
                        >
                          <span className="block font-bold">Classic Model</span>
                          <span className="text-[10px] text-gray-500 mt-1 block">Rectangular brass posts</span>
                        </button>
                        <button
                          onClick={() => setModel("arch")}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${
                            model === "arch" ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" : "bg-slate-950/40 border-white/10 text-gray-400"
                          }`}
                        >
                          <span className="block font-bold">Arched Model</span>
                          <span className="text-[10px] text-gray-500 mt-1 block">Rounded posts &amp; slanted doors</span>
                        </button>
                      </>
                    )}

                    {category === "toilet_partition" && (
                      <>
                        <button
                          onClick={() => setModel("rectangular")}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${
                            model === "rectangular" ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" : "bg-slate-950/40 border-white/10 text-gray-400"
                          }`}
                        >
                          <span className="block font-bold">Rectangular</span>
                          <span className="text-[10px] text-gray-500 mt-1 block">Flat top screen divider</span>
                        </button>
                        <button
                          onClick={() => setModel("arch")}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${
                            model === "arch" ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" : "bg-slate-950/40 border-white/10 text-gray-400"
                          }`}
                        >
                          <span className="block font-bold">Arched Dome</span>
                          <span className="text-[10px] text-gray-500 mt-1 block">Elegantly rounded partition screen</span>
                        </button>
                      </>
                    )}

                    {category === "locker_system" && (
                      <>
                        <button
                          onClick={() => setModel("grid")}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${
                            model === "grid" ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" : "bg-slate-950/40 border-white/10 text-gray-400"
                          }`}
                        >
                          <span className="block font-bold">Grid Locker</span>
                          <span className="text-[10px] text-gray-500 mt-1 block">Equal square box modules</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dimension Controllers</span>
                </div>

                {/* Width */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Overall Width</span>
                    <span className="text-[#B5F823] font-mono font-semibold">{dimensions.width} mm</span>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="range" 
                      min={category === "toilet_cubicle" ? 900 : category === "toilet_partition" ? 400 : 600} 
                      max={category === "toilet_cubicle" ? 3600 : category === "toilet_partition" ? 1200 : 3000} 
                      step={50}
                      value={dimensions.width} 
                      onChange={(e) => setDimension("width", parseInt(e.target.value))}
                      className="flex-1 accent-[#7FB706] bg-slate-950 h-2 rounded-lg cursor-pointer"
                    />
                    <input 
                      type="number" 
                      value={dimensions.width} 
                      onChange={(e) => setDimension("width", parseInt(e.target.value) || dimensions.width)}
                      className="w-18 bg-slate-950 border border-white/10 rounded-lg text-center font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                  {category === "toilet_cubicle" && (
                    <p className="text-[10px] text-gray-500 italic">
                      Generates <strong className="text-white">{getStallCount()} stalls</strong> based on the width width dimension constraints.
                    </p>
                  )}
                  {category === "locker_system" && (
                    <p className="text-[10px] text-gray-500 italic">
                      Splits into <strong className="text-white">{getLockerGrid().cols} columns</strong> of doors.
                    </p>
                  )}
                </div>

                {/* Depth */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Overall Depth</span>
                    <span className="text-[#B5F823] font-mono font-semibold">{dimensions.depth} mm</span>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="range" 
                      min={category === "toilet_cubicle" ? 1000 : category === "toilet_partition" ? 400 : 300} 
                      max={category === "toilet_cubicle" ? 2200 : category === "toilet_partition" ? 1000 : 800} 
                      step={50}
                      value={dimensions.depth} 
                      onChange={(e) => setDimension("depth", parseInt(e.target.value))}
                      className="flex-1 accent-[#7FB706] bg-slate-950 h-2 rounded-lg cursor-pointer"
                    />
                    <input 
                      type="number" 
                      value={dimensions.depth} 
                      onChange={(e) => setDimension("depth", parseInt(e.target.value) || dimensions.depth)}
                      className="w-18 bg-slate-950 border border-white/10 rounded-lg text-center font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Overall Height</span>
                    <span className="text-[#B5F823] font-mono font-semibold">{dimensions.height} mm</span>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="range" 
                      min={category === "toilet_cubicle" ? 1600 : category === "toilet_partition" ? 900 : 900} 
                      max={category === "toilet_cubicle" ? 2400 : category === "toilet_partition" ? 1800 : 2200} 
                      step={50}
                      value={dimensions.height} 
                      onChange={(e) => setDimension("height", parseInt(e.target.value))}
                      className="flex-1 accent-[#7FB706] bg-slate-950 h-2 rounded-lg cursor-pointer"
                    />
                    <input 
                      type="number" 
                      value={dimensions.height} 
                      onChange={(e) => setDimension("height", parseInt(e.target.value) || dimensions.height)}
                      className="w-18 bg-slate-950 border border-white/10 rounded-lg text-center font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                  {category === "locker_system" && (
                    <p className="text-[10px] text-gray-500 italic">
                      Splits into <strong className="text-white">{getLockerGrid().rows} vertical rows</strong> of lockers.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: MATERIALS */}
            {activeTab === "materials" && (
              <div className="space-y-5">
                
                {/* Material Core Type */}
                <div className="space-y-3">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Wooden Material Base</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMaterial("type", "hpl")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        materials.type === "hpl" 
                          ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" 
                          : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <span className="block font-bold">HPL Material</span>
                      <span className="text-[10px] text-gray-500 mt-1 block">High Pressure Laminate screen</span>
                    </button>
                    <button
                      onClick={() => setMaterial("type", "plywood")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        materials.type === "plywood" 
                          ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" 
                          : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <span className="block font-bold">Solid Plywood</span>
                      <span className="text-[10px] text-gray-500 mt-1 block">Sturdy plywood timber board</span>
                    </button>
                  </div>
                </div>

                {/* Color Finishes */}
                <div className="space-y-3">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Color &amp; Wood Finishes</span>
                  
                  {category === "locker_system" && (
                    <div className="bg-[#7FB706]/5 border border-[#7FB706]/20 p-3 rounded-xl text-[10px] text-gray-400 flex items-start gap-2 mb-2 leading-relaxed">
                      <Info className="w-3.5 h-3.5 text-[#B5F823] shrink-0" />
                      <span><strong>Image Multi-tone Match</strong>: Selecting Cream, Sage, or Charcoal applies the designer multi-colored rows (Cream top, Sage middle, Charcoal bottom) layout seen in your photo.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "cream", label: "Classic Cream", hex: "#f5f3e9" },
                      { id: "sage", label: "Sage Green", hex: "#7f9282" },
                      { id: "purple", label: "Royal Purple", hex: "#6b4a62" },
                      { id: "oak", label: "Oak Wood Grain", hex: "#cf9d6f" },
                      { id: "charcoal", label: "Charcoal Black", hex: "#32373d" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setMaterial("finish", f.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                          materials.finish === f.id 
                            ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" 
                            : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: f.hex }} />
                        <span className="truncate">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hardware Trim */}
                <div className="space-y-3">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Hinges &amp; Handles Coating</span>
                  <div className="flex gap-4">
                    {[
                      { id: "brass", label: "Gold Brass", hex: "#e5c158" },
                      { id: "chrome", label: "Chrome Steel", hex: "#cbd5e1" },
                      { id: "black", label: "Matte Black", hex: "#1e293b" }
                    ].map((hw) => (
                      <button
                        key={hw.id}
                        onClick={() => setMaterial("hardware", hw.id)}
                        className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center text-xs transition-all ${
                          materials.hardware === hw.id 
                            ? "bg-[#7FB706]/15 border-[#7FB706] text-white font-semibold" 
                            : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: hw.hex }} />
                        <span className="text-[10px] mt-0.5">{hw.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: ACCESSORIES */}
            {activeTab === "accessories" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Optional Hardware Toggles</span>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Accessories for Cubicles and Urinals */}
                  {category !== "locker_system" && (
                    <>
                      <button
                        onClick={() => toggleAccessory("supportLeg")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          accessories.supportLeg ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="font-bold">Floor Support Legs</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Heavy-duty hardware floor support</div>
                        </div>
                        {accessories.supportLeg && <Check className="w-4 h-4 text-[#B5F823]" />}
                      </button>

                      {category === "toilet_cubicle" && (
                        <>
                          <button
                            onClick={() => toggleAccessory("indicatorLock")}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                              accessories.indicatorLock ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="font-bold">Red/Green Indicator Lock</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">Occupancy indicator latch</div>
                            </div>
                            {accessories.indicatorLock && <Check className="w-4 h-4 text-[#B5F823]" />}
                          </button>

                          <button
                            onClick={() => toggleAccessory("coatHook")}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                              accessories.coatHook ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="font-bold">Coat Hook &amp; Bumper</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">Stall hook accessory</div>
                            </div>
                            {accessories.coatHook && <Check className="w-4 h-4 text-[#B5F823]" />}
                          </button>

                          <button
                            onClick={() => toggleAccessory("ledBacklight")}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                              accessories.ledBacklight ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="font-bold">Neon LED Header Glow</div>
                              <div className="text-[10px] text-gray-500 mt-0.5">Premium backlight channel along frames</div>
                            </div>
                            {accessories.ledBacklight && <Check className="w-4 h-4 text-[#B5F823]" />}
                          </button>
                        </>
                      )}

                      {category === "toilet_partition" && (
                        <button
                          onClick={() => toggleAccessory("bracketClamps")}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                            accessories.bracketClamps ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <div>
                            <div className="font-bold">Wall bracket clamps</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">Heavy-duty chrome wall brackets</div>
                          </div>
                          {accessories.bracketClamps && <Check className="w-4 h-4 text-[#B5F823]" />}
                        </button>
                      )}
                    </>
                  )}

                  {/* Accessories for Lockers */}
                  {category === "locker_system" && (
                    <>
                      <button
                        onClick={() => toggleAccessory("goldKnob")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          accessories.goldKnob ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="font-bold">Brass Pull Knobs</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Round brass knobs (matches Image 1)</div>
                        </div>
                        {accessories.goldKnob && <Check className="w-4 h-4 text-[#B5F823]" />}
                      </button>

                      <button
                        onClick={() => toggleAccessory("keyLock")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          accessories.keyLock ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="font-bold">Key Lock Cylinder</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Individual door security lock &amp; keyhole</div>
                        </div>
                        {accessories.keyLock && <Check className="w-4 h-4 text-[#B5F823]" />}
                      </button>

                      <button
                        onClick={() => toggleAccessory("digitalLock")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          accessories.digitalLock ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="font-bold">Digital Keypad Lock</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">RFID passcode keypad panel</div>
                        </div>
                        {accessories.digitalLock && <Check className="w-4 h-4 text-[#B5F823]" />}
                      </button>

                      <button
                        onClick={() => toggleAccessory("numberPlate")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          accessories.numberPlate ? "bg-[#7FB706]/10 border-[#7FB706] text-white" : "bg-slate-950/40 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="font-bold">Identification Number Plates</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Top-centered compartment door labels</div>
                        </div>
                        {accessories.numberPlate && <Check className="w-4 h-4 text-[#B5F823]" />}
                      </button>
                    </>
                  )}

                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-white/5 flex gap-4">
              <button
                onClick={resetConfig}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("lead-inquiry-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#7FB706] text-white hover:bg-[#6fa005] font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1 hover:shadow-lg active:scale-95"
              >
                Inquire Quote
              </button>
            </div>

          </div>

          {/* RIGHT: 3D Viewer Canvas */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Viewer Component */}
            <CubicleViewer />

            {/* Summary Details */}
            <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                
                {/* Specifications List */}
                <div className="space-y-3 border-r border-white/5 pr-6">
                  <div className="text-xs text-[#7FB706] font-bold uppercase tracking-wider">Design Breakdown</div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block">System Type</span>
                      <span className="text-white font-medium capitalize">{categoryLabel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Dimensions</span>
                      <span className="text-white font-medium">{dimensions.width}×{dimensions.depth}×{dimensions.height} mm</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Panel Material</span>
                      <span className="text-white font-medium uppercase">{materials.type} ({materials.finish})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Model Style</span>
                      <span className="text-white font-medium capitalize">{model}</span>
                    </div>
                  </div>
                </div>

                {/* Estimate Budget */}
                <div className="space-y-2.5">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B5F823]" />
                    Estimated Commercial Quote (Ex-Factory)
                  </div>
                  <div className="text-3xl font-extrabold text-[#B5F823] font-mono tracking-wide">
                    ₹{priceRange.min.toLocaleString()} – ₹{priceRange.max.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 leading-normal flex items-start gap-1">
                    <Info className="w-3 h-3 text-[#7FB706] shrink-0 mt-0.5" />
                    <span>Includes wood core boards, support structure fittings, and knobs. Excludes shipping, assembly labor, and taxes.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Export options */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={downloadPng}
                className="flex-1 min-w-[150px] gap-2 border-white/10 text-white hover:bg-white/5 hover:border-[#7FB706]"
              >
                <Download className="w-4 h-4 text-[#B5F823]" />
                PNG Image
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadPdf}
                className="flex-1 min-w-[150px] gap-2 border-white/10 text-white hover:bg-white/5 hover:border-[#7FB706]"
              >
                <FileText className="w-4 h-4 text-[#B5F823]" />
                PDF Report
              </Button>
              <Button 
                variant="secondary" 
                onClick={shareConfiguration}
                className="flex-1 min-w-[150px] gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </Button>
            </div>

          </div>

        </div>

        {/* SECTION 8 – LEAD GENERATION FORM */}
        <section id="lead-inquiry-form" className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7FB706]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#B5F823]/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-3 flex items-center justify-center gap-2.5">
              <LayoutGrid className="w-8 h-8 text-[#B5F823]" />
              Request a Commercial Quote
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto font-medium">
              Submit your customized 3D design specifications directly to our project estimators. We will respond with pricing, delivery details, and samples.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7FB706]" /> Full Name *
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={leadForm.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Sanjay Sen"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FB706] transition-colors text-sm"
                />
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#7FB706]" /> Company / Architecture Studio
                </label>
                <input 
                  type="text" 
                  name="company"
                  value={leadForm.company}
                  onChange={handleFormChange}
                  placeholder="e.g. Apex Workspace Solutions"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FB706] transition-colors text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7FB706]" /> Email Address *
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={leadForm.email}
                  onChange={handleFormChange}
                  placeholder="e.g. sanjay@apexsolutions.in"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FB706] transition-colors text-sm"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#7FB706]" /> Phone Number *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  pattern="[+\d\s\-().]{7,15}"
                  title="Please enter a valid phone number (7–15 digits)"
                  value={leadForm.phone}
                  onChange={handleFormChange}
                  placeholder="e.g. +91 98185 92113"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FB706] transition-colors text-sm"
                />
              </div>

              {/* City */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#7FB706]" /> Site Installation City *
                </label>
                <input 
                  type="text" 
                  name="city"
                  required
                  value={leadForm.city}
                  onChange={handleFormChange}
                  placeholder="e.g. Mumbai, Gurgaon, Noida, Bangalore"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FB706] transition-colors text-sm"
                />
              </div>

              {/* Project Requirements */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  Project Quantity &amp; Requirements Details
                </label>
                <textarea 
                  name="requirement"
                  value={leadForm.requirement}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe your layout requirements: e.g. 'Need 15 stalls of Arched Toilet Cubicles in Sage Green and 12 Urinal partition screens for a commercial mall restroom floor. Required within 3 weeks.'"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FB706] transition-colors text-sm resize-none"
                />
              </div>

            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {submitError}
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-[#E9FDBF] text-[#030213] p-5 rounded-xl text-sm font-semibold text-center border border-[#7FB706]/40 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#7FB706] shrink-0" />
                Quotation request successfully submitted! Our team will contact you with product proposals.
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {isSubmitting ? "Sending details..." : "Submit Quotation Request"}
              </Button>
            </div>

          </form>
        </section>

      </div>
    </div>
  );
}
