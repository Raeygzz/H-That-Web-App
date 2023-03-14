import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaImages, FaRegUser } from "react-icons/fa";

import "./ViewHire.css";
import { cancelHiringButton } from "../../utils";
import { LocationConsumer } from "../../contexts";
import { HTCalendar } from "../../shared/pages_common";

import { useSelector, useDispatch } from "react-redux";
import { hiringByIdApi } from "../../toolkit/features/HireSlice";
import { presentModal } from "../../toolkit/features/ModalSlice";
import { cancelHiringApi } from "../../toolkit/features/HireSlice";
import { calendarUnavailableDateListApi } from "../../toolkit/features/CalendarSlice";

const ViewHire = (props) => {
  const {} = props;

  const { singleHireItem } = useSelector((state) => state.hire);
  const { calendarUnavailableDateList } = useSelector(
    (state) => state.calendar
  );

  const [displayImage, setDisplayImage] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId, calendarId } = useParams();
  const { currentRoute } = LocationConsumer();

  useEffect(() => {
    dispatch(hiringByIdApi(itemId));
    dispatch(calendarUnavailableDateListApi(calendarId));
  }, []);

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
      paramsId: calendarId,
      navigate: navigate,
      currentRoute: currentRoute,
    };

    dispatch(cancelHiringApi(obj));
  };

  const galleryPhotos =
    singleHireItem?.item?.photos?.length > 0
      ? singleHireItem?.item?.photos.map((obj, index) => {
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
      <a className="back py-3 mt-5 mb-4" onClick={(e) => navigate(-1)}>
        <FaArrowLeft /> Back to hiring in
      </a>

      <div className="alert border alert-prod-hire">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-2 p-0 pt-3">
              This is your hiring in.{" "}
            </div>

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
                  singleHireItem?.id
                )}
                disabled={cancelHiringButton(singleHireItem?.start_date)}
              >
                Cancel Hire
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-5 col-12 pt-3 pb-md-0 pb-4">
          <img
            src={
              displayImage != ""
                ? displayImage
                : singleHireItem?.item?.main_image
            }
            alt="tractor"
            className="img-prod-hire"
          />

          <span className="orange_bg p-2 viewhire-noimg">
            {/* add icon */}
            <FaImages className="images-pos" />{" "}
            {`+0${singleHireItem?.item?.photos?.length} Images`}
          </span>

          <div className="row">{galleryPhotos}</div>
        </div>

        <div className="col-md-7 col-12 pt-3">
          <h2>
            <b>{singleHireItem?.item?.name}</b>
          </h2>

          <p>Hire from</p>

          {/* prices */}
          <div className="container">
            <div className="row">
              {singleHireItem?.item?.price_day_1 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_1}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">1 Day</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.price_day_2 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_2}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">2 Days</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.price_day_3 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_3}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">3 Days</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.price_day_4 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_4}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">4 Days</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.price_day_5 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_5}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">5 Days</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.price_day_6 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_6}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">6 Days</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.price_day_7 != null && (
                <div className="col-lg-2 col-3 p-0">
                  <h4>
                    <b>{`£${singleHireItem?.item?.price_day_7}`}</b>
                  </h4>
                  <p>
                    <b className="light-prod-hire">7 Days</b>
                  </p>
                </div>
              )}

              {singleHireItem?.item?.selling_price != null && (
                <div className="col text-right">
                  <span className="orange-no-pointer">
                    <i className="fa fa-tag" aria-hidden="true"></i>&nbsp; Buy
                  </span>

                  <span className="flamabold">
                    &nbsp;£{singleHireItem.item.selling_price}&nbsp;
                  </span>

                  {singleHireItem.item.vat !== 0 && (
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
                <div className="rounded-circle circle-btn1 circle-grey d-inline-block">
                  <FaRegUser />
                </div>

                <div className="d-inline-block pl-2 ml-1">
                  <span className="light-prod-hire">provided by </span>

                  <b>
                    {singleHireItem?.item?.owner?.first_name +
                      " " +
                      singleHireItem?.item?.owner?.last_name}
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
                <i className="fa fa-map-pin orange-pin orange-pin pl-3 ml-1" aria-hidden="true" />

                <div className="pl-5 ml-3">
                  <h3 className="m-0">
                    <b>2.63</b>
                  </h3>

                  <span className="m-0">{`miles away from ${singleHireItem?.item?.post_code}`}</span>
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
                <p>{singleHireItem?.item?.make}</p>
              </div>

              <div className="col-4">
                <span className="light-prod-hire">Model</span>
                <p>{singleHireItem?.item?.model}</p>
              </div>
            </div>

            <div className="row">
              {singleHireItem?.item?.description != null && (
                <div className="col-12">
                  <br />
                  <span className="light-prod-hire">Description</span>
                  <p>{singleHireItem?.item?.description}</p>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-4">
                {singleHireItem?.item?.age != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Age(YOM)</span>
                    <p>{singleHireItem?.item?.age}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.mileage != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Mileage</span>
                    <p>{`${singleHireItem?.item?.mileage} mi`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.hours_used != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Hours</span>
                    <p>{`${singleHireItem?.item?.hours_used} Hours`}</p>
                  </>
                )}
              </div>

              {/* dates */}
              <div className="col-12 pb-2">
                <span className="light-prod-hire">Dates</span>
              </div>

              <div className="col-12 col-md-8">
                <span className="flamabold">From</span>
                <span className="light-prod-hire ">
                  &nbsp; {singleHireItem?.start_date}
                </span>
              </div>

              <div className="col-12 col-md-4">
                <span className="flamabold">To</span>
                <span className="light-prod-hire">
                  &nbsp; {singleHireItem?.end_date}
                </span>
              </div>
            </div>

            <hr className="mt-2" />

            <div className="row">
              <div className="col-4">
                {singleHireItem?.item?.length_mm != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Length</span>
                    <p>{`${singleHireItem?.item?.length_mm} CM`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.width_mm != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Width</span>
                    <p>{`${singleHireItem?.item?.width_mm} CM`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.height_mm != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Depth</span>
                    <p>{`${singleHireItem?.item?.height_mm} CM`}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.ean != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">EAN</span>
                    <p>{singleHireItem?.item?.ean}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.weight != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Weight(KG / Tonnes)</span>
                    <p>{singleHireItem?.item?.weight}</p>
                  </>
                )}
              </div>

              <div className="col-4">
                {singleHireItem?.item?.product_code != null && (
                  <>
                    <br></br>
                    <span className="light-prod-hire">Product Code</span>
                    <p>{singleHireItem?.item?.product_code}</p>
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
                onChange={(day) => console.log("ViewHire day ==> ", day)}
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

export { ViewHire };
