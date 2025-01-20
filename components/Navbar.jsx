import { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react"; // Static import
import dot from "../animations/dot4.json";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="flex px-10 dee-only:px-2 justify-between pt-3 items-center h-[10%]">
        <Link to="/">
          <div className="border-2">
            <p className="font-bold text-[1.15rem] sm-only:text-[.9rem]">
              MUSTAPHA OSMAN
            </p>
            <p className="text-[.9rem] text-center sm-only:text-[.75rem]">
              Front-End Developer
            </p>
          </div>
        </Link>

        <div className="sm-only:block mdd:hidden">
          <div
            onClick={toggleMenu}
            className="cursor-pointer space-y-2 flex flex-col items-center justify-center"
          >
            <div
              className={`w-8 h-1 bg-black transition-all duration-300 ease-in-out ${
                isOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-8 h-1 bg-black transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-8 h-1 bg-black transition-all duration-300 ease-in-out ${
                isOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </div>
        </div>

        <ul
          className={`flex gap-14 items-center mdd-only:hidden ${
            isOpen
              ? "flex-col absolute top-20 left-0 bg-white w-full p-4"
              : "flex-row"
          }`}
        >
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li className="pl-5 pr-9 py-0 dee-only:px-4 dee-only:pl-2 flex items-center bg-[#f0ede4] rounded-full ">
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
      </nav>
    </>
  );
};

export default Navbar;
