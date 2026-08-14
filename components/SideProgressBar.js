"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useSpring } from "framer-motion";

export default function SideProgressBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef(null);

  // Magnetic ball springs
  const mouseX = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isHovered && containerRef.current) {
        const { left, top, width, height } =
          containerRef.current.getBoundingClientRect();
        // Calculate distance from center of the resting ball position (left center edge)
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY,
        );

        // Magnetic pull radius
        if (distance < 150) {
          // Calculate a softer pull based on distance
          const pullStrength = 0.3; // How much it pulls towards mouse
          mouseX.set(distanceX * pullStrength);
          mouseY.set(distanceY * pullStrength);
        } else {
          // Snap back
          mouseX.set(0);
          mouseY.set(0);
        }
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered, mouseX, mouseY]);

  // Track active section based on scroll
  useEffect(() => {
    const sections = ["home", "work", "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Basic check for sections based on their offsets
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          // If the middle of the screen is within the element
          if (top <= windowHeight / 2 && bottom >= windowHeight / 2) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "work", label: "Work", icon: <WorkIcon /> },
    { id: "contact", label: "Contact", icon: <ContactIcon /> },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-screen w-32 z-50 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full flex items-center justify-start pl-6">
        {/* The Container for both states */}
        <motion.div
          ref={containerRef}
          className="relative flex items-center justify-center overflow-hidden"
          animate={{
            height: isHovered ? "100vh" : "48px",
            width: isHovered ? "80px" : "48px",
            borderRadius: isHovered ? "0px" : "24px",
            left: isHovered ? "-24px" : "0px", // pull flush to edge when expanded
            backgroundColor: isHovered
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(255, 255, 255, 0.1)",
            backdropFilter: isHovered ? "blur(12px)" : "blur(8px)",
          }}
          style={{
            x: isHovered ? 0 : mouseX,
            y: isHovered ? 0 : mouseY,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8,
          }}
        >
          {/* Vertical Gradient for expanded state */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Magnetic Ball Inner Dot (Visible only when untriggered) */}
          <motion.div
            className="w-2 h-2 rounded-full bg-white absolute"
            animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0 : 1 }}
          />

          {/* Expanded Content */}
          <motion.div
            className="flex flex-col items-center justify-center h-full w-full py-20 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
            style={{ pointerEvents: isHovered ? "auto" : "none" }}
          >
            {navItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* Icon Item */}
                <NavItem
                  item={item}
                  isActive={activeSection === item.id}
                  onClick={(e) => handleNavClick(e, item.id)}
                />

                {/* Connecting Line (for components) */}
                {index < navItems.length - 1 && (
                  <div className="h-16 w-full flex items-center justify-center group cursor-pointer">
                    <div className="w-[1px] h-full bg-white/20 group-hover:bg-white/60 group-hover:w-[2px] transition-all duration-300 relative">
                      {/* Subtle hint for clickable lines in between */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/0 group-hover:bg-white/60 transition-all duration-300" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-component for individual nav items to handle their own hover state
function NavItem({ item, isActive, onClick }) {
  const [isItemHovered, setIsItemHovered] = useState(false);

  return (
    <a
      href={`#${item.id}`}
      onClick={onClick}
      className="relative flex items-center justify-center p-3 rounded-full cursor-pointer"
      onMouseEnter={() => setIsItemHovered(true)}
      onMouseLeave={() => setIsItemHovered(false)}
    >
      <motion.div
        className={`flex items-center gap-3 overflow-hidden ${
          isActive ? "text-white" : "text-white/50"
        } hover:text-white transition-colors duration-300`}
        animate={{
          width: isItemHovered ? "auto" : "24px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="shrink-0 w-6 h-6 flex items-center justify-center">
          {item.icon}
        </div>

        <motion.span
          className="font-medium text-sm tracking-wide whitespace-nowrap pr-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isItemHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.label}
        </motion.span>
      </motion.div>

      {/* Active Dot Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeDot"
          className="absolute -right-2 w-1.5 h-1.5 bg-white rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
    </a>
  );
}

// Icons
const HomeIcon = () => (
  <svg
    width="20"
    height="20"
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
    width="20"
    height="20"
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
    width="20"
    height="20"
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
