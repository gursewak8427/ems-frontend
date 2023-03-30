import React from "react";
import { useNavigate } from "react-router-dom";

export default function Possibilities() {
  const navigate = useNavigate()
  return (
    <div className="begining-part py-32 relative">
      <div className="container mx-auto">
        <h3 className="text-center  text-white text-5xl relative leading-tight">
          New Beginnings! Endless Possibilities! provide by
          <br /> EMS
        </h3>
        <p className="text-center text-white relative text-lg mt-10">
          What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space.
        </p>
        <button class="text-white mt-12 py-4 px-8 mx-auto block  font-bold py-2 px-4 rounded-full relative" onClick={()=>navigate("/d/")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
