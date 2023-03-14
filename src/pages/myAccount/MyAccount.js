import React, { useEffect } from "react";

import { useNavigate, Outlet, NavLink, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaCalendarAlt,
  FaUserCircle,
  FaAddressBook,
} from "react-icons/fa";

import "./MyAccount.css";
import { AuthConsumer } from "../../contexts";

import { useSelector, useDispatch } from "react-redux";
import { getUserDetailApi } from "../../toolkit/features/UserDetailSlice";
import {
  addressListApi,
  routeTo,
  setSelectedNavLinks,
} from "../../toolkit/features/AddressSlice";
import {
  getHireCalendarHiringApi,
  getHireCalendarHiringOutApi,
} from "../../toolkit/features/CalendarSlice";

const MyAccount = (props) => {
  const {} = props;

  const { navigateTo } = useSelector((state) => state.address);
  const { selectedNavLinks } = useSelector((state) => state.address);
  const { has_primary_card } = useSelector((state) => state.auth.user);
  const { has_primary_address } = useSelector((state) => state.auth.user);
  const { completed_stripe_onboarding } = useSelector(
    (state) => state.auth.user
  );

  // const [accountOverviewExpand, setAccountOverviewExpand] = useState(false);

  const { id } = AuthConsumer();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("postAdvertData");
    dispatch(getUserDetailApi(id));
  }, []);

  useEffect(() => {
    if (navigateTo != "") {
      navigate(`/my-account/${navigateTo}`);
    }
  }, [navigateTo]);

  // accountOverviewHandler
  const accountOverviewHandler = (e) => {
    // setAccountOverviewExpand(!accountOverviewExpand);
    dispatch(setSelectedNavLinks(""));
    dispatch(routeTo("account-overview"));
    navigate("/my-account/account-overview");
  };

  // hiringInHandler
  const hiringInHandler = (e) => {
    // setAccountOverviewExpand(!accountOverviewExpand);
    dispatch(setSelectedNavLinks("hiring-in"));
    dispatch(routeTo("hiring-in"));
    navigate("/my-account/hiring-in");
  };

  // hiringOutHandler
  const hiringOutHandler = (e) => {
    dispatch(setSelectedNavLinks("hiring-out"));
    dispatch(routeTo("hiring-out"));
    navigate("/my-account/hiring-out");
  };

  // myAdvertsHandler
  const myAdvertsHandler = (e) => {
    dispatch(setSelectedNavLinks("my-adverts"));
    dispatch(routeTo("my-adverts"));
    navigate("/my-account/my-adverts");
  };

  // bulkUploadHandler
  const bulkUploadHandler = (e) => {
    dispatch(setSelectedNavLinks("bulk-upload"));
    dispatch(routeTo("bulk-upload"));
    navigate("/my-account/bulk-upload");
  };

  // hireCalendarHandler
  const hireCalendarHandler = () => {
    dispatch(setSelectedNavLinks("hire-calendar"));
    dispatch(getHireCalendarHiringApi());
    dispatch(getHireCalendarHiringOutApi());
    dispatch(routeTo("hire-calendar"));
  };

  // userSettingsHandler
  const userSettingsHandler = () => {
    dispatch(setSelectedNavLinks("user-settings"));
    dispatch(routeTo("user-settings"));
  };

  // savedAddressHandler
  const savedAddressHandler = () => {
    dispatch(setSelectedNavLinks("saved-addresses"));
    dispatch(addressListApi());
    dispatch(routeTo("saved-addresses"));
  };

  return (
    <div className="body-saved-address">
      <div className="container body-height">
        <Link className="back py-2 pt-5" to="/search-landing">
          <FaArrowLeft /> Back to Search Landing
        </Link>

        <div className="row py-5">
          {/* My Account */}
          <div className="col-lg-3 col-md-4 col-12 pt-4">
            <h4 className="flamabold pb-3">
              <b>My Account</b>
              {/* <button onClick={() => setAccountOverviewExpand(!accountOverviewExpand)}>RR</button> */}
            </h4>

            {/* Account Overview */}
            <div className="dropdown">
              <div className="panel-group">
                <div className="panel panel-default">
                  <button
                    className={`btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-saved-address mt-3 `}
                    //  ${!accountOverviewExpand ? "collapsed" : ""}

                    type="button"
                    data-toggle="collapse"
                    href="#collapse1"
                    // aria-expanded={accountOverviewExpand}
                    onClick={accountOverviewHandler}
                  >
                    <FaEye />
                    &nbsp; Account Overview
                  </button>
                  <div
                    id="collapse1"
                    className={`panel-collapse collapse`}
                    // ${accountOverviewExpand ? "show" : ""}
                  >
                    <ul className="list-group pl-3">
                      <li
                        className={`list-group-item ${
                          selectedNavLinks === "hiring-in"
                            ? "list-item-active-address"
                            : "list-item-saved-address"
                        }`}
                        onClick={hiringInHandler}
                      >
                        <span
                          className={` ${
                            selectedNavLinks === "hiring-in" ? "flamabold" : ""
                          }`}
                        >
                          Hiring In
                        </span>
                      </li>

                      <li
                        className={`list-group-item ${
                          selectedNavLinks === "hiring-out"
                            ? "list-item-active-address"
                            : "list-item-saved-address"
                        }`}
                        onClick={hiringOutHandler}
                      >
                        <span
                          className={` ${
                            selectedNavLinks === "hiring-out" ? "flamabold" : ""
                          }`}
                        >
                          Hiring Out
                        </span>
                      </li>

                      <li
                        className={`list-group-item ${
                          selectedNavLinks === "my-adverts"
                            ? "list-item-active-address"
                            : "list-item-saved-address"
                        }`}
                        onClick={myAdvertsHandler}
                      >
                        <span
                          className={` ${
                            selectedNavLinks === "my-adverts" ? "flamabold" : ""
                          }`}
                        >
                          My Adverts
                        </span>
                      </li>

                      {has_primary_address === 1 &&
                        has_primary_card === 1 &&
                        completed_stripe_onboarding === 1 && (
                          <li
                            className={`list-group-item ${
                              selectedNavLinks === "bulk-upload"
                                ? "list-item-active-address"
                                : "list-item-saved-address"
                            }`}
                            onClick={bulkUploadHandler}
                          >
                            <span
                              className={` ${
                                selectedNavLinks === "bulk-upload"
                                  ? "flamabold"
                                  : ""
                              }`}
                            >
                              Bulk Upload
                            </span>
                          </li>
                        )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <NavLink
              to="/my-account/hire-calendar"
              className={({ isActive }) =>
                isActive
                  ? "btn btn-active-saved-address"
                  : "btn btn-saved-address"
              }
              onClick={hireCalendarHandler}
            >
              {/* <a href="#" className="a-saved-address"> */}

              {/* active icon */}
              <FaCalendarAlt
                className={`${
                  selectedNavLinks === "hire-calendar" ? "icon-active" : ""
                }`}
              />
              <span
                className={`my-acc-btn-txt ${
                  selectedNavLinks === "hire-calendar" ? "flamabold" : ""
                }`}
              >
                &nbsp; Hire Calendar
              </span>
              {/* </a> */}
            </NavLink>

            {/* User Settings */}
            {/* <button type="button" className="btn btn-saved-address">
            <a href="#" className="a-saved-address">
              <i className="fa-solid fa-eye" />
              <span>User Settings</span>
            </a>
          </button> */}

            <NavLink
              to="/my-account/user-settings"
              className={({ isActive }) =>
                isActive
                  ? "btn btn-active-saved-address"
                  : "btn btn-saved-address"
              }
              onClick={userSettingsHandler}
            >
              {/* <a href="#" className="a-saved-address"> */}
              <FaUserCircle
                className={`${
                  selectedNavLinks === "user-settings" ? "icon-active" : ""
                }`}
              />
              <span
                className={`my-acc-btn-txt ${
                  selectedNavLinks === "user-settings" ? "flamabold" : ""
                }`}
              >
                &nbsp; User Settings
              </span>
              {/* </a> */}
            </NavLink>

            {/* Saved Addresses */}
            {/* <button type="button" className="btn btn-active-saved-address">
            <a href="#" className="a-saved-address">
              <i className="fa-solid fa-address-book i-active-saved-address" />
              <span>Saved Addresses</span>
            </a>
          </button> */}

            <NavLink
              to="/my-account/saved-addresses"
              className={({ isActive }) =>
                isActive
                  ? "btn btn-active-saved-address"
                  : "btn btn-saved-address"
              }
              onClick={savedAddressHandler}
            >
              {/* <a href="#" className="a-saved-address"> */}
              <FaAddressBook
                className={`${
                  selectedNavLinks === "saved-addresses" ? "icon-active" : ""
                }`}
              />
              <span
                className={`my-acc-btn-txt ${
                  selectedNavLinks === "saved-addresses" ? "flamabold" : ""
                }`}
              >
                &nbsp; Saved Addresses
              </span>
              {/* </a> */}
            </NavLink>

            {/* <NavLink
              to="/my-account/bulk-upload"
              className={({ isActive }) =>
                isActive
                  ? "btn btn-active-saved-address"
                  : "btn btn-saved-address"
              }
              onClick={bulkUploadHandler}
            >
              <FaAddressBook
                className={`${
                  selectedNavLinks === "bulk-upload" ? "icon-active" : ""
                }`}
              />
              <span
                className={`my-acc-btn-txt ${
                  selectedNavLinks === "bulk-upload" ? "flamabold" : ""
                }`}
              >
                &nbsp; Bulk Upload
              </span>
            </NavLink> */}
          </div>

          <div className="col-lg-9 col-md-8 col-12 pt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export { MyAccount };
