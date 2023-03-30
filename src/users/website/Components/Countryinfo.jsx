import React from "react";
import Nz from "../images/new_zln.png";
import Nmit from "../images/nmit.jpg";

export default function Countryinfo() {
  return (
    <div>
      <div className="container mx-auto px-4 lg:px-0 py-10">
        <div className="lg:flex gap-4">
          <div class="lg:w-1/3">
            <div className="upr-img p-3">
              <img src={Nz} />
              <h5 className="lg:text-2xl py-2 px-2">People Also Viewed</h5>
              <div className="detail-part p-3 shadow-xl">
                <div className="flex items-center inner-detail-part pt-3 mb-4">
                  <div>
                    <img src={Nmit} />
                  </div>
                  <div>
                    <h6 className="text-xl">NMIT</h6>
                    <a
                      href="/viewdetails"
                      class="hover:bg-black text-white font-bold py-2 px-6 rounded"
                    >
                      View Detail
                    </a>
                  </div>
                </div>
                <div className="flex items-center inner-detail-part pt-3 mb-4">
                  <div>
                    <img src={Nmit} />
                  </div>
                  <div>
                    <h6 className="text-xl">NMIT</h6>
                    <a
                      href="/viewdetails"
                      class="hover:bg-black text-white font-bold py-2 px-6 rounded"
                    >
                      View Detail
                    </a>
                  </div>
                </div>
                <div className="flex items-center inner-detail-part pt-3 mb-4">
                  <div>
                    <img src={Nmit} />
                  </div>
                  <div>
                    <h6 className="text-xl">NMIT</h6>
                    <a
                      href="/viewdetails"
                      class="hover:bg-black text-white font-bold py-2 px-6 rounded"
                    >
                      View Detail
                    </a>
                  </div>
                </div>
                <div className="flex items-center inner-detail-part pt-3 mb-4">
                  <div>
                    <img src={Nmit} />
                  </div>
                  <div>
                    <h6 className="text-xl">NMIT</h6>
                    <a
                      href="/viewdetails"
                      class="hover:bg-black text-white font-bold py-2 px-6 rounded"
                    >
                      View Detail
                    </a>
                  </div>
                </div>
                <div className="flex items-center inner-detail-part pt-3 mb-4">
                  <div>
                    <img src={Nmit} />
                  </div>
                  <div>
                    <h6 className="text-xl">NMIT</h6>
                    <a
                      href="/viewdetails"
                      class="hover:bg-black text-white font-bold py-2 px-6 rounded"
                    >
                      View Detail
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:w-2/3">
            <h5 className="text-3xl mt-3 mb-2">Information of New Zealand</h5>
            <p className="mb-4 lg:text-lg">
              The educational system in New Zealand is extremely varied and is
              one of the best in the world. According to scores, it has the
              highest levels of literacy, mathematics, and sciences in the
              country. The public educational system is one of the best funded
              in the world; New Zealand offers the highest percentage of public
              funding in education in the world. Several indices rate New
              Zealand as the number one country in the world for education.
            </p>
            <p className="mb-4 lg:text-lg">
              So what makes New Zealand so unique? What makes it different than
              all of the other developed countries that provide education to
              their children? It is based on several things; first, because New
              Zealand natives believe in giving everyone the education that they
              deserve. There are many private schools, but because the country
              is so great at giving their public schools the monies they need,
              many parents are just as happy using the public system.
            </p>
            <div className="country-video">
              <iframe
                width="890"
                height="390"
                src="https://www.youtube.com/embed/DUr3rWYo650"
                title="What&#39;s it like to be an international student studying in NZ?"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
