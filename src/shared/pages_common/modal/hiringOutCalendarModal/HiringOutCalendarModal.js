import React from "react";

import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import "./HiringOutCalendarModal.css";
import { changeTwoDatesToFormattedDate } from "../../../../utils/Utils";

import { useSelector, useDispatch } from "react-redux";
import { singleHiringItem } from "../../../../toolkit/features/HireSlice";
import { hideHiringOutModal } from "../../../../toolkit/features/BigCalendarSlice";

const HiringOutCalendarModal = (props) => {
  const {} = props;

  const { event } = useSelector((state) => state.bigCalendar);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const outerClickHandler = () => {
    dispatch(hideHiringOutModal());
  };

  // hiringOutViewItemHandler
  const hiringOutViewItemHandler = () => {
    let tempEvent = { ...event };

    tempEvent["start"] = format(new Date(tempEvent.start), "yyyy-MM-dd");
    tempEvent["start_date"] = tempEvent["start"]; // change old to new key
    delete tempEvent["start"]; // delete old key
    // console.log("tempEvent ==> ", tempEvent);

    dispatch(singleHiringItem(tempEvent));

    navigate(`/view-advert/${event.itemId}`, {
      state: "HiringOut",
    });
  };

  return (
    <div className="overlay" onClick={outerClickHandler}>
      <div className="text-center pt-5 mt-5">
        <div className="bubble bubble--arrow bubble--arrow-nw">
          {" "}
          {/* arrow  */}
          <div className="card card-calendar-hire m-0">
            <div className="card-body card-calendar-body">
              <div className="card-calendar-black" />

              <div className="p-4">
                <div className="card-title card-calendar-title">
                  <p className="orange flamabold card-small-title">
                    Hiring Out
                  </p>

                  <p className="flamabold">{event.title}</p>
                </div>

                <div className="card-calendar-body">
                  <p>
                    {changeTwoDatesToFormattedDate(
                      format(new Date(event.start), "yyyy-MM-dd"),
                      format(new Date(event.end), "yyyy-MM-dd")
                    )}
                  </p>

                  <hr className="my-4" />

                  <p className="light-acc-overv mb-0">Customer</p>

                  <p className="flamabold card-user-title">
                    {event.providedBy}
                  </p>

                  <p className="card-user-title">
                    {event.address1}
                    <br />

                    {event.address2 != null && (
                      <>
                        {event.address2}
                        <br />
                      </>
                    )}

                    {event.city}
                    <br />
                    {event.postcode}
                    <br />
                    {event.email}
                    <br />
                    {event.phoneNumber}
                  </p>

                  <div className="col-12 col-md-4 p-0 pt-4">
                    <button
                      type="button"
                      className="btn btn-calendar"
                      onClick={hiringOutViewItemHandler}
                    >
                      <b className="b-btn-calendar">VIEW ITEM</b>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HiringOutCalendarModal };
