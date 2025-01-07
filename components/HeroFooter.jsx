import Lottie from "lottie-react";
import arrow from "../animations/arrow1.json";

const HeroFooter = () => {
  return (
    <div className="flex items-center">
      <div className="sm-only:bg-[#e7dfc6] rounded-3xl e-only:hidden">
        <Lottie
          animationData={arrow}
          className="w-[5rem] sm-only:w-[3rem]"
          loop={true}
        />
      </div>
      <p className=" w-[50%] ee-only:w-[70%] p-5 rounded-full text-center see-only:w-full seee-only:leading-none mddd-only:p-0 see-only:text-xs mddd-only:hidden ">
        &ldquo;I am a Front-end developer passionate about crafting
        user-friendly, responsive web experiences.&ldquo;
      </p>
    </div>
  );
};

export default HeroFooter;
