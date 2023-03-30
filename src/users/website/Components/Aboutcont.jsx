import React from "react";
import About2 from "../images/about2.jpg";

export default function Aboutcont() {
  return (
    <div>
      <div className="container mx-auto py-20 px-4 lg:px-0">
        <div className="lg:flex gap-6">
          <div className="lg:w-1/2">
            <img className="w-full" src={About2} />
          </div>
          <div className="lg:w-1/2 mt-4 lg:mt-0">
            <h2 className="text-5xl mb-8">About</h2>
            <p className="lg:text-base mb-6 leading-6">
              What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.
            </p>
            <p className="lg:text-base mb-6 leading-6">
              What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
