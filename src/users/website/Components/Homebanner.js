import React from "react";
import Heroslider from "./Heroslider";
import Plane from "../images/plane.png";

export default function Homebanner() {
  return (
    <div>
      <div className="home-hero  px-4 lg:px-0 py-24  lg:pt-48 relative">
        <div className="container mx-auto">
          <h1 className="text-center text-white text-2xl lg:text-5xl  relative">
            "Time" is one important thing in this world which cannot be spent or earned by an individual's choice. It can only be

            <br />
            saved and that's what <span>EMS do for you.</span>
          </h1>
          <Heroslider />
          <ul className="lg:flex items-center justify-center relative lg:gap-44 mt-24">
            <li className="text-white text-lg font-light tracking-widest text-center">
              <span className="numb-text">100 +</span> Total Employees
            </li>
            <li className="text-white  text-lg font-light tracking-widest text-center my-3 lg:my-0">
              Salaries Upto INR 120000 LPA
            </li>
            <li className="text-white  text-lg font-light tracking-widest text-center">
              <span className="numb-text">2206 +</span> Total Projects
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
