import React, { useEffect } from "react";
import Viewinfo from "../Components/Viewinfo";
import Viewcontent from "../Components/viewcontent";
import WebsiteHome from "../Screens/WebsiteHome";

export default function Wviewdetails() {
  useEffect(() => {
    document.getElementById("header_menu").classList.remove("header-part");
    document.getElementById("header_menu").classList.add("static-header");
  }, []);
  return (
    <div>
      <WebsiteHome>
        <div id="view-details">
          <div className="view-banr py-32">
            <h1 className="text-center text-4xl text-white">NMIT</h1>
          </div>
          <Viewinfo />
          <Viewcontent />
        </div>
      </WebsiteHome>
    </div>
  );
}
