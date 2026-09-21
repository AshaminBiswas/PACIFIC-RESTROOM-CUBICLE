import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Eye, FileText, Image as ImageIcon, ExternalLink } from "lucide-react";
import type { Catalog } from "../../lib/database.types";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

interface CatalogViewerProps {
  catalog: Catalog;
  onClose: () => void;
}

export function CatalogViewerModal({ catalog, onClose }: CatalogViewerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-5xl bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl max-h-[92vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                catalog.file_type === "pdf"
                  ? "bg-red-100 dark:bg-red-500/10"
                  : "bg-blue-100 dark:bg-blue-500/10"
              }`}>
                {catalog.file_type === "pdf" ? (
                  <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {catalog.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {catalog.file_type.toUpperCase()} • {formatFileSize(catalog.file_size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={catalog.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
              <a
                href={catalog.file_url}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7FB706]/10 rounded-lg text-[#7FB706] hover:bg-[#7FB706]/20 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Body */}
          <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
            {catalog.file_type === "pdf" ? (
              <iframe
                src={catalog.file_url}
                className="w-full h-full min-h-[65vh] rounded-xl border border-gray-200 dark:border-white/10 bg-white"
                title={catalog.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center overflow-auto min-h-[50vh]">
                <img
                  src={catalog.file_url}
                  alt={catalog.title}
                  className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-lg"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Catalog Card (for listing catalogs on product pages) ─────
interface CatalogCardProps {
  catalog: Catalog;
}

export function CatalogCard({ catalog }: CatalogCardProps) {
  const [showViewer, setShowViewer] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:border-[#7FB706]/30 hover:shadow-lg hover:shadow-[#7FB706]/5 transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          {/* Icon / Thumbnail */}
          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {catalog.thumbnail_url ? (
              <img
                src={catalog.thumbnail_url}
                alt={catalog.title}
                className="w-full h-full object-cover"
              />
            ) : catalog.file_type === "pdf" ? (
              <FileText className="w-6 h-6 text-red-500" />
            ) : (
              <ImageIcon className="w-6 h-6 text-blue-500" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {catalog.title}
            </h4>
            {catalog.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                {catalog.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                catalog.file_type === "pdf"
                  ? "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }`}>
                {catalog.file_type === "pdf" ? (
                  <FileText className="w-3 h-3" />
                ) : (
                  <ImageIcon className="w-3 h-3" />
                )}
                {catalog.file_type.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {formatFileSize(catalog.file_size)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => setShowViewer(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-[#E9FDBF] dark:hover:bg-[#7FB706]/10 hover:text-[#7FB706] text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <a
            href={catalog.file_url}
            download
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </motion.div>

      {showViewer && (
        <CatalogViewerModal
          catalog={catalog}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
}
