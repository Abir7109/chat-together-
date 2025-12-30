"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
};

export function SearchModal({ isOpen, onClose, chatId }: SearchModalProps) {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="panel rounded-2xl shadow-2xl p-6 m-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Search in chat</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-1/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search messages..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-tan/30 rounded-xl focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                />
              </div>

              {/* Results */}
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                {!query ? (
                  <div className="text-center py-8 text-text/60">
                    Start typing to search messages
                  </div>
                ) : (
                  <div className="text-center py-8 text-text/60">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
