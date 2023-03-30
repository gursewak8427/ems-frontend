import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Lg1 from "../images/lg1.jpg";
import Lg2 from "../images/lg2.jpg";
import Lg3 from "../images/lg3.png";
import Lg4 from "../images/lg4.png";
import Lg5 from "../images/lg5.jpg";

export default function SimpleSlider() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };
  return (
    <div className="partner container mx-auto py-20">
      <Slider {...settings}>
        <div>
          <img src={Lg1} alt="" />
        </div>
        <div>
          <img src={Lg2} alt="" />
        </div>
        <div>
          <img src={Lg3} alt="" />
        </div>
        <div>
          <img src={Lg4} alt="" />
        </div>
        <div>
          <img src={Lg5} alt="" />
        </div>
        <div>
          <img src={Lg1} alt="" />
        </div>
        <div>
          <img src={Lg2} alt="" />
        </div>
        <div>
          <img src={Lg3} alt="" />
        </div>
        <div>
          <img src={Lg4} alt="" />
        </div>
        <div>
          <img src={Lg5} alt="" />
        </div>
      </Slider>
    </div>
  );
}
