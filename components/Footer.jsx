import Lottie from "lottie-react"; // Static import
import mail from "../animations/mail.json";

const Footer = () => {
  return (
    <div className="px-10 dee-only:px-2 h-screen grid grid-rows-[auto_30%] bg-[#e7dfc6]  ">
      <div className="flex justify-between items-end  px-[10%]">
        <div className="text-[8rem] leading-[0.95] flex flex-col justify-end ">
          <div className="flex items-center gap-[20px]">
            <span>
              <img
                className="w-[130px] rounded-full"
                src="/images/ai15.jpg"
                alt="profile"
              />
            </span>
            <p>Let&apos;s work</p>
          </div>
          <p>together</p>
          <div className="mt-[3rem]  flex gap-[30px]  text-[1rem] ">
            <div className="flex items-center border-[#1F1F1F]  rounded-2xl">
              <p className="border-2 border-[#1F1F1F] p-6 px-8 rounded-full">
                mustaff2277@gmail.com
              </p>
            </div>
            <div className="flex items-center ">
              <p className="border-2 border-[#1F1F1F] p-6 px-8 rounded-full">
                +233 24 619 1203
              </p>
            </div>
          </div>
        </div>
        <Lottie animationData={mail} className="w-[500px]" loop={true} />
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
