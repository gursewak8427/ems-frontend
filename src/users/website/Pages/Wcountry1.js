import React, { useEffect } from "react";
import WebsiteHome from "../Screens/WebsiteHome";
import "./Wcountry1.css";
import Countryinfo from "../Components/Countryinfo";

export default function Wcountry1() {
  useEffect(() => {
    document.getElementById("header_menu").classList.remove("header-part");
    document.getElementById("header_menu").classList.add("static-header");
  }, []);
  return (
    <WebsiteHome>
      <div id="countryPage">
        <div className="country-banr py-32">
          <div class="container mx-auto">
            <h1 className="text-center text-white text-6xl">NEW ZEALAND</h1>
          </div>
        </div>
        <Countryinfo />
      </div>
    </WebsiteHome>
  );
}
