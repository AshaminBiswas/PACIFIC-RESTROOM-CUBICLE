import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import type { Catalog } from "../../lib/database.types";
import { FileText, Image as ImageIcon, Download, ExternalLink, X, Search } from "lucide-react";
import { SEO } from "../components/SEO";

const DOCUMENT_TYPES = [
  "Brochure",
  "Catalog",
  "Drawing",
  "Installation Manual",
  "Warranty",
  "Technical Specification",
  "Test Report",
  "Other"
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function Downloads() {
  const [downloads, setDownloads] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("Brochure");
  const [previewItem, setPreviewItem] = useState<Catalog | null>(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("catalogs")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      
      if (data) {
        setDownloads(data as Catalog[]);
      }
      setLoading(false);
    };

    fetchDownloads();
  }, []);

  // Filter and group by category
  const filteredDownloads = downloads.filter((d) => (d.document_type || "Catalog") === selectedType);
  
  const groupedByCategory = filteredDownloads.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Catalog[]>);

  // Available document types that actually have files
  const availableTypes = DOCUMENT_TYPES.filter(
    (type) => downloads.some((d) => (d.document_type || "Catalog") === type)
  );

  // Fallback if the selected type has no items but others do
  useEffect(() => {
    if (!loading && availableTypes.length > 0 && !availableTypes.includes(selectedType)) {
      setSelectedType(availableTypes[0]);
    }
  }, [loading, availableTypes, selectedType]);


  return (
    <div className="bg-white dark:bg-[#05050f] min-h-screen pt-24 pb-20">
      <SEO
        title="Technical Downloads & Product Catalogs"
        description="Download product brochures, CAD drawings, technical specifications, and installation manuals for our restroom cubicle, cladding, and locker systems."
        keywords="restroom cubicle brochure download, HPL cladding technical specification, locker system catalog PDF, cubicle installation manual, Pacific Products downloads"
        canonical="/download"
      />

      {/* Hero Banner */}
      <div className="bg-gray-50 dark:bg-[#0a0a1a] border-y border-gray-200 dark:border-white/5 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Technical Downloads &amp; Product Catalogs</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Access our complete library of product brochures, technical specifications, CAD drawings, and installation manuals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Document Types</h3>
              <nav className="space-y-2">
                {DOCUMENT_TYPES.map((type) => {
                  const count = downloads.filter((d) => (d.document_type || "Catalog") === type).length;
                  if (count === 0 && !loading) return null;
                  
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                        selectedType === type
                          ? "bg-[#7FB706] text-white font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedType === type ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-500"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
                {loading && (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/5 rounded-2xl animate-pulse"></div>
                 ))}
              </div>
            ) : filteredDownloads.length === 0 ? (
              <div className="bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/5 rounded-2xl p-16 text-center">
                <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No documents found</h3>
                <p className="text-gray-600 dark:text-gray-400">There are currently no {selectedType.toLowerCase()}s available for download.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedByCategory).map(([category, items]) => (
                  <div key={category}>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category}</h2>
                      <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => setPreviewItem(item)}
                          className="group bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/5 rounded-2xl p-5 hover:border-[#7FB706] dark:hover:border-[#7FB706]/30 hover:bg-gray-100 dark:hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col"
                        >
                          <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-200 dark:bg-black/50 border border-gray-200 dark:border-white/5 relative">
                            {item.thumbnail_url ? (
                               <img 
                                 src={item.thumbnail_url} 
                                 alt={item.title} 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                               />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                                {item.file_type === "pdf" ? (
                                  <FileText className="w-12 h-12 mb-2" />
                                ) : (
                                  <ImageIcon className="w-12 h-12 mb-2" />
                                )}
                                <span className="text-xs uppercase tracking-wider">{item.file_type}</span>
                              </div>
                            )}
                            
                            {/* Overlay hover action */}
                            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-4 py-2 bg-[#7FB706] text-white rounded-full text-sm font-medium flex items-center gap-2">
                                <Search className="w-4 h-4" /> View Document
                              </span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-gray-900 dark:text-white font-medium mb-1 line-clamp-2 group-hover:text-[#7FB706] transition-colors">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                            <span className="text-xs text-gray-500">{formatFileSize(item.file_size)}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.file_url, '_blank');
                              }}
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl h-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200 dark:border-white/10 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${previewItem.file_type === 'pdf' ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400'}`}>
                  {previewItem.file_type === "pdf" ? (
                    <FileText className="w-6 h-6" />
                  ) : (
                    <ImageIcon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{previewItem.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {previewItem.category} • {formatFileSize(previewItem.file_size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />Open in New Tab
                </a>
                <a
                  href={previewItem.file_url}
                  download
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7FB706] rounded-xl text-white hover:bg-[#6fa005] transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />Download
                </a>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors ml-2"
                  aria-label="Close"
>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="flex-1 overflow-hidden p-4 md:p-6 bg-gray-50 dark:bg-[#05050f]">
              {previewItem.file_type === "pdf" ? (
                <iframe
                  src={`${previewItem.file_url}#toolbar=0`}
                  className="w-full h-full rounded-xl border border-gray-200 dark:border-white/10 bg-white"
                  title={previewItem.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto">
                  <img
                    src={previewItem.file_url}
                    alt={previewItem.title}
                    className="max-w-full max-h-full rounded-xl object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
