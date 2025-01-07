import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const greetings = [
  { lang: "English", text: "Hello", subtitle: "-It's Mustapha" },
  { lang: "Spanish", text: "Hola", subtitle: "-Es Mustapha" },
  { lang: "French", text: "Bonjour", subtitle: "-C'est Mustapha" },
  { lang: "Chinese", text: "你好", subtitle: "-是穆斯塔法" },
  { lang: "Japanese", text: "こんにちは", subtitle: "-ムスタファです" },
  { lang: "Hindi", text: "नमस्ते", subtitle: "-यह मुस्तफा है" },
  { lang: "Arabic", text: "مرحبا", subtitle: "-إنه مصطفى" },
  { lang: "Hawaiian", text: "Aloha", subtitle: "-ʻO Mustapha ia" },
];

const HeroText = () => {
  const [currentGreeting, setCurrentGreeting] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 3000); // Change greeting every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const letterVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  const getFontSize = (text) => {
    const longLanguages = ["French", "Japanese", "Arabic"];
    return longLanguages.includes(text.lang)
      ? "se:text-[3rem] see:text-[5rem] seee:text-[7rem] mdd:text-[7rem] mddd:text-[9rem] e:text-[8rem] ee:text-[11rem] lg:text-[18rem]"
      : "se:text-[4rem] see:text-[6rem] seee:text-[8rem] mdd:text-[9rem] mddd:text-[10rem] e:text-[10rem] ee:text-[13rem] lg:text-[25rem]";
  };

  return (
    <div className="mt-[25%] ml-[10%] ee-only:ml-0 dee-only:mt-[25%] sm:mt-[3%] mdd:mt-[10%] e:mt-[13%] 2xl:ml-[30%] sm:w-[400px]">
      {/* Animated Greeting */}
      <AnimatePresence mode="wait">
        {greetings.map((greeting, index) =>
          index === currentGreeting ? (
            <motion.p
              key={greeting.text}
              className={`leading-none ${getFontSize(greeting)}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration: 1 } },
                exit: { opacity: 0, transition: { duration: 1 } },
              }}
            >
              {greeting.text.split("").map((char, charIndex) => (
                <motion.span
                  key={`${greeting.text}-${charIndex}`}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, delay: charIndex * 0.1 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>
          ) : null
        )}
      </AnimatePresence>

      {/* Animated Subtitle */}
      <AnimatePresence mode="wait">
        <motion.p
          key={greetings[currentGreeting].subtitle}
          className="text-[1.6rem] leading-none pl-8 se:pl-1 se:text-[1rem] see:text-[1.5rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          {greetings[currentGreeting].subtitle}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default HeroText;
