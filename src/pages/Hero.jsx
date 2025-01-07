import HeroText from "../../components/HeroText";
import HeroFooter from "../../components/HeroFooter";
import HeroImg from "../../components/HeroImg";
import Need from "../../components/Need";
import Navbar from "../../components/Navbar";

const Hero = () => {
  return (
    <div className="h-screen   pt-5 ">
      <Navbar />
      <div className="flex px-10 dee-only:px-2 justify-between h-[90%] mddd-only:flex-col">
        <div className="flex flex-col justify-between seee-only:block">
          <HeroText />
          <HeroFooter />
        </div>
        <div className="flex max-w-full justify-end items-end relative overflow-hidden object-contain">
          <HeroImg />
        </div>
      </div>
      <Need />
    </div>
  );
};

export default Hero;
