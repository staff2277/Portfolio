import { useState } from "react";
import { motion } from "framer-motion";

const items = [{ title: "STREAMVIBE", image: "/streamVibe.png" }];

const Work = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="h-[80vh]   bg-black text-white"
      onMouseMove={handleMouseMove}
    >
      <div>
        <motion.h1
          className="text-[#e7dfc6] mt-[4rem] ml-[2rem] z-40 py-[2rem] 3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] f"
          initial={{
            scale: 1,
            rotate: "0deg",
          }}
          whileInView={{}}
        >
          Work
        </motion.h1>
      </div>
      <div className="relative pl-[10rem] flex flex-col border-y-[1px] border-[#1F1F1F] w-[70%] space-y-4">
        {items.map((item, index) => (
          <a href="#" key={index}>
            <motion.div
              initial={{
                scale: 1,
                rotate: "0deg",
                x: "200px",
              }}
              whileInView={{
                x: "0px",
              }}
              whileHover={{
                scale: 1.2,
                rotate: "-2deg",
              }}
              transition={{
                type: "spring",
                bounce: 0.8,
              }}
              key={index}
              className="relative w-fil group cursor-pointer"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.h2
                className="text-[#e7dfc6] py-[2rem]  italic z-30 3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold  group-hover:opacity-80 transition"
                initial={{
                  color: "#333333",
                }}
                whileHover={{
                  color: "#e7dfc6",
                }}
              >
                {item.title}
              </motion.h2>
            </motion.div>
          </a>
        ))}

        {hoveredItem && (
          <motion.img
            src={hoveredItem.image}
            alt={hoveredItem.title}
            className="absolute pointer-events-none z-0 overflow-hidden  w-[80%] rounded-lg shadow-lg"
            style={{
              top: cursorPosition.y - 500, // Adjusts position relative to cursor
              left: cursorPosition.x - 500,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
};

export default Work;
