import React, { useState } from "react";
import { navItems } from "../Constant/navItems";
import { CiMenuFries, CiLight, CiSquareRemove } from "react-icons/ci";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  let [open, setOpen] = useState(false);
  return (
    <>
      <div className="shadow-md w-full fixed top-0 left-0">
        <div className="md:flex items-center justify-between bg-[#1B3358] py-2 md:px-10 px-7">
          <div className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-800">
            <span className="text-3xl text-[#F1916D] mr-1">DINE DROP</span>
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute right-8 top-3 cursor-pointer md:hidden items-center"
          >
            {open ? (
              <CiSquareRemove className="text-white" />
            ) : (
              <CiMenuFries className="text-white" />
            )}
          </div>
          <ul
            className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-[#1B3358] md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
              open ? "top-10 " : "top-[-490px]"
            }`}
          >
            {navItems.map((nav) => (
              <li className="md:ml-8  md:my-0 my-7" key={nav.name}>
                <Link
                  className="no-underline cursor-pointer text-[#FFFFFF] hover:text-red-400 duration-300 text-current"
                  to={`/${nav.name.toLowerCase()}`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
            <div className="md:flex md:items-center md:gap-4 md:ms-4 ">
              <CiLight className="text-3xl cursor-pointer text-white" />
              <button className="bg-indigo-600 hover:bg-indigo-700 duration-300 px-3 py-2 rounded text-white">
                Sign up
              </button>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
