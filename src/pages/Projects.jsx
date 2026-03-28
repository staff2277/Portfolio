import { motion } from "framer-motion";
import PageTransition from "../../components/PageTransition";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/Footer";
import { useState } from "react";

const projects = [
  {
    title: "GEOPLANARCS",
    description: "A comprehensive geographic planning platform with advanced mapping capabilities.",
    href: "https://geoplanarcs.netlify.app/",
    image: "/geoplanarcs.png",
    tags: ["React", "Leaflet", "Tailwind CSS"],
  },
  {
    title: "STREAMVIBE",
    description: "A modern streaming platform interface focused on user experience and media discovery.",
    href: "https://streamvibe-backend-q0e9.onrender.com",
    image: "/streamVibe.png",
    tags: ["Next.js", "Node.js", "MongoDB"],
  },
  // Placeholders or future projects could go here
];

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Projects | Mustapha Osman</title>
        <meta name="description" content="View the portfolio projects by Mustapha Osman." />
      </Helmet>
      
      <div className="min-h-screen bg-black text-[#e7dfc6] pt-32 px-10 dee-only:px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="3xl:text-[6rem] 2xl:text-[5rem] xl:text-[4.5rem] md:text-[4rem] text-[3rem] font-extrabold uppercase leading-none">
            Selected Work
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-2xl">
            A diverse showcase of digital experiences crafted with precision, motion, and modern technologies.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32"
        >
          {projects.map((project, index) => (
            <motion.a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group block"
            >
              <div className="overflow-hidden rounded-xl aspect-[4/3] relative bg-[#1a1a1a]">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  animate={{
                    scale: hoveredIndex === index ? 1.05 : 1,
                  }}
                />
                {/* Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="bg-[#e7dfc6] text-black px-6 py-3 rounded-full font-bold">
                    View Project
                  </span>
                </motion.div>
              </div>

              <div className="mt-6">
                <h2 className="text-3xl font-bold mb-2 group-hover:text-white transition-colors">{project.title}</h2>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {project.tags.map((tag, tIndex) => (
                    <span key={tIndex} className="text-sm px-3 py-1 border border-[#e7dfc6]/30 rounded-full text-[#e7dfc6]/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default Projects;
