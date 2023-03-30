import React from "react";
import Contact1 from "../images/contact__1.jpg";
import Rightsideform from "./Rightsideform";

export default function Contact_text() {
  return (
    <div className="container mx-auto py-20 px-4 lg:px-0" style={{minHeight: "100vh"}}>
      <div className="lg:flex gap-4">
        <div className="lg:w-1/2 relative">
          <img src={Contact1} />
          <div className="bottm-headcont p-4">
            <h5 className="text-center font-bold text-white text-2xl">
              Sometimes "Later" becomes " Never"
            </h5>
            <p className="text-center text-white">
              An investment in knowledge pays the best interest.
            </p>
          </div>
        </div>

        <div className="lg:w-1/2">
          <Rightsideform />
        </div>
      </div>
    </div>
  );
}
