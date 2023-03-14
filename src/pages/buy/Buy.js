import React, { useState, useEffect } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaRegUser, FaSearchPlus } from "react-icons/fa";

import "./Buy.css";
import { getObjectLength } from "../../utils";
import { SocialShare } from "../../shared/pages_common";
import { NeedFinanceModal } from "../../shared/pages_common/modal";

import { useSelector, useDispatch } from "react-redux";
import { hireItemByIdApi } from "../../toolkit/features/HireSlice";

const Buy = (props) => {
  const {} = props;

  const { singleHireItem } = useSelector((state) => state.hire);
  const [socialShare, setSocialShare] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [showNeedFinanceModal, setShowNeedFinanceModal] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (id != null) {
      dispatch(hireItemByIdApi(id));

      setSocialShare({
        ...socialShare,
        title: "HIRE THAT SHARE",
        url: `${process.env.REACT_APP_HT_URL}/buy/${id}`,
        text: "I FOUND SOMETHING OF INTEREST ON HIRE THAT!",
      });
    }
  }, [id]);

  const hireThisItem = () => {
    console.log("hireThisItem");
  };

  const needFinanceHandler = () => {
    setShowNeedFinanceModal(true);
  };

  const enquireToBuyHandler = () => {
    navigate("/buy-enquire", {
      state: singleHireItem.id,
    });
  };

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

            {/* <div className="rounded-circle circle-btn">
              <FaSearchPlus />
            </div> */}

            <div className="row">{galleryImage}</div>
          </div>

          <div className="col-md-7 col-12 pt-3">
            <h2>
              <b>{singleHireItem.name}</b>
            </h2>

            {/* <a className="rounded-circle circle-btn circle-orange">
              <FaShare />
            </a> */}

            <SocialShare
              socialShare={getObjectLength(socialShare) != 0 ? socialShare : ""}
            />

            <p>Buy this for</p>

            <div>
              <h4 className="d-inline-block">
                <b>{`£${singleHireItem.selling_price}`}</b>
              </h4>

              <a
                className="a-prod-hire orange ml-1"
                onClick={needFinanceHandler}
              >
                Need finance?
              </a>
            </div>

            {/* <p>
              Select the desired duration of your hire after clicking the button
              below:
            </p> */}

            <button
              type="button"
              className="btn btn-prod-hire flamabold mr-2 mb-md-0 mb-4"
              onClick={enquireToBuyHandler}
            >
              ENQUIRE TO BUY
            </button>

            {singleHireItem.is_for_hire != 0 && (
              <button
                type="button"
                className="btn btn-prod-hire btn-prod-secondary flamabold"
                onClick={hireThisItem}
              >
                OR HIRE THIS ITEM
              </button>
            )}

            <hr className="my-4" />

            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-12">
                  <div className="rounded-circle circle-btn circle-grey d-inline-block">
                    <FaRegUser />
                  </div>

                  <div className="d-inline-block pl-2 ml-1">
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
              <div className="row mb-3">
                <div className="col-6">
                  <span className="light-prod-hire">Make</span>
                  <p>{singleHireItem.make}</p>
                </div>

                <div className="col-6">
                  <span className="light-prod-hire">Model</span>
                  <p>{singleHireItem.model}</p>
                </div>
              </div>

              <div className="row mb-3">
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

              <div className="row mb-3">
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
                      <span className="light-prod-hire">Hours Used</span>
                      <p>{`${singleHireItem.hours_used} Hours`}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="row mb-3">
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
            {singleHireItem.length_mm != null ||
              singleHireItem.width_mm != null ||
              (singleHireItem.height_mm != null && (
                <p>
                  <b>Item Dimensions</b>
                </p>
              ))}

            <div className="container-fluid">
              <div className="row">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="banner py-3 w3-animate-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 col-md-8 col-12 mt-3">
              <p>
                Are you ready to buy the <b>{singleHireItem.name}</b>?
              </p>
            </div>

            <div className="col-lg-3 col-md-4 col-12 my-auto">
              <button
                type="button"
                className="btn btn-banner-prod btn-hire-confirm  flamabold"
                onClick={enquireToBuyHandler}
              >
                ENQUIRE TO BUY
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNeedFinanceModal && (
        <NeedFinanceModal
          cancelNeedFinanceModal={(val) => setShowNeedFinanceModal(val)}
        />
      )}
    </>
  );
};

export { Buy };
