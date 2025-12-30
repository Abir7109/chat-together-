"use client";

import { motion } from "framer-motion";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-2xl",
  };

  return (
    <motion.div
      className={`${sizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-sage to-sage-light text-white font-bold shadow-lg`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10">CT</div>
      <div className="absolute inset-0 bg-sage/20 rounded-2xl blur-xl" />
    </motion.div>
  );
}
