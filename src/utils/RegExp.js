// const EmailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

// const MobileNumberPattern = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const DigitsOnly = /^\d+$/;

const DigitAndDecimalsOnly = /^(0|[1-9]\d*)(\.\d+)?$/;

const MatchWhiteSpaceChar = /\s/;

const PasswordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[\W_]).{8,16}$/;

const EmailPattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// const UKMobileNumberPattern = /(07\d{9}|447\d{9})$/;
const UKMobileNumberPattern =
  /((\+44\s?\(0\)\s?\d{2,4})|(\+44\s?(01|02|03|07|08)\d{2,3})|(\+44\s?(1|2|3|7|8)\d{2,3})|(\(\+44\)\s?\d{3,4})|(\(\d{5}\))|((01|02|03|07|08)\d{2,3})|(\d{5}))(\s|-|.)(((\d{3,4})(\s|-)(\d{3,4}))|((\d{6,7})))/;

const RegExp = {
  DigitsOnly,
  EmailPattern,
  PasswordPattern,
  MatchWhiteSpaceChar,
  DigitAndDecimalsOnly,
  UKMobileNumberPattern,
};

export { RegExp };
