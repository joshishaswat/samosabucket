import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var FA = require("react-fontawesome");

function Navbar({ isAdmin, isLoggedIn, user }) {
  const [isHBActive, setIsHBActive] = useState(false);

  const toggleMenu = () => {
    setIsHBActive(!isHBActive);
  };

  return (
    <nav
      className="navbar box p-1"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={logo} width="180" height="20" alt="CloudEats.app Logo" />
        </Link>

        <span
          role="button"
          className={"navbar-burger burger" + (isHBActive ? " is-active" : "")}
          aria-label="menu"
          aria-expanded="false"
          data-target="navTarget"
          onClick={toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </span>
      </div>

      <div
        id="navTarget"
        className={"navbar-menu" + (isHBActive ? " is-active" : "")}
      >
        <div className="navbar-start">
          <Link className="navbar-item button is-light mx-2 mt-2" to="/">
            <FA name="shopping-bag" />
            &nbsp;Restaurants
          </Link>
          <Link className="navbar-item button is-light mx-2 mt-2" to="/orders">
            <FA name="credit-card" />
            &nbsp;Orders
          </Link>
          <Link className="navbar-item button is-light mx-2 mt-2" to="/about">
            <FA name="info" />
            &nbsp;{process.env.REACT_APP_HELP_TAB_NAME || "About"}
          </Link>

          {isAdmin && (
            <Link
              className="navbar-item button is-light mx-2 mt-2"
              to="/adminorders"
            >
              <FA name="gear" />
              &nbsp;Manage Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              className="navbar-item button is-light mx-2 mt-2"
              to="/adminproducts"
            >
              <FA name="gear" />
              &nbsp; Products
            </Link>
          )}
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!isLoggedIn ? (
                <>
                  <Link className="button is-primary" to="/signup">
                    <strong>Sign up</strong>
                  </Link>
                  <Link className="button is-light" to="/login">
                    Log in
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/me" className="button is-light">
                    <FA name="user" />
                    &nbsp;Account
                  </Link>
                  <Link className="button is-primary" to="/cart">
                    <FA name="shopping-cart" />
                    &nbsp;Cart
                    {isLoggedIn && user.cart.length > 0 && (
                    <span class="badge">{user.cart.length}</span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </nav>
  );
}

export default Navbar;
