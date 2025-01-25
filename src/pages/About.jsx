import Footer from "../../components/Footer";
import Passion from "../../components/Passion";
import bgImage from "/bgImage.jpg";
import { motion, useScroll, useTransform } from "framer-motion";

const About = () => {
  const { scrollYProgress } = useScroll();
  const page1Scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const page1rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "3deg"]);

  console.log(scrollYProgress);

  return (
    <motion.div className="bg-black">
      <motion.div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          scale: page1Scale,
          rotate: page1rotate,
        }}
        className="h-[100vh] sticky top-0 -z-10"
      >
        <div className="flex justify-center items-center h-full">
          <div className="text-[#e7dfc6] z-20 text-center  3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
            Supporting brands to flourish in the digital age.
          </div>
        </div>
      </motion.div>
      <div>
        <Passion />
      </div>
      <div className="z-30">
        <Footer />
      </div>
    </motion.div>
  );
};

export default About;
