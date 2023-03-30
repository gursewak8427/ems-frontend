import React from "react";
import Aboutcont from "../Components/Aboutcont";
import Abouthero from "../Components/Abouthero";
import Aboutservice from "../Components/Aboutservice";
import Aboutwork from "../Components/Aboutwork";
import WebsiteHome from "../Screens/WebsiteHome";

export default function Wabout() {
  return (
    <div>
      <WebsiteHome page={"about"}>
        <Abouthero />
        <Aboutcont />
        <Aboutservice />
        <Aboutwork />
      </WebsiteHome>
    </div>
  );
}
