import React from "react";

import { useNavigate } from "react-router-dom";

import "./Footer.css";

function Footer(props) {
  const {} = props;

  const navigate = useNavigate();

  const logoClickedHandler = () => {
    navigate("/search-landing");
  };

  let currentYear = new Date().getFullYear();
  return (
    <footer className="page-footer font-small indigo p-5">
      <div className="container text-center text-md-left">
        <div className="row">
          <div className="col-12 text-center">
            <span onClick={logoClickedHandler}>
              <img
                className="footer-logo"
                src={require("../../../assets/images/logo.png")}
                alt="logo"
              />
            </span>

            <p className="footer-txt">
              © Copyright {currentYear} Hire That Ltd. |{" "}
              <a
                href="https://hirethat.com/terms-of-use/"
                hrefLang="en"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={"_blank"}
              >
                Terms And Conditions
              </a>{" "}
              |{" "}
              <a
                href="https://hirethat.com/privacy-policy/"
                hrefLang="en"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={"_blank"}
              >
                Privacy Policy
              </a>
            </p>

            <p className="footer-txt">
              Design &amp; Development By{" "}
              <a
                href="https://rokk.co.uk/"
                hrefLang="en"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                target={"_blank"}
              >
                Rokk
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
