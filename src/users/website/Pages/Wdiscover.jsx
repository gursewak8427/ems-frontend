import React from "react";
import WebsiteHome from "../Screens/WebsiteHome";
import School from "../Components/School";
import Rightsideform from "../Components/Rightsideform";

export default function Wdiscover() {
  return (
    <div>
      <WebsiteHome page={"discover"}>
        <div className="container mx-auto">
          <div className="lg:flex discover-cont py-20 gap-4 px-4 lg:px-0">
            <div className="lg:w-2/3 coverleft">
              <div className="searchbar-top">
                <h3 class="mainheading text-left text-xl font-light border border-current rounded p-2">
                  Search Your Favorite School, University with Country
                </h3>
                <div className="flex items-center mt-5 dc-search">
                  <input
                    type="text"
                    className="p-2"
                    placeholder="Find School, University or Country"
                  />
                  <button className="bg-black text-white p-2">Search</button>
                </div>
              </div>

              <School />
            </div>

            <div className="lg:w-1/3">
              <Rightsideform />
            </div>
          </div>
        </div>
      </WebsiteHome>
    </div>
  );
}
