import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Suspense, lazy, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ReactLenis } from "@studio-freight/react-lenis";
import { AnimatePresence } from "framer-motion";
import CustomCursor from "../components/CustomCursor";

const Hero = lazy(() => import("./pages/Hero"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HelmetProvider>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
        <BrowserRouter>
          <CustomCursor />
          <Navbar isOpen={isOpen} toggleMenu={toggleMenu} />
          <Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center text-[#e7dfc6]">Loading...</div>}>
            <AnimatedRoutes />
          </Suspense>
        </BrowserRouter>
      </ReactLenis>
    </HelmetProvider>
  );
};

export default App;
