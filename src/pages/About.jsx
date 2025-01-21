import Footer from "../../components/Footer";

const About = () => {
  return (
    <div className="bg-[#070707] ">
      <div
        style={{
          backgroundImage: "url(/more2.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="h-[100vh] flex justify-center items-center relative overflow-hidden  z-20"
      >
        <div className="text-[#e7dfc6] z-20 text-center  3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
          Supporting brands to flourish in the digital age.
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default About;
