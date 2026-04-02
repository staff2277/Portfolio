"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 z-50 pointer-events-none mix-blend-difference"
    >
      <div className="font-bold text-xl tracking-tighter uppercase pointer-events-auto">
        <Link href="/">Creative</Link>
      </div>
      
      <nav className="flex gap-8 pointer-events-auto text-sm font-medium">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.name} 
              href={link.path}
              className={`relative overflow-hidden group ${isActive ? 'text-[var(--accent)]' : 'text-white'}`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-full inline-block">
                {link.name}
              </span>
              <span className="absolute top-0 left-0 z-10 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[var(--accent)] inline-block">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
