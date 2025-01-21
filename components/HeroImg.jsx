import heroImg from "/images/aibg1.png";
import Lottie from "lottie-react";
import arrow from "../animations/arrow1.json";

const HeroImg = () => {
  return (
    <div className="flex border-2 justify-between items-end sm:justify-end relative w-full h-[90%] overflow-hidden">
      <span className="bg-[#e7dfc6] rounded-3xl mddd:hidden">
        <Lottie
          animationData={arrow}
          className="w-[5rem] sm-only:w-[3rem]"
          loop={true}
        />
      </span>
      <img
        src={heroImg}
        alt="Hero Image"
        className="mix-luminosity grayscale contrast-100 w-full h-auto object-contain max-w-full max-h-full"
      />

      <div className="absolute top-10 left-[-5px] sm:top-24 sm:left-[10%] w-[110px] text-[.7rem]  text-center see:text-[.9rem] seee:text-[1rem] mddd:hidden">
        &quot;I Build user-friendly, responsive web experiences&quot;
      </div>
    </div>
  );
};

export default HeroImg;
/* see-only:w-full sm:w-[90%] md:w-[65%] mddd:w-[100%]  */
