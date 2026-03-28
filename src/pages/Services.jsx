import { motion } from "framer-motion";
import PageTransition from "../../components/PageTransition";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/Footer";

const servicesList = [
  {
    id: "01",
    title: "Front-End Development",
    description:
      "Crafting high-performance, accessible, and interactive user interfaces using modern frameworks like React and Next.js. Precision and pixel-perfect execution are guaranteed.",
  },
  {
    id: "02",
    title: "Creative Development & WebGL",
    description:
      "Integrating 3D elements, GSAP animations, and immersive WebGL experiences utilizing Three.js and Framer Motion to make your brand unforgettable.",
  },
  {
    id: "03",
    title: "UI/UX & Interactive Design",
    description:
      "Designing responsive, intuitive, and cohesive digital systems. Every interaction is mapped out to provide a seamless user journey from landing page to conversion.",
  },
];

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { type: "tween", ease: "easeOut", duration: 0.8 } },
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Services | Mustapha Osman</title>
        <meta name="description" content="Services and expertise offered by Mustapha Osman." />
      </Helmet>

      <div className="min-h-screen bg-black text-[#e7dfc6] pt-32 px-10 dee-only:px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 space-y-6"
        >
          <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-extrabold uppercase leading-none tracking-tight">
            My Expertise
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
            I bridge the gap between design and engineering, combining aesthetic sensibilities with robust technical architecture.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12 max-w-5xl"
        >
          {servicesList.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group border-t border-[#e7dfc6]/20 pt-8 flex flex-col md:flex-row gap-6 md:gap-12 hover:border-[#e7dfc6]/80 transition-colors duration-500"
            >
              <div className="text-3xl md:text-5xl font-light text-gray-500 group-hover:text-[#e7dfc6] transition-colors duration-500 w-24">
                {service.id}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">{service.title}</h3>
                <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <Footer />
    </PageTransition>
  );
};

export default Services;
