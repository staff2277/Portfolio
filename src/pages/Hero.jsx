import HeroText from "../../components/HeroText";
import HeroFooter from "../../components/HeroFooter";
import HeroImg from "../../components/HeroImg";
import Need from "../../components/Need";
import Footer from "../../components/Footer";
import { useEffect } from "react";

const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

const Hero = () => {
  useEffect(() => {
    preloadImage("path/to/your/image.jpg");
  }, []);

  return (
    <div className="h-screen pt-5 bg-[#e7dfc6]">
      <div className="flex px-10 dee-only:px-2 justify-between h-[100%] mddd-only:flex-col">
        <div className="flex flex-col justify-between seee-only:block pt-[5rem]">
          <HeroText />
          <HeroFooter />
        </div>
        <div className="flex max-w-full justify-end items-end relative overflow-hidden object-contain">
          <HeroImg />
        </div>
      </div>
      <Need />
      <Footer />
    </div>
  );
};

export default Hero;
