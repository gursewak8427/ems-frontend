import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getToken } from "../../../helper/auth";

const StudentConfirm = () => {
  const [state, setState] = useState({
    isWaiting: true,
  });
  const { token } = useParams();
  useEffect(() => {
    // verify now
    // alert(token)
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .post(process.env.REACT_APP_NODE_URL + "/student/confirm", {}, config)
        .then((res) => {
          // console.log(res)
          setState({ isWaiting: false });
          setTimeout(() => {
            window.location.href = "/d?user=student";
          }, 2000);
        })
        .catch((err) => {
          console.log({ err })
          console.log(err.response.data);
        });
    }
  }, []);

  return (
    <>
      <center>
        {state.isWaiting ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921"
            alt=""
          />
        ) : (
          <>
            <h1 className="font-black mt-10 text-xl uppercase">
              Email verified Successfully as Student
            </h1>
            <img
              src="https://i.pinimg.com/originals/06/ae/07/06ae072fb343a704ee80c2c55d2da80a.gif"
              alt=""
            />
          </>
        )}
      </center>
    </>
  );
};

export default StudentConfirm;
