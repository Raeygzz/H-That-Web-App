import { differenceInCalendarDays } from "date-fns";

import { Month, MonthShortcut } from "../constants";

//Length of Object
export const getObjectLength = (obj) => {
  if (obj != null && obj != "") {
    var count = Object.keys(obj).length;
    return parseInt(count);
  } else {
    return 0;
  }
};

// firstNameFromFullName
export const firstNameFromFullName = (fullName) => {
  let firstName = fullName
    .split(" ")
    .map((item) => item.trim())
    .filter((obj) => obj != "")[0];

  return firstName;
};

// lastNameFromFullName
export const lastNameFromFullName = (fullName) => {
  let lastName = fullName
    .split(" ")
    .map((item) => item.trim())
    .filter((obj) => obj != "")[1];

  return lastName;
};

//Get Years
export const getYears = () => {
  let startingDate = 1985;

  const currentYear = new Date().getFullYear();

  const diffInYear = currentYear - startingDate;

  const yearsArr = [];

  for (let i = 0; i <= diffInYear; i++) {
    const newDate = (currentYear - i).toString();
    yearsArr.push({ id: i.toString(), label: newDate, value: newDate });
  }

  let Years = Object.assign([], yearsArr);

  Years.unshift({ id: "-1", label: "--Select--", value: "" });

  // console.log('Years ==> ', Years);

  return Years;
};

// format date (2020-11-25 12:36:14) to sentence date i.e, September 14th
export const formatToSentenceDateWithsufix = (sentenceDate) => {
  if (sentenceDate != "") {
    let dateParam = sentenceDate.split(/[\s-:]/);
    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();

    let monthNum = new Date(...dateParam).getMonth();
    const month = Month[monthNum];

    let date = new Date(...dateParam).getDate().toString();

    if (date === "1" || date === "01") {
      date = date + "st";
    } else if (date === "2" || date === "02") {
      date = date + "nd";
    } else if (date === "3" || date === "03") {
      date = date + "rd";
    } else {
      date = date + "th";
    }

    return month + " " + date;
  }
};

// Get the number of calendar days between the given dates.
export const isSameDay = (recuringDate, selectedDate) => {
  // console.log("recuringDate ==> ", recuringDate);
  // console.log("selectedDate ==> ", selectedDate);
  // console.log("differenceInCalendarDays ==> ", differenceInCalendarDays(recuringDate, selectedDate) === 0);

  return differenceInCalendarDays(recuringDate, selectedDate) === 0;
};

// format dates 2020-09-09 and 2020-09-13 to formated date i.e, 9th - 13th Sept
export const changeTwoDatesToFormattedDate = (startDate, endDate) => {
  if (startDate != "" && endDate != "") {
    let start_date = startDate + " " + "00:00:00";
    let end_date = endDate + " " + "00:00:00";

    let startDateParam = start_date.split(/[\s-:]/);
    startDateParam[1] = (parseInt(startDateParam[1], 10) - 1).toString();

    let endDateParam = end_date.split(/[\s-:]/);
    endDateParam[1] = (parseInt(endDateParam[1], 10) - 1).toString();

    let startDateMonthNum = new Date(...startDateParam).getMonth();
    let monthSD = MonthShortcut[startDateMonthNum];

    let endDateMonthNum = new Date(...endDateParam).getMonth();
    let monthED = MonthShortcut[endDateMonthNum];

    let SDate = new Date(...startDateParam).getDate().toString();
    let EDate = new Date(...endDateParam).getDate().toString();

    let formatedDate = `${SDate}${
      monthSD != monthED ? " " + monthSD : ""
    } - ${EDate} ${monthED}`;
    return formatedDate;
  }
};

// Find number of days from two full date i.e, startDate 2021-01-27 & endDate 2021-01-27
export const findNumberOfDaysFromTwoDates = (startDate, endDate) => {
  if (startDate != "" && endDate != "") {
    let start_date = new Date(startDate);
    let end_date = new Date(endDate);

    let timeDiff = end_date.getTime() - start_date.getTime();

    let numberOfDays = timeDiff / (1000 * 60 * 60 * 24);

    // console.log('numberOfDays ==> ', numberOfDays);

    return numberOfDays === 0 ? 1 : numberOfDays + 1;
  }
};

// card number last - 4 digit only display
export const cardLastFourDigitDisplay = (cardNumber) => {
  let cardLengthWithoutLast4Digit = 8;
  let res = cardNumber;
  let starText = "";

  for (let i = 0; i < cardLengthWithoutLast4Digit; i++) {
    starText += "*";
  }

  let cardNumberWithStar = starText + res;
  let cardNumberFormat = cardNumberWithStar.match(/.{1,4}/g);

  return cardNumberFormat.join(" ");
};

// condition to make cancel hiring button(true or false)
export const cancelHiringButton = (startDate) => {
  // console.log("startDate ==> ", startDate);

  let currentDate = new Date().getTime();
  let hiringStartDate = new Date(startDate).getTime();

  let disableCancelHiringButton = hiringStartDate - currentDate;
  // console.log("disableCancelHiringButton ==> ", disableCancelHiringButton);

  let disablCancelHiring = disableCancelHiringButton < 0 ? true : false;
  // console.log("disablCancelHiring ==> ", disablCancelHiring);

  return disablCancelHiring;
};

// format date to ISO
export const formatDate = (dateString) => {
  // console.log("dateString ==> ", dateString);

  let dateTime = new Date(dateString);
  // console.log("dateTime ==> ", dateTime);

  // console.log("getUTCFullYear ==> ", dateTime.getUTCFullYear());
  // console.log("getUTCMonth ==> ", pad(dateTime.getUTCMonth() + 1));
  // console.log("getUTCDate ==> ", pad(dateTime.getUTCDate()));
  // console.log("getHours ==> ", pad(dateTime.getUTCHours()));
  // console.log("getMinutes ==> ", pad(dateTime.getUTCMinutes()) + "00Z");

  return [
    dateTime.getUTCFullYear(),
    pad(dateTime.getUTCMonth() + 1),
    pad(dateTime.getUTCDate()),
    "T",
    pad(dateTime.getUTCHours()),
    pad(dateTime.getUTCMinutes()) + "00Z",
  ].join("");
};

// if number is less than 10 add 0
export const pad = (num) => {
  // Ensure date values are double digits
  return num < 10 ? "0" + num : num;
};
