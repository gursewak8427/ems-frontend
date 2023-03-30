import React from "react";
import Med from "../images/med.png";
import Mediaslide from "./Mediaslide";

export default function Media() {
  return (
    <div>
      <div className="about-part   lg:mt-0 px-4 lg:px-0  lg:pb-10 mt-10 lg:mt-0">
        <div className="container mx-auto">
          <div className="lg:grid lg:grid-cols-2 items-center">
            <div className="lg:pr-10">
              <h2 className="text-right text-6xl pb-5  relative">Media</h2>
              <p className="text-black tracking-widest text-right">
                What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.
              </p>
            </div>
            <div>
              <div className="img-part">
                <Mediaslide />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
