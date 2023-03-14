import React, { useState, useEffect } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import "./BuyEnquire.css";
import { getObjectLength } from "../../utils";

import { useSelector, useDispatch } from "react-redux";
import { sendEmailApi } from "../../toolkit/features/BuySlice";

const BuyEnquire = (props) => {
  const {} = props;

  const { user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (getObjectLength(user) != 0) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
    }
  }, [user]);

  // messageSetHandler
  const messageSetHandler = (message) => {
    let textLength = message.length;

    if (textLength < 256) {
      setMessage(message);
      setMessageLength(message.length);
    }
  };

  // sendEmailHandler
  const sendEmailHandler = (e) => {
    e.preventDefault();

    let obj = {
      navigate: navigate,
      item_id: state,
      message: message,
    };

    // console.log("obj ==> ", obj);
    dispatch(sendEmailApi(obj));
  };

  return (
    <div className="container">
      <div className="row py-4">
        <a
          className="a-enquiry a-underline pl-3 mt-5 pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back to Buy
        </a>

        <form onSubmit={sendEmailHandler}>
          <div className="col-12 pt-4">
            <div className="card card-enquiry">
              <div className="card-body p-4 m-2">
                <h2 className="title-enquiry">
                  <b>Enquiry Regarding</b>
                </h2>

                <div className="container p-0">
                  {/* Account Info */}
                  <div className="row pb-3">
                    <div className="col-12">
                      <h5 className="pb-4">
                        <b>digger hire</b>
                      </h5>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12">
                      <div className="form-input">
                        <label htmlFor="labelName">First Name*</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox disabled"
                          placeholder="Eg. Regan"
                          name="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={true}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 pt-md-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">Last Name*</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox disabled"
                          placeholder="Eg. Timalsina"
                          name="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={true}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-12 pt-lg-0 pt-3">
                      <div className="form-input">
                        <label htmlFor="labelName">Email*</label>

                        <br />

                        <input
                          type="text"
                          className="txtbox disabled"
                          placeholder="Eg. timsina.regan@gmail.com"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={true}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 pt-lg-0 pt-3">
                      <label htmlFor="labelName">
                        Include a message
                        <span className="light-enquiry">: (optional)</span>
                      </label>

                      <span className="float-right">{messageLength} / 255</span>

                      <textarea
                        // rows={5}
                        // cols={5}
                        value={message}
                        onChange={(e) => messageSetHandler(e.target.value)}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <p>
                    Enter what you'd like to know. For example, you could ask
                    for more details about
                    <span className="light-enquiry">&nbsp;digger hire&nbsp;</span>
                    or more photos.
                  </p>

                  <p>
                    By hitting "Send Email" you're happy for us to create an
                    account and pass your details to the seller and their
                    third-party data processors.
                  </p>

                  <p>
                    Read our&nbsp;
                    <a
                      className="orange"
                      href="https://hirethat.com/privacy-policy/"
                      hrefLang="en"
                      referrerPolicy="no-referrer"
                      rel="noreferrer"
                      target={"_blank"}
                    >
                      {`Privacy Policy`}
                    </a>
                    &nbsp;to see what we do with your personal information and how we
                    keep it secure.
                  </p>

                  <hr className="my-4" />

                  <div className="container-fluid">
                    <div className="row pb-3">
                      <div className="col-xl-2 col-lg-3 col-md-4 col-12 pr-md-3 p-0">
                        <button
                          className="btn btn-enquiry"
                          type="submit"
                          value="Submit"
                        >
                          SEND EMAIL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { BuyEnquire };
