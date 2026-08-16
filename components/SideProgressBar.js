"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function SideProgressBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef(null);
  const ballRef = useRef(null);
  const svgPathRef = useRef(null);
  const itemRefs = useRef([]);

  // Store current physics values for magnetic ball to allow smooth lerping
  const ballPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameId = useRef(null);

  // SVG Bulge path animation parameters (base width expanded to 112px, 2x original 56px)
  const svgBulgePos = useRef({
    y: 160,
    width: 112,
    targetY: 160,
    targetWidth: 112,
  });

  const navItems = [
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "work", label: "Works", icon: <WorkIcon /> },
    { id: "contact", label: "Contact", icon: <ContactIcon /> },
  ];

  // 1. Magnetic Ball Mouse Interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isExpanded || !ballRef.current) return;

      const rect = ballRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const pullRadius = 140;
      if (distance < pullRadius) {
        ballPos.current.targetX = deltaX * 0.35;
        ballPos.current.targetY = deltaY * 0.35;
      } else {
        ballPos.current.targetX = 0;
        ballPos.current.targetY = 0;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isExpanded]);

  // Spring physics ticker for magnetic ball reset / snap
  useEffect(() => {
    let active = true;
    const updatePhysics = () => {
      if (!isExpanded && ballRef.current) {
        // Elastic / spring lerp towards target
        ballPos.current.x +=
          (ballPos.current.targetX - ballPos.current.x) * 0.18;
        ballPos.current.y +=
          (ballPos.current.targetY - ballPos.current.y) * 0.18;

        gsap.set(ballRef.current, {
          x: ballPos.current.x,
          y: ballPos.current.y,
        });
      }
      if (active) {
        animFrameId.current = requestAnimationFrame(updatePhysics);
      }
    };
    animFrameId.current = requestAnimationFrame(updatePhysics);
    return () => {
      active = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isExpanded]);

  // 2. Scroll depth progress tracer calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;

      const progress =
        maxScroll > 0
          ? Math.min(Math.max((scrollY / maxScroll) * 100, 0), 100)
          : 0;
      setScrollProgress(progress);

      // Identify active section accurately based on viewport center or document position
      const sections = ["home", "work", "contact"];
      let currentActive = "home";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= winHeight * 0.6 && rect.bottom >= winHeight * 0.2) {
            currentActive = id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // 3. Dynamic Organic SVG Bulge Animation via GSAP
  const renderPath = (currentY, currentWidth) => {
    const baseW = 112; // Expanded unhovered base width (2x original 56px)
    const totalH = 520;
    const radius = 28;

    // Outer right boundary path with cubic bezier curve for bulge at currentY
    const bulgeH = 44; // Half-height of bulge transition
    const topBulge = Math.max(radius, currentY - bulgeH);
    const botBulge = Math.min(totalH - radius, currentY + bulgeH);

    return `
      M 0,0
      L ${baseW - radius},0
      A ${radius},${radius} 0 0,1 ${baseW},${radius}
      L ${baseW},${topBulge}
      C ${currentWidth},${topBulge + 12} ${currentWidth},${botBulge - 12} ${baseW},${botBulge}
      L ${baseW},${totalH - radius}
      A ${radius},${radius} 0 0,1 ${baseW - radius},${totalH}
      L 0,${totalH}
      Z
    `;
  };

  useEffect(() => {
    if (!isExpanded || !svgPathRef.current) return;

    if (hoveredIndex !== null && itemRefs.current[hoveredIndex]) {
      const itemEl = itemRefs.current[hoveredIndex];
      const itemTop = itemEl.offsetTop + itemEl.offsetHeight / 2;
      svgBulgePos.current.targetY = itemTop;
      svgBulgePos.current.targetWidth = 195; // Expanded bulge peak distance
    } else {
      svgBulgePos.current.targetWidth = 112; // Expanded flat default
    }

    gsap.to(svgBulgePos.current, {
      y: svgBulgePos.current.targetY,
      width: svgBulgePos.current.targetWidth,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
      onUpdate: () => {
        if (svgPathRef.current) {
          svgPathRef.current.setAttribute(
            "d",
            renderPath(svgBulgePos.current.y, svgBulgePos.current.width),
          );
        }
      },
    });
  }, [hoveredIndex, isExpanded]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isExpanded) handleCollapse();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleExpand = () => {
    // Animate snap back first, then morph into vertical track
    gsap.to(ballRef.current, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        setIsExpanded(true);
      },
    });
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setHoveredIndex(null);
    ballPos.current = { x: 0, y: 0, targetX: 0, targetY: 0 };
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
    >
      {/* A. REST STATE: MAGNETIC BALL */}
      {!isExpanded && (
        <div
          ref={ballRef}
          onClick={handleExpand}
          className="group relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300"
          title="Click to open progress navigation"
        >
          {/* Inner Glowing Ball core */}
          <div className="w-3.5 h-3.5 rounded-full bg-white group-hover:scale-125 transition-transform duration-300 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

          {/* Magnetic Aura / Pulse */}
          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-25 pointer-events-none" />
        </div>
      )}

      {/* B. EXPANDED STATE: VERTICAL PROGRESS NAV WITH ORGANIC SVG BULGE */}
      {isExpanded && (
        <div className="relative w-[210px] h-[320px] flex items-center">
          {/* SVG Background Container with morphing bezier bulge path */}
          <svg
            className="absolute left-0 top-0 w-full h-full pointer-events-none drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            viewBox="0 0 210 320"
          >
            <path
              ref={svgPathRef}
              d={renderPath(svgBulgePos.current.y, svgBulgePos.current.width)}
              fill="rgba(15, 15, 20, 0.75)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
              style={{ backdropFilter: "blur(16px)" }}
            />
          </svg>

          {/* Vertical Track Scroll Progress Tracer - aligned directly down center line at X = 56px */}
          <div className="absolute left-[55px] top-[40px] bottom-[40px] w-[2px] bg-white/15 rounded-full overflow-hidden pointer-events-none z-0">
            <div
              className="w-full bg-gradient-to-b from-cyan-400 to-indigo-500 transition-all duration-150 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* Close Button at top corner */}
          <button
            onClick={handleCollapse}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center text-xs transition-colors z-20"
            title="Collapse menu"
          >
            ✕
          </button>

          {/* Navigation Icon Nodes - Centered inside 112px base container width */}
          <div className="relative z-10 w-[112px] flex flex-col justify-around h-full py-8 items-center">
            {navItems.map((item, idx) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="group relative flex items-center cursor-pointer py-2 px-2 rounded-xl transition-all duration-300"
                >
                  {/* Icon Container Node - Perfectly centered over vertical progress line */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                      isActive
                        ? "bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.9)] scale-110"
                        : "bg-black/60 text-white/70 border border-white/20 group-hover:bg-white/20 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Text Label - Reveals dynamically to the right on hover */}
                  <div
                    className={`absolute left-full overflow-hidden transition-all duration-300 ease-out flex items-center pointer-events-none ${
                      isHovered
                        ? "max-w-[120px] opacity-100 ml-3"
                        : "max-w-0 opacity-0 ml-0"
                    }`}
                  >
                    <span className="text-xs font-semibold tracking-wider uppercase text-white whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/80 px-2.5 py-1 rounded-md border border-white/10">
                      {item.label}
                    </span>
                  </div>

                  {/* Active Indicator Pulse Ring around icon */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-pulse pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
const HomeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Work / Briefcase Icon
const WorkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

// Mail Icon
const ContactIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
