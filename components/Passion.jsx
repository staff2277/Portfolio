import { motion } from "framer-motion";

const Passion = () => {
  return (
    <div className="h-[100vh] overflow-hidden">
      <div className="grid grid-cols-[50%_auto] items-center justify-between text-[#e7dfc6]">
        <div className=" ml-[2rem]">
          <div className="">
            <h1 className="3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
              Design
            </h1>
            <motion.p
              className="w-[70%]   text-[#919191]"
              initial={{
                scale: 0.7,
                opacity: 0.7,
                x: "200px",
              }}
              whileInView={{
                scale: 1,
                opacity: 1,
                x: "0px",
              }}
            >
              I might not be the designer obsessing over pixels in Illustrator,
              but I design with purpose. You’ll usually find me buried in
              stylesheets, refining font sizes, and experimenting with layouts.
              My passion lies in delivering smooth, intuitive user
              experiences—always with a touch of style. (~_^)
            </motion.p>
          </div>
          <div className="mt-[5rem]">
            <h1 className="3xl:text-[5rem] 2xl:text-[4.5rem] xl:text-[4rem] mddd:text-[3rem] de:text-[2.5rem] de-only:text-[2rem] font-extrabold">
              Engineering
            </h1>
            <motion.p
              className="w-[70%] text-[#919191]"
              initial={{
                scale: 0.7,
                opacity: 0.7,
                x: "200px",
              }}
              whileInView={{
                scale: 1,
                opacity: 1,
                x: "0px",
              }}
            >
              When creating applications, I bring the right tools to the table
              but can work just as effectively without them. My focus is always
              on delivering fast, resilient solutions that are built to scale —
              performance and scalability are always top of mind.
            </motion.p>
          </div>
        </div>
        <div className="">
          <img className="sticky top-0" src="/images/ai15.jpg" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default Passion;
