import Lottie from "lottie-react"; // Static import
import mail from "../animations/mail.json";

const Footer = () => {
  return (
    <div className="px-10 dee-only:px-2 h-screen grid grid-rows-[auto_25%] bg-[#e7dfc6] z-40 ">
      <div className="flex items-end h-full  md-only:justify-center 3xl:px-[10%] max-2xl:px-[5%]">
        <div className="flex justify-between items-center  2xl:px-[5%]">
          <div className=" flex flex-col justify-end md-only:items-center md-only:w-full">
            <div className="flex items-center gap-[20px]">
              <span>
                <img
                  className="w-[130px] rounded-full"
                  src="/images/ai15.jpg"
                  alt="profile"
                />
              </span>
              <p className="2xl:text-[8rem] 2xl:leading-[0.95] sm:text-[4.5rem] sm-only:text-[3rem]">
                Let&apos;s work
              </p>
            </div>
            <p className="mdd:text-[8rem] 2xl:leading-[0.95] mdd-only:text-[5rem]  sm:text-[2.5rem]  font-extrabold">
              together
            </p>
            <div className="mt-[3rem]  flex gap-[30px] dee-only:flex-col  text-[1rem] dee-only:w-full">
              <div className="flex items-center border-[#1F1F1F]  rounded-2xl">
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
          <div className="w-[30%] md-only:hidden  flex justify-center items-center ">
            <Lottie animationData={mail} className="" loop={true} />
          </div>
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
            <a href="#">
              <img
                className="w-[50px] "
                src="/linkedin.png"
                alt="linkedin logo"
              />
            </a>
            <a href="#">
              <img className="w-[50px] " src="/x2.svg" alt="x logo" />
            </a>
            <a href="#">
              <img className="w-[50px] " src="/insta.svg" alt="insta logo" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
