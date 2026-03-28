import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === "a" ||
        e.target.tagName.toLowerCase() === "button" ||
        e.target.closest("a") ||
        e.target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(231, 223, 198, 0.4)",
      border: "1px solid rgba(231, 223, 198, 0.8)",
      mixBlendMode: "difference",
      transition: {
        type: "tween",
        ease: "backOut",
        duration: 0.1,
      },
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(231, 223, 198, 0.1)",
      border: "1px solid rgba(231, 223, 198, 1)",
      mixBlendMode: "difference",
      transition: {
        type: "tween",
        ease: "backOut",
        duration: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[9999]"
      variants={variants}
      animate={isHovering ? "hover" : "default"}
      // Hide cursor on touch devices utilizing CSS later if needed
    />
  );
};

export default CustomCursor;
