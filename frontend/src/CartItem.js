import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
function CartItem(x) {

  const [item, setItem] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showDetails, setShowDetails] = useState(false);
  const itemId = x.itemId;
  const refreshCart = x.refreshCart;
  const spicy = x.spicy;
  const side = x.side;
  const vegetarian = x.vegetarian;
  const dip = x.dip;
  let qty = x.qty;
  let delivery_time = x.delivery_time;
  let mainItem = x.mainItem;
  let tacoShell = x.tacoShell;

  const deleteItem = () => {
    Axios.delete(process.env.REACT_APP_BACKEND_API + "/cart/" + itemId, {
      withCredentials: true,
    })
      .then((res) => {
        refreshCart();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
        }
      });
  };
  const updateCart = () => {
    Axios.post(
      process.env.REACT_APP_BACKEND_API + "/cart/",
      {
        itemId: itemId,
        qty: qty,
        delivery_time: delivery_time,
        spicy: spicy, //samosabucket
        side: side, //Samosabucket - chicken tikka
        vegetarian: vegetarian, //samosabucket
        dip: dip, //samosabucket
        mainItem: mainItem, //vegan flava cafe
        tacoShell: tacoShell, //vegan flava cafe
      },
      { withCredentials: true }
    )
      .then((res) => {
        refreshCart();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) setIsLoggedIn(false);
      });
  };
  const handleQty = (e) => {
    qty = e.target.value;
    updateCart();
  };
  const handleDTime = (e) => {
    delivery_time = e.target.value;
    updateCart();
  };
  useEffect(() => {
    Axios.get(process.env.REACT_APP_BACKEND_API + "/store/" + itemId)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) setIsLoggedIn(false);
      });
  }, [itemId]);
  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    item !== undefined && (
      <div className="columns is-mobile is-centered is-vcentered box p-0 mx-1 mb-4">
        <div className="column is-3 p-0">
          <figure className="image is-square">
            <img src={item.imageUrl} alt={"Photo of" + item.name} />
          </figure>
        </div>
        <div className="column is-9 pl-3 pb-0 pt-0">
          <p className="title is-4">{item.name}</p>
          <p className="subtitle is-5">${item.price}</p>
          <p className="subtitle is-6">{item.description}</p>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-danger" onClick={deleteItem}>
                REMOVE
              </button>
            </div>
            <div className="control pb-2">
              <div className="select">
                <select onChange={handleQty} selected={qty} value={qty}>
                  {[...Array(5)].map((x, index) => {
                    return (
                      <option key={"opt" + (index + 1) + item._id}>
                        {index + 1}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="control pb-3">
              <div className="select">
                <select onChange={handleDTime} selected={delivery_time} value={delivery_time}>

                  {(() => {
                    if (itemId === "60dfa9e2bf70ac0017547f2f" || itemId === "60dfa9b6bf70ac0017547f2e") { //cakes and bakes
                      return (
                        <React.Fragment>
                          <option> Saturday, August 07 </option>
                          <option> Sunday, August 08 </option>
                        </React.Fragment>
                      );
                    } else if (itemId === "60dcf34954590a0017027dd4" || itemId === "60dcf48854590a0017027dd5") { //vegan flava
                      return (
                        <React.Fragment>
                          <option> Friday, August 06 </option>
                        </React.Fragment>
                      );
                    }
                    else { //samosabucket
                      return (
                        <React.Fragment>
                          <option> Sunday, August 08 </option>
                        </React.Fragment>
                      )
                    }
                  })()}
                </select>
              </div>
            </div>
            <div className="columns">
              <div className={"column"}>
                <button className="button is-info " onClick={() => setShowDetails(!showDetails)}>
                  {showDetails ? "HIDE DETAILS" : "SHOW DETAILS"}
                </button>
              </div>
            </div>
          </div>
          {showDetails && (
            <div className="">
              <table className="table is-fullwidth p-2">
                <thead>
                  <tr>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={itemId}>
                    {optionsReturn(x)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  );
  function optionsReturn(x) {
    let optStr = "";
    Object.keys(x).map((key) => {
      if (key !== "delivery_time" && key !== "_id" && key !== "itemId" && key !== "qty" && key !== "price" && key !== "item_name"
        && key !== "refreshCart") {
        optStr += key + ": " + x[key] + ", ";
      }
    });
    return <td>{optStr.length ? optStr.substring(0, optStr.length - 2) : ""}</td>;
  }
}

export default CartItem;
