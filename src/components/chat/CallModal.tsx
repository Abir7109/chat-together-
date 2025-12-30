"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState } from "react";

type CallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "voice" | "video";
  userName: string;
};

export function CallModal({ isOpen, onClose, type, userName }: CallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50"
          />

          {/* Call UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl">
              {/* Video/Avatar Area */}
              <div className="relative aspect-video bg-gradient-to-br from-sage to-sage-light rounded-3xl mb-6 flex items-center justify-center overflow-hidden">
                {type === "video" && !isVideoOff ? (
                  <div className="text-white/50 text-center">
                    <Video size={64} className="mx-auto mb-4" />
                    <p>Video feed would appear here</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-5xl font-bold mb-4 mx-auto">
                      {userName.charAt(0)}
                    </div>
                    <h2 className="text-white text-3xl font-bold">{userName}</h2>
                    <p className="text-white/80 mt-2">
                      {type === "video" ? "Video call" : "Voice call"} • 00:00
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full transition-all ${
                    isMuted
                      ? "bg-red-500 text-white"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  }`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                {type === "video" && (
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition-all ${
                      isVideoOff
                        ? "bg-red-500 text-white"
                        : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    }`}
                  >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <PhoneOff size={28} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
