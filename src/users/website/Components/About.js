import React from "react";
import H_about from "../images/h_about.jpg";
import Rect from "../images/rect.png";
export default function About() {
  return (
    <div>
      <div className="about-part abt-upr relative mt-10 lg:mt-0  px-4 lg:px-0">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2  items-center">
            <div>
              <div className="img-part relative">
                <img className="w-full main-up-img" src={H_about} alt="about" />
                <img className="bm-rect absolute" src={Rect} alt="" />
              </div>
            </div>
            <div className="lg:px-10">
              <h2 className="text-leftfont-bold text-6xl pb-5 mt-10 relative">
                <span>About</span> Us
              </h2>
              <p className="text-black tracking-widest leading-relaxed  lg:pr-20">
                What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.

              </p>
              <a
                href="/about"
                class="hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full mt-8 lg:mt-14 ml-auto flex items-center"
              >
                Learn More{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
