"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// Icon Components
const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const WorkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ContactIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const NAV_CONFIG = [
  { id: "home", type: "page", label: "Home", icon: <HomeIcon /> },
  { id: "hero-scene", type: "component", label: "3D Experience", pageId: "home" },
  { id: "work", type: "page", label: "Works", icon: <WorkIcon /> },
  { id: "featured-projects", type: "component", label: "Featured", pageId: "work" },
  { id: "contact", type: "page", label: "Contact", icon: <ContactIcon /> },
];

const CIRCUMFERENCE = 113.097; // 2 * PI * 18

export default function SideProgressBar() {
  const [activeId, setActiveId] = useState("home");
  const [hoveredId, setHoveredId] = useState(null);
  const rafId = useRef(null);

  // Accurate Active Page/Section Detection based on DOM position
  const checkActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    // Check if at the bottom of page -> activate contact
    if (scrollY + winHeight >= docHeight - 50) {
      setActiveId("contact");
      return;
    }

    // Check DOM section positions
    let currentActive = "home";
    for (const item of NAV_CONFIG) {
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Section is active when its top is near viewport upper-middle
        if (rect.top <= winHeight * 0.5 && rect.bottom >= winHeight * 0.2) {
          currentActive = item.id;
        }
      }
    }
    setActiveId(currentActive);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(checkActiveSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    checkActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [checkActiveSection]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none">
      <div className="relative w-[180px] h-[400px] flex items-center">
        {/* Simple static background track line connecting icons */}
        <div className="absolute left-[19px] top-[44px] bottom-[44px] w-[2px] bg-white/15 rounded-full pointer-events-none z-0" />

        {/* Navigation items list */}
        <div className="relative z-10 w-[40px] flex flex-col justify-between h-full py-6 items-center">
          {NAV_CONFIG.map((item) => {
            // Check if item or its parent page is active
            const isActive = activeId === item.id || (item.type === "component" && activeId === item.pageId);
            const isHovered = hoveredId === item.id;

            if (item.type === "page") {
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="group relative flex items-center justify-center cursor-pointer"
                >
                  {/* SVG Icon Node Container */}
                  <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.9)] z-10">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                      {/* Base background circle outline */}
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="2"
                      />
                      {/* Outline fill circle - highlights clockwise when page is active or hovered */}
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="transparent"
                        stroke={isActive ? "#22d3ee" : "#ffffff"}
                        strokeWidth="2"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={isHovered || isActive ? 0 : CIRCUMFERENCE}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-in-out"
                      />
                    </svg>

                    {/* Icon inner element */}
                    <div
                      className={`z-10 transition-colors duration-300 ${
                        isActive
                          ? "text-cyan-400"
                          : isHovered
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Text Label on hover */}
                  <div
                    className={`absolute left-full overflow-hidden transition-all duration-300 ease-out flex items-center pointer-events-none ${
                      isHovered ? "max-w-[120px] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0"
                    }`}
                  >
                    <span className="text-xs font-medium tracking-wider uppercase text-white whitespace-nowrap px-2.5 py-1 rounded bg-black/80 border border-white/10 backdrop-blur-sm">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            }

            // Sub-component item
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => handleNavClick(e, item.id)}
                className="group relative flex items-center justify-center cursor-pointer py-1 w-full z-10"
              >
                <div
                  className={`transition-all duration-300 flex items-center justify-center bg-black rounded ${
                    isHovered || activeId === item.id
                      ? "w-full bg-cyan-400/20 py-0.5 border border-cyan-400/50"
                      : "w-2 h-2 rounded-full bg-white/30 group-hover:bg-cyan-400"
                  }`}
                >
                  {isHovered ? (
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-300 whitespace-nowrap px-1">
                      {item.label}
                    </span>
                  ) : (
                    <div
                      className={`w-1 h-1 rounded-full ${
                        activeId === item.id ? "bg-cyan-400" : "bg-white/80"
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
