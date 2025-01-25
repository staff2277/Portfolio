import HeroText from "../../components/HeroText";
import HeroFooter from "../../components/HeroFooter";
import HeroImg from "../../components/HeroImg";
import Need from "../../components/Need";
import Footer from "../../components/Footer";
import Work from "../../components/Work";
import { useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

const Hero = () => {
  useEffect(() => {
    preloadImage("path/to/your/image.jpg");
  }, []);

  const { scrollYProgress } = useScroll();

  const page1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const page1Rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "10deg"]);

  return (
    <div className="bg-black">
      <motion.div
        style={{
          scale: page1Scale,
          rotate: page1Rotate,
        }}
        className="h-[100vh] static  top-0 bg-[#e7dfc6] z-[-1]"
      >
        <div className="flex px-10 dee-only:px-2 justify-between h-full mddd-only:flex-col">
          <div className="flex flex-col justify-between seee-only:block pt-[5rem]">
            <HeroText />
            <HeroFooter />
          </div>
          <div className="flex max-w-full justify-end items-end relative overflow-hidden object-contain">
            <HeroImg />
          </div>
        </div>
      </motion.div>

      <div className="mt-10">
        <div>
          <Need />
        </div>

        <Work />
        <Footer />
      </div>
    </div>
  );
};

export default Hero;
