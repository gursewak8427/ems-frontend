import React from "react";
// import Formaccordian from "../../src/Components/Formaccordian";
import Accordian from "./Accordian";

export default function Eligibleform() {
  return (
    <div className="form-part py-20">
      <div className="container mx-auto px-4 lg:px-0">
        {/* <h1 className="border text-center p-2 rounded-lg text-xl font-light">
          Get a list of eligible programs ... in just 60 seconds
        </h1> */}
        <div className="lg:flex gap-4">
          <div className="w-full">
            <Accordian />
          </div>
          <div className="right-cont shadow-xl lg:w-[30%]  rounded-lg p-4 mt-10 lg:mt-0 border-2 border-[#1c3479]">
            <h3 className="text-left text-3xl font-bold border-b pb-4 mb-4 italic tracking-wide">
              Top features
            </h3>
            <p className="mb-4 flex items-center">
              <i className="fa fa-check mr-3" aria-hidden="true"></i> We provide
              you the best platform to study
              <br /> abroad and make your future bright.
            </p>

            <p className="mb-4 flex items-center">
              <i className="fa fa-check mr-3" aria-hidden="true"></i>We offer
              exact information for students
              <br /> interested in school/college and courses.
            </p>

            <p className="mb-4 flex items-center">
              <i className="fa fa-check mr-3" aria-hidden="true"></i> We help
              you classify the best universities
              <br /> that match your profile.
            </p>

            <p className="mb-4 flex items-center">
              <i className="fa fa-check mr-3" aria-hidden="true"></i>Our team of
              experts connects with
              <br /> students universal, supporting them with our platform and
              services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
