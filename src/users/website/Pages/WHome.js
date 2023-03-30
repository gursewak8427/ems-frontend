import React from "react";

import About from "../Components/About";
import Courses from "../Components/Courses";
import Homebanner from "../Components/Homebanner";
import Media from "../Components/Media";
import Possibilities from "../Components/Possibilities";
import Level from "../Components/level";
import Sliderpart from "../Components/Sliderpart";
import Admission from "../Components/Admission";

import WebsiteHome from "../Screens/WebsiteHome";

export default function WHome() {
  return (
    <WebsiteHome page={"home"}>
      {/* hello */}
      <Homebanner />
      <About />
      <Media />
      {/* <Courses /> */}
      {/* <Admission /> */}
      <Possibilities />
      <Level />
      <Sliderpart />
    </WebsiteHome>
  );
}
