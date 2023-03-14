import React from "react";

import Calendar from "react-calendar";
import { format, parseISO } from "date-fns";

import "./HTCalendar.css";
import { isSameDay } from "../../../utils";

const HTCalendar = (props) => {
  const {
    confirmDatesDisplay,
    // confirmDatesDisplayFromHireConfirm,
    numberOfSelectedCalendarDates,
    selectedDatesDisplay,
    nowUnavailableDates,
    onChange,
  } = props;

  // console.log(
  //   "confirmDatesDisplayFromHireConfirm ==> ",
  //   confirmDatesDisplayFromHireConfirm
  // );
  return (
    <Calendar
      minDetail="month"
      defaultView="month"
      minDate={new Date()}
      prev2Label={null}
      prev2AriaLabel=""
      next2Label={null}
      next2AriaLabel=""
      tileDisabled={({ date, view }) => {
        // disable unavailable dates
        if (view === "month") {
          return (
            confirmDatesDisplay?.length > 0 &&
            confirmDatesDisplay.find((dDate) => {
              return isSameDay(parseISO(dDate), date);
            })
          );
        }
      }}
      tileClassName={({ activeStartDate, date, view }) => {
        // // enable cursor pointer
        // if (
        //   view === "month" &&
        //   confirmDatesDisplayFromHireConfirm?.length > 0 &&
        //   confirmDatesDisplayFromHireConfirm.find((BookedDate) => {
        //     let repeatedDate = format(new Date(date), "yyyy-MM-dd");
        //     // let findDate = format(new Date(BookedDate), "MM/dd/yyyy");
        //     //
        //     // console.log("findDate ==> ", findDate);
        //     // console.log("repeatedDate ==> ", repeatedDate);
        //     //
        //     console.log("date ==> ", repeatedDate);

        //     // console.log("date ==> ", date);
        //     // console.log("BookedDate ==> ", BookedDate);
        //     // console.log("isSameDay ==> ", isSameDay(BookedDate, date));
        //     //
        //     return BookedDate != repeatedDate;
        //     // return findDate === repeatedDate;
        //     // return isSameDay(BookedDate, date);
        //   })
        // ) {
        //   return "enable-pointer";
        // }

        // display date range
        if (
          view === "month" &&
          numberOfSelectedCalendarDates?.length > 0 &&
          numberOfSelectedCalendarDates.find((BookedDate) => {
            // let repeatedDate = format(new Date(date), "MM/dd/yyyy");
            // let findDate = format(new Date(BookedDate), "MM/dd/yyyy");
            //
            // console.log("findDate ==> ", findDate);
            // console.log("repeatedDate ==> ", repeatedDate);
            //
            // console.log("date ==> ", date);
            // console.log("BookedDate ==> ", BookedDate);
            // console.log("isSameDay ==> ", isSameDay(BookedDate, date));
            //
            // return findDate === repeatedDate;
            return isSameDay(BookedDate, date);
          })
        ) {
          return "marked_as_date_range";
        }

        // selected dates display
        if (
          view === "month" &&
          selectedDatesDisplay?.length > 0 &&
          selectedDatesDisplay.find((BookedDate) => {
            let repeatedDate = format(new Date(date), "yyyy-MM-dd");

            // console.log("BookedDate ==> ", BookedDate);
            // console.log("repeatedDate ==> ", repeatedDate);

            return repeatedDate === BookedDate;
          })
        ) {
          return "highlight";
        }

        // now unavailable dates
        if (
          view === "month" &&
          nowUnavailableDates?.length > 0 &&
          nowUnavailableDates.find((BookedDate) => {
            // console.log("date ==> ", date);
            // console.log("BookedDate ==> ", parseISO(BookedDate));
            // console.log("isSameDay ==> ", isSameDay(parseISO(BookedDate), date));

            return isSameDay(parseISO(BookedDate), date);
          })
        ) {
          return "highlight";
        }
      }}
      tileContent={({ activeStartDate, date, view }) => {
        // display customer booked dates
        if (
          view === "month" &&
          confirmDatesDisplay.length > 0 &&
          confirmDatesDisplay.find((BookedDate) =>
            isSameDay(parseISO(BookedDate), date)
          )
        ) {
          return <i className="highlight-dot"></i>;
        }
      }}
      onChange={(day) => onChange(day)}
    />
  );
};

export { HTCalendar };
