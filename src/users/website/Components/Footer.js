import React from "react";
import { Link } from "react-router-dom";
import Ft_logo from "../images/ft_logo.png";
import Uni_1 from "../images/uni_1.jpg";
import Uni_2 from "../images/uni_2.gif";
import Uni_3 from "../images/uni_3.png";

export default function Footer() {
  return (
    <div>
      {/* <div className="footer-content bg-black py-20 px-4 lg:px-0">
        <div class="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-4">
            <div>
              <img src={Ft_logo} />
              <p className="text-white text-sm text-left my-5">
                Learn Global means learn anywhere in
                <br /> the world and we provide you the best
                <br /> platform to study abroad and make your
                <br /> future bright.
              </p>
              <a
                className="text-white mb-5 block text-xl"
                href="mailto:info@learnglobal.com"
              >
                <i className="fa fa-envelope mr-2" aria-hidden="true"></i>
                info@learnglobal.com
              </a>
              <ul className="social-list flex gap-4 items-center">
                <li>
                  <a href="#">
                    <i
                      className="text-white fa fa-linkedin"
                      aria-hidden="true"
                    ></i>
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i
                      className="text-white fa fa-pinterest-p"
                      aria-hidden="true"
                    ></i>
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i
                      className="text-white fa fa-youtube-play"
                      aria-hidden="true"
                    ></i>
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i
                      className="text-white fa fa-facebook"
                      aria-hidden="true"
                    ></i>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl  mb-5 pb-5  border-b inline-block">
                Quick Links
              </h2>
              <ul>
                <li className="mb-3">
                  <Link className="text-white" to={"/eligible"}>
                    <i
                      className="text-white fa fa-caret-right mr-3"
                      aria-hidden="true"
                    ></i>
                    Apply Now
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-white" to={"/discover"}>
                    <i
                      className="text-white fa fa-caret-right mr-3"
                      aria-hidden="true"
                    ></i>
                    Discover School
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-white" to={"/d/"}>
                    <i
                      className="text-white fa fa-caret-right mr-3"
                      aria-hidden="true"
                    ></i>
                    Agent/Signup
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-white" to={"/d/"}>
                    <i
                      className="text-white fa fa-caret-right mr-3"
                      aria-hidden="true"
                    ></i>
                    Login/Signup
                  </Link>
                </li>
                <li className="mb-3">
                  <Link className="text-white" to={"/about"}>
                    <i
                      className="text-white fa fa-caret-right mr-3"
                      aria-hidden="true"
                    ></i>
                    About
                  </Link>
                </li>
                <li>
                  <Link className="text-white" to={"/contact"}>
                    <i
                      className="text-white fa fa-caret-right mr-3"
                      aria-hidden="true"
                    ></i>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl mb-5 pb-5  border-b inline-block">
                Top Universities
              </h2>
              <ul className="">
                <li className="mb-5">
                  <Link to="/viewdetails" className="flex items-center">
                    <img className="rounded-full w-14 mr-3" src={Uni_1} />
                    <p className="mb-0 text-sm text-white">
                      University of
                      <br /> Sunshine Coast
                    </p>
                  </Link>
                </li>
                <li className="mb-5">
                  <Link to="/viewdetails" className="flex items-center">
                    <img className="rounded-full w-14 mr-3" src={Uni_2} />
                    <p className="mb-0 text-sm text-white">
                      University
                      <br /> of Calgary
                    </p>
                  </Link>
                </li>

                <li>
                  <Link to="/viewdetails" className="flex items-center">
                    <img className="rounded-full w-14 mr-3" src={Uni_3} />
                    <p className="mb-0 text-sm text-white">
                      Southern Cross
                      <br /> University
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}

      <div className="lower-content py-5 bg-gray-700">
        <div class="container mx-auto">
          <div className="grid lg:grid-cols-2">
            <div>
              <p className="text-white text-sm mb-0 text-center lg:text-left mb-5 lg:mb-0">
                Copyright © 2023 EMS All Right Reserved
              </p>
            </div>

            <ul className="flex gap-4 lg:gap-8 justify-center lg:justify-end">
              <li className="text-center">
                <a className="text-white text-sm text-center" href="#">
                  FAQ
                </a>
              </li>

              <li className="text-center">
                <a className="text-white text-sm" href="#">
                  Privacy Policy
                </a>
              </li>

              <li className="text-center">
                <a className="text-white text-sm" href="#">
                  Terms & Conditions
                </a>
              </li>

              <li className="text-center">
                <a href="#" className="text-white text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
