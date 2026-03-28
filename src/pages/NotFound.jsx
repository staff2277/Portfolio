import { motion } from "framer-motion";
import PageTransition from "../../components/PageTransition";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>404 | Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="h-screen w-full bg-black text-[#e7dfc6] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background typographic noise */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 flexItems-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        >
          <span className="text-[40vw] font-black leading-none break-words text-center w-full">
            404
          </span>
        </motion.div>

        <div className="z-10 text-center space-y-8 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold lowercase tracking-tighter"
          >
            Lost in the void.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-md"
          >
            The page you're looking for doesn't exist, has been moved, or is currently under construction.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/">
              <button className="px-8 py-4 bg-[#e7dfc6] text-black rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300">
                Return to Surface
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
