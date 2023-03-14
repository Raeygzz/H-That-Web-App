import React, { useState, useEffect, useRef } from "react";

import {
  FaArrowLeft,
  FaRegUser,
  // FaSearchPlus
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./Hire.css";
import { getObjectLength } from "../../utils";
import { useWindowScrollPositions } from "../../hooks";
import { HTCalendar, SocialShare } from "../../shared/pages_common";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { hireItemByIdApi } from "../../toolkit/features/HireSlice";
import { calendarUnavailableDateListApi } from "../../toolkit/features/CalendarSlice";

const Hire = (props) => {
  const {} = props;

  const { email } = useSelector((state) => state.auth.user);
  const { singleHireItem } = useSelector((state) => state.hire);
  const { has_primary_card } = useSelector((state) => state.auth.user);
  const { has_business_profile } = useSelector((state) => state.auth.user);
  const { calendarUnavailableDateList } = useSelector(
    (state) => state.calendar
  );

  // const [height, setHeight] = useState();
  const [socialShare, setSocialShare] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [unavailableDates, setUnavailableDates] = useState([]);

  const { id } = useParams();
  const heightRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { scrollX, scrollY } = useWindowScrollPositions();

  // console.log("scrollX ==> ", scrollX);
  // console.log("scrollY ==> ", scrollY);
  // console.log("window.innerHeight ==> ", window.innerHeight);

  useEffect(() => {
    if (id != null) {
      dispatch(hireItemByIdApi(id));
      dispatch(calendarUnavailableDateListApi(id));

      setSocialShare({
        ...socialShare,
        title: "HIRE THAT SHARE",
        url: `${process.env.REACT_APP_HT_URL}/hire/${id}`,
        text: "I FOUND SOMETHING OF INTEREST ON HIRE THAT!",
      });
    }
  }, [id]);

  // hireThisItemConditionCheckHandler
  const hireThisItemConditionCheckHandler = () => {
    if (email === null) {
      let modalConfig = {
        title: "Wait!",
        shouldRunFunction: true,
        functionHandler: "navigateToUserDetailScreen",
        message: `Please fill in the email address first and other required fields from User Detail Screen under User Settings.`,
      };

      dispatch(presentModal(modalConfig));
      return;
    }

    if (has_business_profile === 1 && has_primary_card === 1) {
      navigate("/hire-confirm", {
        state: {
          distance: state,
          singleHireItem: singleHireItem,
        },
      });

      return;
    }

    if (has_business_profile != 1 || has_primary_card != 1) {
      let modalConfig = {
        title: "Wait!",
        message:
          "Please take a moment to fill in your account details to complete your hire",
        shouldRunFunction: true,
        functionHandler: "hireThisItemHandler",
        shouldCallback: () => hireThisItemHandler(),
      };

      dispatch(presentModal(modalConfig));
    }
  };

  // hireThisItemHandler
  const hireThisItemHandler = () => {
    if (has_business_profile != 1) {
      navigate("/edit-user-detail");
      return;
    }

    if (has_primary_card != 1) {
      navigate("/add-card");
      return;
    }
  };

  const buyForHandler = () => {
    navigate("/buy-enquire", {
      state: singleHireItem.id,
    });
  };

  useEffect(() => {
    if (calendarUnavailableDateList.length > 0) {
      let readyForMarkedDates = [];
      for (let i = 0; i < calendarUnavailableDateList.length; i++) {
        readyForMarkedDates.push(calendarUnavailableDateList[i].date);
      }

      setUnavailableDates(readyForMarkedDates);
    }
  }, [calendarUnavailableDateList]);

  const galleryImage =
    singleHireItem?.photos?.length > 0
      ? singleHireItem.photos.map((obj, index) => {
          return (
            <div
              className="col-4"
              key={index}
              onClick={() => setPreviewImage(obj.photo)}
            >
              <img
                src={obj.photo}
                alt="tractor"
                className={`thumbnail thumbnail1 pointer ${
                  obj.photo === previewImage && "thumbnail-active"
                }`}
              />
            </div>
          );
        })
      : null;

  let fullUserName =
    singleHireItem?.owner?.first_name + " " + singleHireItem?.owner?.last_name;
  return (
    <>
      <div className="container">
        <a className="back py-3 mt-5 mb-4" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to results
        </a>

        <div className="row">
          <div className="col-md-5 col-12 pt-3 pb-md-0 pb-4">
            <img
              src={
                previewImage != "" ? previewImage : singleHireItem.main_image
              }
              alt="tractor"
              className="img-prod-hire"
            />

            {/* <div className="rounded-circle circle-btn pt-1 circle-btn-hire">
              <FaSearchPlus />
            </div> */}

            <div className="row">{galleryImage}</div>
          </div>

          <div className="col-md-7 col-12 pt-3">
            <h2>
              <b>{singleHireItem.name}</b>
            </h2>

            <SocialShare
              socialShare={getObjectLength(socialShare) != 0 ? socialShare : ""}
            />

            <p>Hire from</p>

            {/* prices */}
            <div className="container">
              <div className="row">
                {singleHireItem.price_day_1 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_1}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">1 Day</b>
                    </p>
                  </div>
                )}

                {singleHireItem.price_day_2 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_2}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">2 Days</b>
                    </p>
                  </div>
                )}

                {singleHireItem.price_day_3 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_3}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">3 Days</b>
                    </p>
                  </div>
                )}

                {singleHireItem.price_day_4 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_4}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">4 Days</b>
                    </p>
                  </div>
                )}

                {singleHireItem.price_day_5 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_5}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">5 Days</b>
                    </p>
                  </div>
                )}

                {singleHireItem.price_day_6 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_6}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">6 Days</b>
                    </p>
                  </div>
                )}

                {singleHireItem.price_day_7 != null && (
                  <div className="col-lg-2 col-3 p-0">
                    <h4>
                      <b>{`£${singleHireItem.price_day_7}`}</b>
                    </h4>
                    <p>
                      <b className="light-prod-hire">7 Days</b>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p>
              Select the desired duration of your hire after clicking the button
              below:
            </p>

            <button
              type="button"
              ref={heightRef}
              className="btn btn-prod-hire flamabold mr-2 mb-md-0 mb-4"
              onClick={hireThisItemConditionCheckHandler}
            >
              HIRE THIS ITEM
            </button>

            {singleHireItem.is_for_sale != 0 && (
              <button
                type="button"
                className="btn btn-prod-hire btn-prod-secondary flamabold mb-md-0 mb-4"
                onClick={buyForHandler}
              >
                {`OR BUY FOR £${singleHireItem.selling_price}`}
              </button>
            )}

            <hr className="my-4" />

            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-12">
                  <div className="row">
                    <div className="rounded-circle circle-grey-hire pt-1 col-3 mt-3">
                      <FaRegUser />
                    </div>

                    <div className="pl-3 col-9">
                      <span className="light-prod-hire">provided by </span>
                      <b>{fullUserName}</b>

                      <p className="pt-2">
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star-half-full" />
                        <span>4.5 star rating</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-12">
                  <i className="fa fa-map-pin orange-pin pl-3 ml-1" aria-hidden="true" />

                  <div className="pl-5 ml-3">
                    <h3 className="m-0">
                      <b>{state}</b>
                    </h3>

                    <span className="m-0">{`miles away from ${singleHireItem.post_code}`}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="mt-2" />

            <p>
              <b>Listing Details</b>
            </p>

            <div className="container-fluid">
              <div className="row">
                <div className="col-4">
                  <span className="light-prod-hire">Make</span>
                  <p>{singleHireItem.make}</p>
                </div>

                <div className="col-4">
                  <span className="light-prod-hire">Model</span>
                  <p>{singleHireItem.model}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  {singleHireItem.description != null && (
                    <>
                      <br />
                      <span className="light-prod-hire">Description</span>
                      <p>{singleHireItem.description}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  {singleHireItem.age != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Age(YOM)</span>
                      <p>{singleHireItem.age}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.mileage != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Mileage</span>
                      <p>{`${singleHireItem.mileage} mi`}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.hours_used != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Hours</span>
                      <p>{`${singleHireItem.hours_used} Hours`}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.length_mm != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Length</span>
                      <p>{`${singleHireItem.length_mm} CM`}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.width_mm != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Width</span>
                      <p>{`${singleHireItem.width_mm} CM`}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.height_mm != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Depth</span>
                      <p>{`${singleHireItem.height_mm} CM`}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.ean != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">EAN</span>
                      <p>{singleHireItem.ean}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.weight != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">
                        Weight(KG / Tonnes)
                      </span>
                      <p>{singleHireItem.weight}</p>
                    </>
                  )}
                </div>

                <div className="col-4">
                  {singleHireItem.product_code != null && (
                    <>
                      <br></br>
                      <span className="light-prod-hire">Product Code</span>
                      <p>{singleHireItem.product_code}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <hr className="mt-2" />

            <p>
              <b>Delivery / Collection</b>
            </p>

            <p>
              Delivery
              available&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Charges
              apply
            </p>

            <p>Collection in person&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FREE</p>

            <hr />

            <p>
              <b>Availability Calendar</b>
            </p>

            <div className="card card-calendar mb-3">
              <div className="card-body">
                <HTCalendar
                  confirmDatesDisplay={unavailableDates}
                  onChange={(day) => console.log("hire day ==> ", day)}
                />
              </div>
            </div>

            <p className="pb-5">
              <span>
                <span className="dot" /> Bookings
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* slideout w3-animate-top */}
      {scrollY > 540 && (
        <div className="banner py-3 w3-animate-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-8 col-12 mt-3">
                <p>
                  Are you ready to hire the <b>{singleHireItem.name}</b>?
                </p>
              </div>

              <div className="col-lg-3 col-md-4 col-12 my-auto">
                <button
                  type="button"
                  className="btn btn-banner-prod btn-hire-confirm  flamabold"
                  onClick={hireThisItemConditionCheckHandler}
                >
                  HIRE THIS ITEM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Hire };
