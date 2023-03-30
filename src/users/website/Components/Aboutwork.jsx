import React from "react";
import How1 from "../../website/images/how1.jpg";
import How2 from "../../website/images/how2.jpg";
import How3 from "../../website/images/how3.jpg";
import How4 from "../../website/images/how4.jpg";

export default function Aboutwork() {
  return (
    <div>
      <div className="py-20 px-4 lg:px-0 how-work">
        <div className="container mx-auto">
          <h4 className="text-center font-bold text-3xl mb-16">
            How It Works?
          </h4>
          <div className="lg:flex justify-center gap-4">
            <div>
              <img className="mx-auto block" src={How1} />
              <p className="text-center text-lg  mb-10 lg:mb-0 mt-4">
                Facility
              </p>
            </div>

            <div>
              <img className="mx-auto block" src={How2} />
              <p className="text-center text-lg  mb-10 lg:mb-0 mt-4">
                Learning
              </p>
            </div>

            <div>
              <img className="mx-auto block" src={How3} />
              <p className="text-center text-lg mb-10 lg:mb-0 mt-4">Courses</p>
            </div>

            <div>
              <img className="mx-auto block" src={How4} />
              <p className="text-center text-lg mb-10 lg:mb-0 mt-4">
                Best Students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
