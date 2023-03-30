import React from "react";
import Faq from "../Components/Faq";
import WebsiteHome from "../Screens/WebsiteHome";

export default function Wfaq() {
  return (
    <div>
      <WebsiteHome page={"faq"}>
        <div className="container mx-auto terms">
          <Faq />
        </div>
      </WebsiteHome>
    </div>
  );
}
