"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md text-white transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div>
        <Link href="/" className="text-xl font-bold tracking-widest hover:text-gray-300 transition-colors">
          LOGO
        </Link>
      </div>
      <div className="flex gap-8">
        <Link href="/work" className="text-sm uppercase tracking-widest font-medium hover:text-gray-300 transition-colors">
          Work
        </Link>
        <Link href="/contact" className="text-sm uppercase tracking-widest font-medium hover:text-gray-300 transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  );
}
