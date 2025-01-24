import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Lottie from "lottie-react";
import dot from "../animations/dot4.json";
import clsx from "clsx";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  let location = useLocation();

  const MotionLink = motion(Link);

  return (
    <>
      <motion.nav
        initial={{
          y: "-200px",
        }}
        animate={{
          y: "0px",
        }}
        transition={{
          type: "spring",
          bounce: 0.8,
          duration: 2,
        }}
        className={clsx({
          "flex px-10 dee-only:px-2 z-30 justify-between pt-3 items-center absolute  top-0 left-0 right-0 h-[10%]": true,
          "bg-transparent   text-[#e7dfc6] ": location.pathname == "/about",
        })}
      >
        <Link to="/">
          <motion.div
            initial={{
              marginLeft: 0,
              fontSize: "1.8rem",
              color: "black",
              rotate: "0deg",
              x: "100px",
            }}
            animate={{
              x: "0px",
            }}
            whileHover={{
              marginLeft: "1.5rem",
              fontSize: "3rem",
              color: "white",
              rotate: "-2deg",
            }}
            transition={{
              type: "spring",
              bounce: 0.8,
            }}
            className=""
          >
            <p className="font-bold text-[1.15rem] sm-only:text-[.9rem]">
              MUSTAPHA OSMAN
            </p>
            <p className="text-[.9rem] text-center sm-only:text-[.75rem]">
              Front-End Developer
            </p>
          </motion.div>
        </Link>

        <div
          className={clsx({
            "sm-only:block mdd:hidden": true,
          })}
        >
          <div
            onClick={toggleMenu}
            className="cursor-pointer space-y-2 flex flex-col items-center justify-center"
          >
            <div
              className={clsx(
                "w-8 h-1 transition-all duration-300 ease-in-out",
                { "transform rotate-45 translate-y-2": isOpen },
                { "bg-[#e7dfc6]": location.pathname == "/about" },
                { "bg-black": location.pathname == "/" },
                { "bg-black": location.pathname == "/contact" }
              )}
            ></div>
            <div
              className={clsx(
                "w-8 h-1 transition-all duration-300 ease-in-out",
                { "opacity-0": isOpen },
                { "bg-[#e7dfc6]": location.pathname == "/about" },
                { "bg-black": location.pathname == "/" },
                { "bg-black": location.pathname == "/contact" }
              )}
            ></div>
            <div
              className={clsx(
                "w-8 h-1  transition-all duration-300 ease-in-out",
                { "transform -rotate-45 -translate-y-2": isOpen },
                { "bg-[#e7dfc6]": location.pathname == "/about" },
                { "bg-black": location.pathname == "/" },
                { "bg-black": location.pathname == "/contact" }
              )}
            ></div>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{
              x: "400px",
            }}
            animate={{
              x: "0px",
            }}
            className="h-[50vh] mt-[5.5rem] text-[#e7dfc6] rounded-lg w-[50%] absolute top-0 right-0 bg-black"
          >
            <div className="flex flex-col text-[1.8rem]   *:pt-[2rem] ml-[1rem] gap-5">
              <MotionLink
                initial={{
                  marginLeft: 0,
                  fontSize: "1.8rem",
                  color: "#e7dfc6",
                  rotate: "0deg",
                  x: "100px",
                }}
                animate={{
                  x: "0px",
                }}
                whileHover={{
                  marginLeft: "1.5rem",
                  fontSize: "3rem",
                  color: "white",
                  rotate: "-2deg",
                }}
                transition={{
                  type: "spring",
                  bounce: 0.8,
                }}
                className="w-fit "
                to="/"
              >
                Home
              </MotionLink>
              <MotionLink
                initial={{
                  marginLeft: 0,
                  fontSize: "1.8rem",
                  color: "#e7dfc6",
                  rotate: "0deg",
                  x: "100px",
                }}
                animate={{
                  x: "0px",
                }}
                whileHover={{
                  marginLeft: "1.5rem",
                  fontSize: "3rem",
                  color: "white",
                  rotate: "-2deg",
                }}
                transition={{
                  type: "spring",
                  bounce: 0.8,
                }}
                className="w-fit"
                to="/about"
              >
                About
              </MotionLink>
              <MotionLink
                initial={{
                  marginLeft: 0,
                  fontSize: "1.8rem",
                  color: "#e7dfc6",
                  rotate: "0deg",
                  x: "100px",
                }}
                animate={{
                  x: "0px",
                }}
                whileHover={{
                  marginLeft: "1.5rem",
                  fontSize: "3rem",
                  color: "white",
                  rotate: "-2deg",
                }}
                transition={{
                  type: "spring",
                  bounce: 0.8,
                }}
                className="w-fit"
                to="/contact"
              >
                Contact
              </MotionLink>
            </div>
          </motion.div>
        )}

        <ul
          className={clsx("flex gap-14 items-center", {
            "mdd-only:hidden": true,
          })}
        >
          <li>
            <MotionLink
              initial={{
                marginLeft: 0,
                fontSize: "1rem",
                color: "black",
                rotate: "0deg",
                x: "100px",
              }}
              animate={{
                x: "0px",
              }}
              whileHover={{
                marginLeft: "1rem",
                fontSize: "1.3rem",
                color: "white",
                rotate: "-3deg",
              }}
              transition={{
                type: "spring",
              }}
              to="/about"
            >
              About
            </MotionLink>
          </li>
          <li>
            <MotionLink
              initial={{
                marginLeft: 0,
                fontSize: "1rem",
                color: "black",
                rotate: "0deg",
                x: "100px",
              }}
              animate={{
                x: "0px",
              }}
              whileHover={{
                marginLeft: "1rem",
                fontSize: "1.3rem",
                color: "white",
                rotate: "-3deg",
              }}
              transition={{
                type: "spring",
                bounce: 0.8,
              }}
              to="/contact"
            >
              Contact
            </MotionLink>
          </li>
          <li
            className={clsx(
              "pl-5 pr-9 py-0 dee-only:px-4 dee-only:pl-2 flex items-center rounded-full",
              {
                "text-black bg-[#e7dfc6]": location.pathname === "/about",
                "bg-[#f0ede4]": location.pathname === "/",
                "bg-[#f0ede3]": location.pathname === "/contact",
              }
            )}
          >
            <Lottie
              animationData={dot}
              loop={true}
              className="w-14 dee-only:w-10 sm-only:w-12"
            />
            <a href="#" className="dee-only:text-[.8rem]">
              Available For Work
            </a>
          </li>
        </ul>
      </motion.nav>
    </>
  );
};

export default Navbar;
