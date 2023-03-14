import React, { useState, useEffect, useCallback } from "react";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enGB from "date-fns/locale/en-GB";
// import "react-big-calendar/lib/css/react-big-calendar.css";

import "./HireCalendar.css";
import { formatDate } from "../../utils";
import { HiringInCalendarModal } from "../../shared/pages_common/modal/hiringInCalendarModal/HiringInCalendarModal";
import { HiringOutCalendarModal } from "../../shared/pages_common/modal/hiringOutCalendarModal/HiringOutCalendarModal";

import { useSelector, useDispatch } from "react-redux";
import {
  showHiringInModal,
  showHiringOutModal,
} from "../../toolkit/features/BigCalendarSlice";

const locales = {
  "en-GB": enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const HireCalendar = (props) => {
  const {} = props;

  const { presentHiringInModal } = useSelector((state) => state.bigCalendar);
  const { presentHiringOutModal } = useSelector((state) => state.bigCalendar);

  const { hireCalendarHiring } = useSelector((state) => state.calendar);
  const { hireCalendarHiringOut } = useSelector((state) => state.calendar);

  const [hiringIn, setHiringIn] = useState([]);
  const [hiringOut, setHiringOut] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (hireCalendarHiring.length > 0) {
      let hiringInTempArr = [];
      for (let i = 0; i < hireCalendarHiring.length; i++) {
        hiringInTempArr.push({
          id: hireCalendarHiring[i].id,
          itemId: hireCalendarHiring[i].item.id,
          title: `In: Product Ref: ${hireCalendarHiring[i].item.name}`,
          start: new Date(hireCalendarHiring[i].start_date),
          end: new Date(hireCalendarHiring[i].end_date),
          address1: hireCalendarHiring[i].item.owner.address_line_1,
          address2: hireCalendarHiring[i].item.owner.address_line_2,
          city: hireCalendarHiring[i].item.owner.city,
          email: hireCalendarHiring[i].item.owner.email,
          postcode: hireCalendarHiring[i].delivery.post_code,
          providedBy: hireCalendarHiring[i].item.provided_by,
          phoneNumber: hireCalendarHiring[i].item.owner.phone_number,
        });
      }

      // console.log("hiringInTempArr ==> ", hiringInTempArr);
      setHiringIn(hiringInTempArr);
    }
  }, [hireCalendarHiring]);

  useEffect(() => {
    if (hireCalendarHiringOut.length > 0) {
      let hiringOutTempArr = [];
      for (let i = 0; i < hireCalendarHiringOut.length; i++) {
        hiringOutTempArr.push({
          id: hireCalendarHiringOut[i].id,
          itemId: hireCalendarHiringOut[i].item.id,
          title: `Out: Product Ref: ${hireCalendarHiringOut[i].item.name}`,
          start: new Date(hireCalendarHiringOut[i].start_date),
          end: new Date(hireCalendarHiringOut[i].end_date),
          address1: hireCalendarHiringOut[i].item.owner.address_line_1,
          address2: hireCalendarHiringOut[i].item.owner.address_line_2,
          city: hireCalendarHiringOut[i].item.owner.city,
          email: hireCalendarHiringOut[i].item.owner.email,
          postcode: hireCalendarHiringOut[i].delivery.post_code,
          providedBy: hireCalendarHiringOut[i].item.provided_by,
          phoneNumber: hireCalendarHiringOut[i].item.owner.phone_number,
        });
      }

      // console.log("hiringOutTempArr ==> ", hiringOutTempArr);
      setHiringOut(hiringOutTempArr);
    }
  }, [hireCalendarHiringOut]);

  useEffect(() => {
    if (hiringIn.length > 0 || hiringOut.length > 0) {
      const mergeResult = [...hiringIn, ...hiringOut];

      setEventsList(mergeResult);
    }
  }, [hiringIn, hiringOut]);

  // saveICSFileHandler
  const saveICSFileHandler = () => {
    if (eventsList.length > 0) {
      // Create the .ics URL
      let url = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:Cal_App//HireThat",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        // "TRIGGER:-PT15M",
        // "REPEAT:1",
        // "DURATION:PT15M",
        // "ACTION:DISPLAY",
        // "ATTENDEE:info@hirethat.com",
      ];

      for (let i = 0; i < eventsList.length; i++) {
        let inOrOut = eventsList[i].title.split(":")[0];
        let link =
          inOrOut === "In"
            ? `${process.env.REACT_APP_HT_URL}/view-hire/${eventsList[i].id}/${eventsList[i].itemId}`
            : `${process.env.REACT_APP_HT_URL}/view-advert/${eventsList[i].itemId}`;

        url.push(
          "BEGIN:VEVENT",
          "DTSTART:" + formatDate(new Date(eventsList[i].start)),
          "DTEND:" + formatDate(new Date(eventsList[i].end)),
          "DTSTAMP:" + formatDate(new Date()),
          "UID:" + `infoIn.${i + formatDate(new Date())}@hirethat.com`,
          "CREATED:" + formatDate(new Date()),
          "LAST-MODIFIED:" + formatDate(new Date()),
          "SEQUENCE:0",
          "STATUS:CONFIRMED",
          "TRANSP:OPAQUE",
          "LOCATION:" + link,
          "SUMMARY:" + `${eventsList[i].title}`,
          "DESCRIPTION:" +
            `\\n${eventsList[i].providedBy}\\n${eventsList[i].address1}\\n${eventsList[i].city}\\n${eventsList[i].postcode}\\n${eventsList[i].email}\\n${eventsList[i].phoneNumber}`,
          "CLASS:PUBLIC",
          "END:VEVENT"
        );

        if (i === eventsList.length - 1) {
          url.push("END:VCALENDAR");
        }
      }

      // console.log("url ==> ", url);

      let finalURL = url.join("\n");
      console.log("finalURL ==> ", finalURL);

      let blob = new Blob([finalURL], { type: "text/calendar;charset=utf-8" });
      // console.log("blob ==> ", blob);

      if (/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)) {
        // Open / Save link in IE and Edge

        console.log("==== IF ====");
        window.navigator.msSaveBlob(blob, "calendar.ics");
        //
      } else {
        // Open / Save link in Modern Browsers

        console.log(
          "==== ELSE ====",
          encodeURI("data:text/calendar;charset=utf8," + finalURL)
        );

        window.open(encodeURI("data:text/calendar;charset=utf8," + finalURL));
      }
    }
  };

  // selectedEventHandler
  const selectedEventHandler = (event) => {
    if (event.title.includes("In")) {
      console.log("IN ==> ", event);
      dispatch(showHiringInModal(event));
    }

    if (event.title.includes("Out")) {
      console.log("OUT ==> ", event);
      dispatch(showHiringOutModal(event));
    }
  };

  // eventPropGetterHandler
  const eventPropGetterHandler = useCallback(
    (event, start, end, isSelected) => ({
      ...(event.title.includes("In") && {
        className: "orange-color",
      }),

      ...(event.title.includes("Out") && {
        className: "black-color",
      }),
    }),
    []
  );

  console.log("eventsList ==> ", eventsList);
  return (
    <>
      <h2 className="title-user-settings">
        <b>Hiring Calendar</b>
      </h2>
      <div className="row mb-4">
        <p className="my-4 col-md-8">See the kit you’re hiring in and hiring out.</p>
        <div className="px-3 col-lg-4 col-12 mb-4">        {eventsList.length > 0 && (

          <button
          type="button"
          className="btn btn-user-settings-btn float-right flamabold " onClick={saveICSFileHandler}>DOWNLOAD .ICS FILE</button>
        )}
        </div>
      </div>

      <div className="card card-user-settings">
        <div className="card-body py-5 px-4 mx-3">
          <div style={{ height: 700 }}>
            <Calendar
              localizer={localizer}
              popup
              selected={null}
              events={eventsList}
              startAccessor="start"
              endAccessor="end"
              // view="month"
              views={["month", "week", "day"]}
              tooltipAccessor={(e) => e.title}
              eventPropGetter={eventPropGetterHandler}
              onSelectEvent={selectedEventHandler}
              style={{ height: 700, width: 700 }}
              // onShowMore={(more) => console.log("onShowMore ==> ", more)}
              // onNavigate={(date) => console.log("onNavigate ==> ", date)}
            />
          </div>
        </div>
      </div>

      {presentHiringInModal && <HiringInCalendarModal />}

      {presentHiringOutModal && <HiringOutCalendarModal />}

      <p className="pt-3 pr-4 inline-block">
        <span className="rect orange-color" /> In
      </p>

      <p className="pt-3 inline-block">
        <span className="rect black-color" /> Out
      </p>
    </>
  );
};

export { HireCalendar };
