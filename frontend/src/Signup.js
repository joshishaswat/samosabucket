import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { debounce } from "throttle-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import statesData from "./states.json";

function Signup({ loginHandler, redirectTo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Alabama");
  const [zip, setZip] = useState("");
  const [other, setOther] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [autocompleteFocus, setAutoCompleteFocus] = useState(false);
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [
    mouseOnAutoCompleteSuggestions,
    setMouseOnAutoCompleteSuggestions,
  ] = useState(false);

  const setAddressForm = (data) => {
    setAutoCompleteFocus(false);
    setMouseOnAutoCompleteSuggestions(false);
    setLine1(data?.number + ", " + data?.street);
    setZip(data?.postal_code);
    setState(data?.region_code);
    setCity(data?.locality);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const phoneChange = (e) => {
    setPhone(e.target.value);
  };
  const nameChange = (e) => {
    setName(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const autocompleteQueryAndSet = (text) => {
    Axios({
      method: "get",
      url: process.env.REACT_APP_POSITIONSTACK_API,
      params: {
        access_key: process.env.REACT_APP_POSITIONSTACK_API_KEY,
        query: text,
        country: "US",
      },
    }).then((res) => {
      setAutocompleteData(res.data.data);
    });
  };

  const debouncedAutocompleteQueryAndSet = debounce(
    200,
    autocompleteQueryAndSet
  );

  const line1Change = (e) => {
    setLine1(e.target.value);
    if (e.target.value.length > 3) {
      if (process.env.REACT_APP_POSITIONSTACK_ENABLED === "TRUE") {
        debouncedAutocompleteQueryAndSet(e.target.value);
      }
    } else {
      setAutocompleteData([]);
    }
  };
  const line2Change = (e) => {
    setLine2(e.target.value);
  };
  const cityChange = (e) => {
    setCity(e.target.value);
  };

  const zipChange = (e) => {
    setZip(e.target.value);
  };

  const stateChange = (e) => {
    setState(e.target.value);
  };

  const otherChange = (e) => {
    setOther(e.target.value);
  };

  const signUpSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    Axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_API + "/user/signup",
      data: {
        email: email,
        password: password,
        name: name,
        address: {
          line1: line1,
          line2: line2,
          city: city,
          zip: zip,
          state: state,
          country: "US",
        },
        phone: phone,
        other: other,
      },
      withCredentials: true,
    })
      .then((res) => {
        loginHandler();
        setIsLoading(false);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(false);
        setIsLoggedIn(false);
        loginHandler();
        toast.error("Error: " + err.response.data.message[0].msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  useEffect(() => {
    return () => {
      debouncedAutocompleteQueryAndSet.cancel();
    };
  }, []);

  if (isLoggedIn) {
    return <Redirect to={redirectTo || "/"} />;
  }

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-4">
          <div className="card p-2">
            <div className="title has-text-centered">👋&nbsp;Welcome!</div>
            <form className="form-horizontal">
              <fieldset>
                <legend></legend>

                <div className="field">
                  <label className="label" htmlFor="email">
                    Full Name
                  </label>
                  <div className="control">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input "
                      required=""
                      value={name}
                      onChange={nameChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="email">
                    E-mail
                  </label>
                  <div className="control">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      className="input "
                      required=""
                      onChange={emailChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="passwordinput-0">
                    Password
                  </label>
                  <div className="control">
                    <input
                      id="passwordinput-0"
                      name="passwordinput-0"
                      type="password"
                      className="input "
                      required=""
                      value={password}
                      onChange={passwordChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="passwordinput-0">
                    Phone
                  </label>
                  <div className="control">
                    <input
                      id="phoneinput-0"
                      name="phoneinput-0"
                      type="text"
                      className="input "
                      required=""
                      onChange={phoneChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="line1">
                    Address Line 1
                  </label>
                  <div className="control autocomplete-control">
                    <input
                      id="line1"
                      name="line1"
                      type="text"
                      className="input"
                      autoComplete="off"
                      onChange={line1Change}
                      value={line1}
                      onFocus={(e) => {
                        setAutoCompleteFocus(true);
                      }}
                      onBlur={() => {
                        setAutoCompleteFocus(false);
                      }}
                    />
                    {(autocompleteFocus || mouseOnAutoCompleteSuggestions) && (
                      <>
                        <div
                          className="autocomplete"
                          onMouseEnter={() =>
                            setMouseOnAutoCompleteSuggestions(true)
                          }
                          onMouseLeave={() =>
                            setMouseOnAutoCompleteSuggestions(false)
                          }
                        >
                          {autocompleteData.map((data, index) => (
                            <div
                              key={"signup-address-autocomplete" + index}
                              className="autocomplete-item"
                              onClick={() => {
                                setAddressForm(data);
                              }}
                            >
                              {data?.label || ""}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="line2">
                    Address Line 2
                  </label>
                  <div className="control">
                    <input
                      id="line2"
                      name="line2"
                      type="text"
                      placeholder="Optional"
                      className="input "
                      onChange={line2Change}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="city">
                    City
                  </label>
                  <div className="control">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="input "
                      required=""
                      value={city}
                      onChange={cityChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="state">
                    State
                  </label>
                  <div className="control">
                    <select
                      className="input"
                      value={state}
                      onChange={stateChange}
                    >
                      {statesData.map((item) => (
                        <option
                          key={item.abbreviation}
                          value={item.abbreviation}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="zip" onChange={zipChange}>
                    Zip Code
                  </label>
                  <div className="control">
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      className="input "
                      required=""
                      value={zip}
                      onChange={zipChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="other" onChange={otherChange}>
                  Special Instructions / Allergies
                  </label>
                  <div className="control">
                    <input
                      id="other"
                      name="other"
                      type="text"
                      placeholder="Optional"
                      className="input "
                      required=""
                      value={other}
                      onChange={otherChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="signup"></label>
                  <div className="control">
                    <button
                      id="signup"
                      name="signup"
                      className={
                        "button is-primary " + (isLoading ? "is-loading" : "")
                      }
                      onClick={signUpSubmit}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
            {isError && (
              <div className="has-background-danger has-text-white my-2 p-2">
                <p>
                  You might have missed or made a mistake on one or more fields
                  on the sign up form above. Please note that all fields except for address line
                  2 and allergies/special instructions are required.
                </p>
              </div>
            )}
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
      </div>
    </div>
  );
}

export default Signup;
