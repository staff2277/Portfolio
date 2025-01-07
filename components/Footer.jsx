const Footer = () => {
  return (
    <div className="h-screen grid grid-rows-3 bg-[#e7dfc6]  ">
      <div className="text-[8rem] leading-[0.95] flex flex-col justify-center items-center">
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
      </div>
      <div className="mt-[5rem] flex gap-[30px] border-2 justify-center py-[5rem]">
        <div className="border-2 border-[#1F1F1F] p-5 rounded-full">
          mustaff2277@gmail.com
        </div>
        <div className="border-2 border-[#1F1F1F] p-5 rounded-full">
          +233 24 619 1203
        </div>
      </div>
      <div>
        <div>
          <p>Version</p>
          <p>2022 © Edition</p>
        </div>
        <div>
          <p>Socials</p>
          <div>
            <a href="#">
              <img src="/images/" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
