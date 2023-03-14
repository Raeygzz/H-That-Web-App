import React, { useEffect } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./MyAdverts.css";
import { conditionCheck } from "../../shared/models";
import { formatToSentenceDateWithsufix } from "../../utils";

import { useSelector, useDispatch } from "react-redux";
import {
  advertListApi,
  // advertByIdApi,
  advertDeleteSuccess,
} from "../../toolkit/features/AdvertsSlice";
// import { calendarUnavailableDateListApi } from "../../toolkit/features/CalendarSlice";

const MyAdverts = (props) => {
  const {} = props;

  const { email } = useSelector((state) => state.auth.user);
  const { advertList } = useSelector((state) => state.adverts);
  const { from } = useSelector((state) => state.adverts.advertMeta);
  const { to } = useSelector((state) => state.adverts.advertMeta);
  const { total } = useSelector((state) => state.adverts.advertMeta);
  const { last_page } = useSelector((state) => state.adverts.advertMeta);
  const { has_primary_address } = useSelector((state) => state.auth.user);
  const { has_business_profile } = useSelector((state) => state.auth.user);
  const { current_page } = useSelector((state) => state.adverts.advertMeta);
  const { advertListApiIncPaginationEnabled } = useSelector(
    (state) => state.adverts
  );
  const { advertListApiDecPaginationEnabled } = useSelector(
    (state) => state.adverts
  );
  const { singleAdvert } = useSelector((state) => state.adverts);
  const { deleteAdvertSuccess } = useSelector((state) => state.adverts);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (deleteAdvertSuccess) {
      if (singleAdvert.is_for_sale === 1) {
        toast("Weekly sales charge will be stopped for this item", {
          rtl: false,
          theme: "dark",
          draggable: true,
          autoClose: 3000,
          newestOnTop: true,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          position: "top-right",
          hideProgressBar: false,
          pauseOnFocusLoss: false,
        });
      }

      dispatch(advertDeleteSuccess(false));
    }
  }, [deleteAdvertSuccess]);

  const placeNewAdvertHandler = () => {
    conditionCheck(navigate, email, has_primary_address, has_business_profile);
  };

  const advertClickedHandler = (obj) => {
    navigate(`/view-advert/${obj.id}`, {
      state: "MyAdverts",
    });

    // let objReq = {
    //   navigate: navigate,
    //   from: "MyAdverts",
    //   id: obj.id,
    // };

    // dispatch(advertByIdApi(objReq));
    // dispatch(calendarUnavailableDateListApi(obj.id));
  };

  // decPaginationNumberHandler
  const decPaginationNumberHandler = () => {
    if (advertListApiDecPaginationEnabled) {
      dispatch(advertListApi(current_page - 1));
    }
  };

  // paginationNumberHandler
  const paginationNumberHandler = (number) => {
    dispatch(advertListApi(number));
  };

  // incPaginationNumberHandler
  const incPaginationNumberHandler = () => {
    if (advertListApiIncPaginationEnabled) {
      dispatch(advertListApi(current_page + 1));
    }
  };

  const myAdvertsList =
    advertList.length > 0
      ? advertList.map((obj, index) => {
          return (
            <div key={index} onClick={advertClickedHandler.bind(this, obj)}>
              <hr className="my-4" />
              <div className="row pointer">
                <div className="col-12 col-xl-3 col-md-12">
                  <div className={obj.pause === 1 ? "hazy" : ""}>
                    <img
                      src={obj.main_image}
                      alt="tractor"
                      className="img-my-advert"
                    />
                  </div>

                  {obj.pause === 1 && (
                    <div className="paused">
                      <i className="fa fa-pause" aria-hidden="true"></i>
                      &nbsp; Paused
                    </div>
                  )}
                </div>

                <div className="col-12 col-xl-9 col-md-12">
                  <div className={obj.pause === 1 ? "hazy" : ""}>
                    <h4 className="my-3">
                      <b>{obj.name}</b>
                    </h4>

                    <p>
                      <a href="#" className="a-my-advert">
                        <b>
                          <i className="fa fa-calendar" aria-hidden="true" />{" "}
                          &nbsp;
                        </b>
                      </a>

                      {`Posted on ${formatToSentenceDateWithsufix(
                        obj.created_at
                      )}`}
                    </p>

                    {obj.is_for_hire === 1 && (
                      <div className="row">
                        <div className="col-lg-4 col-7 light-my-advert">
                          Hire Price
                        </div>

                        <div className="col-lg-4 col-5">
                          <b>{`From £${
                            obj?.least_price !== null ? obj?.least_price : ""
                          }`}</b>
                        </div>
                      </div>
                    )}

                    {obj.is_for_hire === 0 && obj.is_for_sale === 1 && (
                      <div className="row">
                        <div className="col-lg-4 col-7 light-my-advert">
                          Sale Price
                        </div>

                        <div className="col-lg-4 col-5">
                          <b>{`From £${
                            obj?.selling_price !== null
                              ? obj?.selling_price
                              : ""
                          }`}</b>
                        </div>
                      </div>
                    )}

                    <div className="row">
                      <div className="col-lg-4 col-7 light-my-advert">
                        Advertised for sale
                      </div>

                      <div className="col-lg-4 col-5">
                        <b>{obj.is_for_sale === 1 ? "Yes" : "No"}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      : null;

  // total pagination
  const lastPage = last_page ?? 0;
  const numberOfPagination =
    lastPage > 0
      ? [...Array(lastPage)].map((obj, index) => {
          return (
            <li
              className={`page-item ${
                current_page == index + 1 ? "active" : "inactive"
              }`}
              key={index}
              onClick={paginationNumberHandler.bind(this, index + 1)}
            >
              <a className="page-link">{index + 1}</a>
            </li>
          );
        })
      : null;
  return (
    <div className="card card-my-advert">
      <div className="card-body pb-0 mb-0 m-3">
        {/* My Adverts */}
        <div className="row">
          <div className="col-lg-8 col-12">
            <h2 className="title-my-advert mb-3">
              <b>My Adverts</b>
            </h2>

            {from != undefined && (
              <p className="mb-0">{`Showing ${from}-${to} of ${total} items`}</p>
            )}
          </div>
          <div className="col-lg-4 col-12">
            <a
              className="btn btn-my-advert flamabold mt-lg-0 mt-4"
              onClick={placeNewAdvertHandler}
            >
              PLACE A NEW ADVERT
            </a>
          </div>
        </div>

        {myAdvertsList}

        <hr className="my-4" />

        <ul className="pagination mt-4">
          <li
            className={`page-item disabled ${
              total < 15 ? "pointer-not-allowed" : ""
            }`}
            onClick={decPaginationNumberHandler}
          >
            <span className="page-link">Previous</span>
          </li>

          {numberOfPagination}

          <li
            className={`page-item disabled ${
              total < 15 ? "pointer-not-allowed" : ""
            }`}
            onClick={incPaginationNumberHandler}
          >
            <span className="page-link">Next</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export { MyAdverts };
