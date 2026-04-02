"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function TransitionLayout({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div key={pathname} className="w-full h-full min-h-screen">
        {children}
      </div>
    </AnimatePresence>
  );
}
