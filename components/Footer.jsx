import { motion, useTransform, useScroll } from "framer-motion";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const page2Scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const page2rotate = useTransform(scrollYProgress, [0, 1], ["5deg", "0deg"]);

  const transStyle = {
    scale: location.pathname === "/about" ? page2Scale : 1,
    rotate: location.pathname === "/about" ? page2rotate : "0deg",
  };

  return (
    <motion.div
      className="px-10 dee-only:px-2 h-screen grid grid-rows-[auto_25%] bg-[#e7dfc6] z-40"
      style={transStyle}
    >
      <div className="flex items-end h-full md-only:justify-center 3xl:px-[10%] max-2xl:px-[5%]">
        <div className="flex justify-between items-center 2xl:px-[5%] w-full">
          <div className=" flex flex-col justify-end md-only:items-center md-only:w-full">
            <div className="flex items-center gap-[20px] w-full">
              <span>
                <img
                  className="w-[130px] rounded-full"
                  src="/images/ai15.jpg"
                  alt="profile"
                />
              </span>
              <p className="2xl:text-[8rem]  2xl:leading-[0.95] sm:text-[4.5rem] sm-only:text-[3rem]">
                Let&apos;s work
              </p>
            </div>
            <p className="mdd:text-[8rem] 2xl:leading-[0.95] mdd-only:text-[5rem] sm:text-[2.5rem] font-extrabold">
              together
            </p>
            <div className="mt-[3rem] flex gap-[30px] dee-only:flex-col text-[1rem] dee-only:w-full">
              <div className="flex items-center border-[#1F1F1F] rounded-2xl">
                <div className="border-2 text-center border-[#1F1F1F] rounded-full dee-only:w-full">
                  <p className="p-6 px-8 rounded-full">mustaff2277@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center ">
                <div className="border-2 text-center border-[#1F1F1F] rounded-full dee-only:w-full">
                  <p className="p-6 px-8 text-nowrap">+233 24 619 1203</p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="footer-lottie"
            className="w-[30%] border-2 md-only:hidden flex justify-center items-center"
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-[20px]">
        <div>
          <p className="text-[#999999]">Version</p>
          <p>2025 © Edition</p>
        </div>
        <div>
          <p>Socials</p>
          <div className="flex mt-3 gap-7">
            <a href="https://www.linkedin.com/in/mustapha-osman-515308168/">
              <img
                className="w-[50px] "
                src="/linkedin.png"
                alt="linkedin logo"
              />
            </a>
            <a href="https://x.com/Mustaff227">
              <img className="w-[50px] " src="/x2.svg" alt="x logo" />
            </a>
            <a href="#">
              <img className="w-[50px] " src="/insta.svg" alt="insta logo" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
