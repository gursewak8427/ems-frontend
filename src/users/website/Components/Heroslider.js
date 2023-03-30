import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Sl_1 from "../images/sl_1.jpg";
import Sl_2 from "../images/sl_2.png";
import Sl_3 from "../images/sl_3.png";
import Sl_4 from "../images/sl_4.png";
import Sl_5 from "../images/sl_5.jpg";

export default function Heroslider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider className="mt-14" {...settings}>
      <div className="inner-content">
        <img src={"https://th.bing.com/th?id=OSK.9ae3c3fcb24a3ac637c0037fe68777a6&w=188&h=132&c=7&o=6&pid=SANGAM"} />
        <p className="text-center w-full text-2xl">PHP</p>
      </div>

      <div className="inner-content">
        <img src={'https://th.bing.com/th?id=OSK.ba13f442edde2a689da52b7784617c05&w=188&h=132&c=7&o=6&pid=SANGAM'} />
        <p className="text-center w-full text-2xl">REACT JS</p>
      </div>

      <div className="inner-content">
        <img src={"https://th.bing.com/th?id=OSK.6369cc7cb99b3a1eca38327120177828&w=188&h=132&c=7&o=6&pid=SANGAM"} />
        <p className="text-center w-full text-2xl">NODE JS</p>
      </div>
      <div className="inner-content">
        <img src={"https://pluspng.com/img-png/python-logo-png-big-image-png-2400.png"} />
        <p className="text-center w-full text-2xl">PYTHON</p>
      </div>
      <div className="inner-content">
        <img src={"https://th.bing.com/th?id=OSK.9ae3c3fcb24a3ac637c0037fe68777a6&w=188&h=132&c=7&o=6&pid=SANGAM"} />
        <p className="text-center w-full text-2xl">PHP</p>
      </div>

      <div className="inner-content">
        <img src={'https://th.bing.com/th?id=OSK.ba13f442edde2a689da52b7784617c05&w=188&h=132&c=7&o=6&pid=SANGAM'} />
        <p className="text-center w-full text-2xl">REACT JS</p>
      </div>

      <div className="inner-content">
        <img src={"https://th.bing.com/th?id=OSK.6369cc7cb99b3a1eca38327120177828&w=188&h=132&c=7&o=6&pid=SANGAM"} />
        <p className="text-center w-full text-2xl">NODE JS</p>
      </div>
      <div className="inner-content">
        <img src={"https://pluspng.com/img-png/python-logo-png-big-image-png-2400.png"} />
        <p className="text-center w-full text-2xl">PYTHON</p>
      </div>
    </Slider>
  );
}
