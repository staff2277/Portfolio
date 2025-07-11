import { useEffect } from "react";
import Footer from "../../components/Footer";
import Passion from "../../components/Passion";
import { motion, useScroll, useTransform } from "framer-motion";

// Use static image path for better preload control
const bgImage = "/bgImage.jpg";

const About = () => {
  const { scrollYProgress } = useScroll();
  const page1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const page1rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "3deg"]);

  // ✅ Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
  }, []);

  return (
    <motion.div className="relative">
      <div className="absolute inset-0 bg-black z-[-10]"></div>

      <motion.div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          scale: page1Scale,
          rotate: page1rotate,
        }}
        className="h-[100vh] sticky top-0 -z-10"
      >
        <div className="flex justify-center items-center h-full">
          <div className="text-[#e7dfc6] z-20 text-center 3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
            Supporting brands to flourish in the digital age.
          </div>
        </div>
      </motion.div>

      <div>
        <Passion />
      </div>

      <div className="z-30 bg-black">
        <Footer />
      </div>
    </motion.div>
  );
};

export default About;
