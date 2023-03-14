import React from "react";

import { Link, useNavigate } from "react-router-dom";

import "./Header.css";

import { useDispatch } from "react-redux";
import { resetStore } from "../../../toolkit/features/AuthSlice";
import { routeTo } from "../../../toolkit/features/AddressSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // goToSettingsHandler
  const goToSettingsHandler = () => {
    navigate("/my-account/user-settings");
    dispatch(routeTo("user-settings"));
  };

  // myAccountOnClickHandler
  const myAccountOnClickHandler = () => {
    dispatch(routeTo("account-overview"));
  };

  // logOutHandler
  const logOutHandler = () => {
    localStorage.clear();
    dispatch(resetStore());
    // navigate("/");
  };

  const tempData = JSON.parse(localStorage.getItem("user"));
  const username = tempData.first_name + " " + tempData.last_name;
  return (
    <header className="section-header">
      <section className="header-main">
        {/*<div className="container">*/}
        <div className="row header-row">
          <div className="col-md-7 col-3">
            {" "}
            <Link to="/search-landing" className="brand-wrap" data-abc="true">
              {" "}
              <span className="logo ml-2">
                <img
                  className="logoimg"
                  src={require("../../../assets/images/logo.png")}
                />
              </span>{" "}
            </Link>{" "}
          </div>

          {/*  <div className="col-lg-6 col-xl-6 col-sm-8 col-md-8 d-none d-md-block">
             <form action="#" className="search-wrap">
                <div className="input-group w-100">
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary search-button"
                      type="submit"
                    >
                      <i className="fa fa-search" />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control search-form"
                    style={{ width: "55%" }}
                    placeholder="Search machinery, equipment, tools, materials and more"
                  />
                </div>
              </form>
            </div> */}

          {/*  <div class="btn-group btn-group-header ml-4">
                  <a type="button" class="btn btn-settings py-2" href="/my-account/user-settings">
                      <i className="fa fa-cog" aria-hidden="true"></i>
                      &ensp;Settings
                  </a>

                  <button type="button" class="btn btn-settings dropdown-toggle dropdown-toggle-split py-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-header">
                    <Link
                      // target="_blank"
                      className="dropdown-item"
                      to="/my-account"
                      onClick={myAccountOnClickHandler}
                    >
                      My Account
                    </Link> */}
          <div className="col-md-5 col-9">
            <div className="d-flex justify-content-end">
              <span className="username my-auto">
                Hi, <b>{username}</b>
              </span>

              <div className="btn-group btn-group-header ml-4">
                <span
                  // type="button"
                  className="btn btn-settings py-2"
                  // to="/my-account/user-settings"
                  onClick={goToSettingsHandler}
                >
                  <i className="fa fa-cog" aria-hidden="true"></i>
                  &ensp;Settings
                </span>

                <button
                  type="button"
                  className="btn btn-settings dropdown-toggle dropdown-toggle-split py-2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu">
                  <Link
                    // target="_blank"
                    className="dropdown-item"
                    to="/my-account/account-overview"
                    onClick={myAccountOnClickHandler}
                  >
                    My Account
                  </Link>

                  <button onClick={logOutHandler} className="dropdown-item">
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*</div>*/}
      </section>
    </header>
  );
}

export { Header };
