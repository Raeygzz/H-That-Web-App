import React, { useState, useEffect } from "react";

import { FaArrowLeft, FaRegUser, FaImages } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./ViewAdvert.css";
import { LocationConsumer } from "../../contexts";
import { getObjectLength, cancelHiringButton } from "../../utils";
import { findAddressFromPostcode } from "../../services/axios/Api";
import { HTCalendar, SocialShare } from "../../shared/pages_common";

import { useSelector, useDispatch } from "react-redux";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { cancelHiringApi } from "../../toolkit/features/HireSlice";
import { subCategoriesApi } from "../../toolkit/features/CategoriesSlice";
import { calendarUnavailableDateListApi } from "../../toolkit/features/CalendarSlice";
import {
  advertByIdApi,
  manualAddressPostcodePicker,
  pauseResumeAdvertApi,
  deleteAdvertByIdApi,
} from "../../toolkit/features/AdvertsSlice";

const ViewAdvert = (props) => {
  const {} = props;

  const { singleHireItem } = useSelector((state) => state.hire);
  const { singleAdvert } = useSelector((state) => state.adverts);
  const { categoriesHirePickerList } = useSelector((state) => state.categories);
  const { categoriesSalePickerList } = useSelector((state) => state.categories);
  const { categoriesForBothPickerList } = useSelector(
    (state) => state.categories
  );
  const { calendarUnavailableDateList } = useSelector(
    (state) => state.calendar
  );

  const [socialShare, setSocialShare] = useState({});
  const [displayImage, setDisplayImage] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { currentRoute } = LocationConsumer();

  useEffect(() => {
    dispatch(advertByIdApi(id));
    dispatch(calendarUnavailableDateListApi(id));
  }, []);

  useEffect(() => {
    if (getObjectLength(singleAdvert) != 0) {
      setSocialShare({
        ...socialShare,
        title: "HIRE THAT SHARE",
        url: `${process.env.REACT_APP_HT_URL}/view-advert/${singleAdvert.id}`,
        text: "I FOUND SOMETHING OF INTEREST ON HIRE THAT!",
      });

      if (singleAdvert.is_for_hire === 1 && singleAdvert.is_for_sale === 1) {
        categoriesForBothPickerList.filter((obj) => {
          if (obj.label === singleAdvert.category) {
            dispatch(subCategoriesApi(obj.id.toString()));
          }
        });
      }

      if (singleAdvert.is_for_hire === 1 && singleAdvert.is_for_sale === 0) {
        categoriesHirePickerList.filter((obj) => {
          if (obj.label === singleAdvert.category) {
            dispatch(subCategoriesApi(obj.id.toString()));
          }
        });
      }

      if (singleAdvert.is_for_hire === 0 && singleAdvert.is_for_sale === 1) {
        categoriesSalePickerList.filter((obj) => {
          if (obj.label === singleAdvert.category) {
            dispatch(subCategoriesApi(obj.id.toString()));
          }
        });
      }

      if (singleAdvert.is_manual_address === 1) {
        findAddressFromPostcode(singleAdvert.post_code)
          .then((res) => {
            if (res?.status === 200) {
              let addressArr = [];
              res.data.addresses.filter((obj, index) => {
                addressArr.push({
                  id: index,
                  label: obj.split(",")[0],
                  value: obj.split(",")[0],
                });
              });

              addressArr.unshift({
                id: "-1",
                label: "--Select--",
                value: "",
              });

              dispatch(manualAddressPostcodePicker(addressArr));
            }
          })
          .catch((error) => {
            // console.log("error ==> ", error.response);
          });
      }
    }
  }, [singleAdvert]);

  // cancelThisHirePopupHandler
  const cancelThisHirePopupHandler = (id) => {
    let modalConfig = {
      title: "Wait!",
      message: "Are you sure? Charges will apply",
      showCancelButton: true,
      shouldRunFunction: true,
      functionHandler: "cancelHiringHandler",
      shouldCallback: () => cancelHiringHandler(id),
    };

    dispatch(presentModal(modalConfig));
  };

  // cancelHiringHandler
  const cancelHiringHandler = (id) => {
    let obj = {
      id: id,
      paramsId: singleAdvert.id,
      navigate: navigate,
      currentRoute: currentRoute,
    };

    dispatch(cancelHiringApi(obj));
  };

  // editAdvertHandler
  const editAdvertHandler = () => {
    navigate("/edit-advert");
  };

  // pauseAdvertHandler
  const pauseAdvertHandler = () => {
    let obj = {
      advertId: singleAdvert.id,
      navigate: navigate,
      advertStatus: singleAdvert.pause === 0 ? "pause" : "resume",
    };

    dispatch(pauseResumeAdvertApi(obj));
  };

  // removeAdvertHandler
  const removeAdvertHandler = () => {
    let obj = {
      advertId: singleAdvert.id,
      navigate: navigate,
    };

    dispatch(deleteAdvertByIdApi(obj));
  };

  // calendar unavailable date list
  useEffect(() => {
    if (calendarUnavailableDateList.length > 0) {
      let readyForMarkedDates = [];
      for (let i = 0; i < calendarUnavailableDateList.length; i++) {
        readyForMarkedDates.push(calendarUnavailableDateList[i].date);
      }

      // console.log("readyForMarkedDates ==> ", readyForMarkedDates);
      setUnavailableDates(readyForMarkedDates);
    }
  }, [calendarUnavailableDateList]);

  const galleryPhotos =
    singleAdvert?.photos?.length > 0
      ? singleAdvert.photos.map((obj, index) => {
          return (
            <div
              className="col-4"
              key={index}
              onClick={() => setDisplayImage(obj.photo)}
            >
              <img
                src={obj.photo}
                alt="tractor"
                className={`thumbnail thumbnail1 pointer ${
                  obj.photo === displayImage && "thumbnail-active"
                }`}
              />
            </div>
          );
        })
      : null;
  return (
    <div className="container">
      <a className="back py-3 mt-5 mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to results
      </a>

      <div className="alert border alert-prod-hire">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-2 p-0 pt-3">
              {state === "HiringOut" && "This is your hiring out. "}

              {state === "MyAdverts" && "This is your advert. "}
            </div>

            {state === "HiringOut" && (
              <div className="col-md-3 col-12 py-2">
                <button
                  type="button"
                  className={`btn ${
                    cancelHiringButton(singleHireItem?.start_date)
                      ? "btn-prod-hire-disable"
                      : "btn-prod-hire2"
                  } flamabold m-0`}
                  onClick={cancelThisHirePopupHandler.bind(
                    this,
                    singleHireItem.id
                  )}
                  disabled={cancelHiringButton(singleHireItem?.start_date)}
                >
                  Cancel this hire
                </button>
              </div>
            )}

            {state === "MyAdverts" && (
              <>
                <div className="col-md-3 col-12 py-2">
                  <button
                    type="button"
                    className="btn btn-prod-hire1 flamabold m-0"
                    onClick={editAdvertHandler}
                  >
                    Edit Advert
                  </button>
                </div>

                <div className="col-md-3 col-12 py-2">
                  <button
                    type="button"
                    className="btn btn-prod-hire1 flamabold m-0"
                    onClick={pauseAdvertHandler}
                  >
                    {singleAdvert.pause === 0
                      ? "PAUSE ADVERT"
                      : "RESUME ADVERT"}
                  </button>
                </div>

                <div className="col-md-3 col-12 py-2">
                  <button
                    type="button"
                    className="btn btn-prod-hire2 flamabold m-0"
                    onClick={removeAdvertHandler}
                  >
                    Remove Advert
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-5 col-12 pt-3 pb-md-0 pb-4">
          {singleAdvert.pause === 1 && (
            <div className="paused">
              <i className="fa fa-pause" aria-hidden="true"></i>
              &nbsp; Paused
            </div>
          )}

          <img
            src={displayImage != "" ? displayImage : singleAdvert.main_image}
            alt="tractor"
            className="img-prod-hire"
          />

          <span className="orange_bg p-2 viewhire-noimg">
            <FaImages /> {`+0${singleAdvert?.photos?.length} Images`}
          </span>

          <div className="row">{galleryPhotos}</div>
        </div>

        <div className="col-md-7 col-12 pt-3">
          <h2 className="inline-block">
            <b>{singleAdvert.name}</b>
          </h2>

          <SocialShare
            socialShare={getObjectLength(socialShare) != 0 ? socialShare : ""}
          />

          <p>Hire from</p>

          {/* prices */}
          <div className="container">
            <div className="row">
              {singleAdvert.price_day_1 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_1}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">1 Day</b>
                  </p>
                </div>
              )}

              {singleAdvert.price_day_2 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_2}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">2 Days</b>
                  </p>
                </div>
              )}

              {singleAdvert.price_day_3 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_3}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">3 Days</b>
                  </p>
                </div>
              )}

              {singleAdvert.price_day_4 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_4}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">4 Days</b>
                  </p>
                </div>
              )}

              {singleAdvert.price_day_5 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_5}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">5 Days</b>
                  </p>
                </div>
              )}

              {singleAdvert.price_day_6 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_6}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">6 Days</b>
                  </p>
                </div>
              )}

              {singleAdvert.price_day_7 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleAdvert.price_day_7}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">7 Days</b>
                  </p>
                </div>
              )}

              {singleAdvert.selling_price != null && (
                <div className="col text-right">
                  <span className="orange-no-pointer">
                    <i className="fa fa-tag" aria-hidden="true"></i>&nbsp; Buy
                  </span>

                  <span className="flamabold">
                    &nbsp;£{singleAdvert.selling_price}&nbsp;
                  </span>

                  {singleAdvert.vat !== 0 && (
                    <span className="light-prod-hire">plus VAT</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <hr className="my-4" />

          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-12">
                <div className="rounded-circle pt-1 circle-btn1 circle-grey d-inline-block">
                  <FaRegUser />
                </div>

                <div className="d-inline-block pl-2 ml-1">
                  <span className="light-prod-hire">provided by </span>

                  <b>
                    {singleAdvert?.owner?.first_name +
                      " " +
                      singleAdvert?.owner?.last_name}
                  </b>

                  <p className="pt-2">
                    <span className="fa fa-star checked" />
                    <span className="fa fa-star checked" />
                    <span className="fa fa-star checked" />
                    <span className="fa fa-star checked" />
                    <span className="fa fa-star-half-full" />
                    <span> 4.5 star rating</span>
                  </p>
                </div>
              </div>

              {/* <div className="col-lg-6 col-12">
                <i className="fa fa-map-pin orange-pin pl-3 ml-1" aria-hidden="true" />

                <div className="pl-5 ml-3">
                  <h3 className="m-0">
                    <b>2.63</b>
                  </h3>

                  <span className="m-0">{`miles away from ${singleAdvert.post_code}`}</span>
                </div>
              </div> */}
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

                <p>{singleAdvert.make}</p>
              </div>

              <div className="col-4">
                <span className="light-prod-hire">Model</span>

                <p>{singleAdvert.model}</p>
              </div>
            </div>

            <div className="row">
              {singleAdvert.description != null && (
                <div className="col-12">
                  <br />
                  <span className="light-prod-hire">Description</span>
                  <p>{singleAdvert.description}</p>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-4">
                {singleAdvert.age != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Age(YOM)</span>
                    <p>{singleAdvert.age}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.mileage != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Mileage</span>
                    <p>{`${singleAdvert.mileage} mi`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.hours_used != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Hours</span>
                    <p>{`${singleAdvert.hours_used} Hours`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.length_mm != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Length</span>
                    <p>{`${singleAdvert.length_mm} CM`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.width_mm != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Width</span>
                    <p>{`${singleAdvert.width_mm} CM`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.height_mm != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Depth</span>
                    <p>{`${singleAdvert.height_mm} CM`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.ean != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">EAN</span>
                    <p>{singleAdvert.ean}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.weight != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Weight(KG / Tonnes)</span>
                    <p>{singleAdvert.weight}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleAdvert.product_code != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Product Code</span>
                    <p>{singleAdvert.product_code}</p>
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
                onChange={(day) => console.log("ViewAdvert day ==> ", day)}
              />
            </div>
          </div>

          <p className="pb-5">
            {" "}
            <span className="dot" /> Bookings
          </p>
        </div>
      </div>
    </div>
  );
};

export { ViewAdvert };
