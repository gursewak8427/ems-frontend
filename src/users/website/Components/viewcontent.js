import React from "react";
import { Link } from "react-router-dom";

export default function viewcontent() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="viewtab-cont lg:flex">
          <div className="low-width">
            <ul className="view-tab-content">
              <li className="mb-4 ">
                <Link
                  className="text-xl text-white  relative py-3 px-12 mb-3 block active"
                  to="#"
                >
                  About
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  className="text-xl text-white bg-black py-3 px-12 relative mb-3 block"
                  to="#"
                >
                  Features
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  className="text-xl text-white bg-black py-3 px-12 relative mb-3 block"
                  to="#"
                >
                  Location
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  className="text-xl text-white bg-black py-3 px-12 relative mb-3 block"
                  to="#"
                >
                  Programs
                </Link>
              </li>
            </ul>
          </div>
          <div className="high-width">
            <h2 className="font-bold text-black text-3xl mb-3">About Us</h2>
            <p>
              Nelson Marlborough Institute of Technology is the largest public
              Tertiary Education Institution at the Top of the South Island in
              New Zealand. NMIT\'s main campus is in Nelson with other campuses
              in Blenheim, Marlborough, Woodbourne and Richmond
            </p>
          </div>
          <div className="low-width shadow-lg p-3 viewform">
            <h3 className="text-2xl p-2 text-white bg-black">
              Interested in studying abroad?
            </h3>
            <p className="p-2">
              Learn Global can help – fill in your details and we’ll call you
              back
            </p>
            <p className="mb-2">
              <input
                className="w-full p-3"
                type="text"
                placeholder="First Name"
              />
            </p>
            <p className="mb-2">
              <input
                className="w-full p-3"
                type="text"
                placeholder="Last Name"
              />
            </p>
            <p className="mb-2">
              <input className="w-full p-3" type="email" placeholder="Email" />
            </p>
            <p className="mb-2">
              <input className="w-full p-3" type="tel" placeholder="" />
            </p>
            <p>
              <label>Your preferred study destination</label>
              <select className="w-full p-3 mb-1">
                <option value="">canada</option>
                <option value="">nz</option>
                <option value="">aus</option>
                <option value="">usa</option>
              </select>
              Learn Global nde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium
            </p>

            <div className="mt-3">
              <p className="flex items-center gap-2">
                <input type="checkbox" />I agree to Learn Global{" "}
                <Link to="#">Terms</Link> and <Link to="#">Privacy Policy</Link>
              </p>
            </div>
            <input
              type="submit"
              value="Register Now"
              name="submit"
              className="register text-center w-full mt-6 py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
