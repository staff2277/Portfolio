import Footer from "../../components/Footer";

const About = () => {
  return (
    <div className="bg-[#070707] ">
      <div className="h-[100vh] flex justify-center items-center relative overflow-hidden  z-20">
        <div className="text-[#e7dfc6] z-20  text-[5rem] font-extrabold">
          Supporting brands to flourish in the digital age.
        </div>
        <div className="absolute object-cover inset-0">
          <img src="/more2.jpg" alt="" />
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default About;
