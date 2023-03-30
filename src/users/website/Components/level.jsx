import React from "react";
import Lv1 from "../images/lv1.png";
import Lv2 from "../images/lv2.png";
import Lv3 from "../images/lv3.png";

export default function level() {
  return (
    <div className="levels py-20 px-4 lg:px-0">
      <div className="container mx-auto">
        <h4 className="relative text-center text-6xl relative">
          <span>Apply For</span> The Following Platforms
        </h4>
        <div className="lg:flex inner-levels gap-10">
          <div className="p-4 shadow-xl">
            <img className="mx-auto block" src={"https://th.bing.com/th/id/OIP.9eYvZ8riZH25mNX0-sbybwHaH4?pid=ImgDet&rs=1"} alt="" />
            <h5 className="text-2xl text-center my-3">Android</h5>
            <p className="text-center text-sm">
              What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.
            </p>
          </div>

          <div className="p-4 shadow-xl">
            <img className="mx-auto block" src={"https://th.bing.com/th/id/OIP.jhB-JpRG7SEsztxh_KUOPwHaHa?pid=ImgDet&rs=1"} alt="" />
            <h5 className="text-2xl text-center my-3">IOS</h5>
            <p className="text-center text-sm">
              What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.

            </p>
          </div>

          <div className="p-4 shadow-xl">
            <img className="mx-auto block" src={"https://bulbandkey.com/blog/wp-content/uploads/2020/07/create-a-website.png"} alt="" />
            <h5 className="text-2xl text-center my-3">WEBSITE</h5>
            <p className="text-center text-sm">
              What is Lorem Ipsum? Simply put, loremipsum is dummy text that occupies the space where the real content should be. If you are designing an online business such as a blog and you do not have content already, you use a lorem ipsum generator to create placeholder or dummy text to show you how the business will look once you add the real content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
