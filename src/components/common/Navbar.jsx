import React, { useState, useEffect } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";

const subLinks = [
  {
    title: "Python",
    link: "/catalog/python",
  },
  {
    title: "Web Dev",
    link: "/catalog/web-development",
  },
];

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  // const [subLinks, setSubLinks] = useState([]);
  // const fetchSublinks = async () => {
  //   try {
  //     const result = await apiConnector("GET", catagories.CATEGORIES_API);
  //     console.log("Printing SubLinks result: ", result);
  //     setSubLinks(result.data.data);
  //   } catch (error) {
  //     console.log("Could not fetch the category list");
  //   }
  // };
  // useEffect(() => {
  //   // fetchSublinks();
  // }, []);

  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img
            src={logo}
            alt="StudyNotion"
            width={160}
            height={32}
            loading="lazy"
          />
        </Link>

        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="flex flex-row items-center gap-1 hover:cursor-pointer group relative">
                    <p>{link.title}</p>
                    <IoIosArrowDown />
                    <div className="invisible absolute left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] translate-x-[-15%] translate-y-[50%]">
                      <div className="absolute left-[21%] top-[0%] h-6 w-8 rotate-45 rounded bg-richblack-5 "></div>
                      {subLinks.length ? (
                        subLinks.map((subLink, index) => (
                          <Link to={`${subLink.link}`} key={index}>
                            <p>{subLink.title}</p>
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login-Signup */}
        <div className="flex gap-x-4 items-center ">
          {user && user?.accountType != "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <TiShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}
          {token == null && (
            <Link to={"/login"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Login
              </button>
            </Link>
          )}
          {token == null && (
            <Link to={"/signup"}>
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
