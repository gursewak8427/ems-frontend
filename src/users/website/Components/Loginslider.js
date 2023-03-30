import React from "react";
import Slider from "react-slick";
import Slog from "../images/slog.png";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <img src={Slog} />
      </div>
      <div>
        <img src={Slog} />
      </div>
      <div>
        <img src={Slog} />
      </div>
      <div>
        <img src={Slog} />
      </div>
      <div>
        <img src={Slog} />
      </div>
      <div>
        <img src={Slog} />
      </div>
    </Slider>
  );
}
