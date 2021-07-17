import Axios from "axios";
import React, { useState, useEffect } from "react";
import Item from "./Item";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home({ refreshCart }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (error != "")
      toast.error("Error: " + error, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  }, [error]);
  useEffect(() => {
    Axios.get(process.env.REACT_APP_BACKEND_API + "/store/")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        if (err.response)
          setError("Error: " + err.response.status + err.response.data.message);
      });
    return () => { };
  }, []);
  const refreshCartHandler = () => {
    toast.success("Cart updated!", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    refreshCart();
  };
  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="columns is-mobile is-centered is-vcentered box p-0 mb-5">
            <img src="https://res.cloudinary.com/doc2bxwod/image/upload/v1626065570/samosabucket/a9oxgwwhkxzzgt8xdin1.jpg" alt={"Photo"} />
          </div>
          {items &&
            items.map((x) => {
              return (
                <Item
                  {...x}
                  key={"homeItem" + x._id}
                  refreshCart={refreshCartHandler}
                />
              );
            })}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default Home;
