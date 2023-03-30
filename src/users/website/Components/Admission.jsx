import React from "react";
import Adcontent from "../Components/Adcontent";

export default function Admission() {
  return (
    <div>
      <div className="admission py-20 mt-20">
        <div className="container mx-auto">
          <div className="lg:flex align-items-center">
            <div className="">
              <h4 className="text-4xl mb-24 text-center  relative">
                Admission Process
              </h4>
              <Adcontent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
