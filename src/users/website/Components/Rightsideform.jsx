import React from "react";

export default function Rightsideform() {
  return (
    <div>
      <div className="border bg-white right-form">
        <h4 className="p-2 bg-black text-white font-light text-lg">
          Interested in projects?
        </h4>
        <div className="p-2">
          <p className="mb-4">
            EMS can help – fill in your details and we’ll call you back
          </p>
          <p className="mb-3">
            <input
              className="w-full p-2 border outline-none"
              type="text"
              placeholder="First Name"
            />
          </p>
          <p className="mb-3">
            <input
              className="w-full p-2 border outline-none"
              type="text"
              placeholder="Last Name"
            />
          </p>
          <p className="mb-3">
            <input
              className="w-full p-2 border outline-none"
              type="mail"
              placeholder="Email"
            />
          </p>

          <p className="mb-3">
            <input
              className="w-full p-2 border outline-none"
              type="number"
              placeholder="+91"
            />
          </p>

          <p className="">
            <label className="text-slate-300">
              Your preferred study destination
            </label>
            <select className="w-full p-2 border outline-none" name="" id="">
              <option value="Nz">Nz</option>
              <option value="Uk">Uk</option>
              <option value="Canada">Canada</option>
            </select>
          </p>
          <p className="text-sm text-slate-300">
            Learn Global is that institution that remove rough edges from the
            way of your success.
          </p>

          <p className="flex items-center gap-2 mt-2 mb-3">
            <input type="checkbox" />I agree to Learn Global{" "}
            <a href="#">Terms</a> and <a href="#">Privacy policy</a>
          </p>

          <p className="mt-5">
            <input
              type="submit"
              value="Register Now"
              name="submit"
              className="register text-center mx-auto block p-2 w-full text-white"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
