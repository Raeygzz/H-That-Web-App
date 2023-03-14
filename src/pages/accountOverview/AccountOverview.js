import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./AccountOverview.css";
import { ItemShimmer, NoData } from "../../components/common";
import {
  formatToSentenceDateWithsufix,
  changeTwoDatesToFormattedDate,
  findNumberOfDaysFromTwoDates,
} from "../../utils";

import { useSelector, useDispatch } from "react-redux";
import { routeTo } from "../../toolkit/features/AddressSlice";
import {
  hiringInListApi,
  hiringOutListApi,
} from "../../toolkit/features/HireSlice";
import {
  advertListApi,
  // advertByIdApi,
} from "../../toolkit/features/AdvertsSlice";
// import { calendarUnavailableDateListApi } from "../../toolkit/features/CalendarSlice";

const AccountOverview = (props) => {
  const {} = props;

  const { hiringInList } = useSelector((state) => state.hire);
  const { hiringInListIsLoading } = useSelector((state) => state.hire);
  const hiringIn_from = useSelector((state) => state.hire.hiringInMeta.from);
  // const  hiringIn_to  = useSelector((state) => state.hire.hiringInMeta.to);
  const hiringIn_total = useSelector((state) => state.hire.hiringInMeta.total);

  const { hiringOutList } = useSelector((state) => state.hire);
  const { hiringOutListIsLoading } = useSelector((state) => state.hire);
  const hiringOut_from = useSelector((state) => state.hire.hiringOutMeta.from);
  // const  hiringOut_to  = useSelector((state) => state.hire.hiringOutMeta.to);
  const hiringOut_total = useSelector(
    (state) => state.hire.hiringOutMeta.total
  );

  const { advertList } = useSelector((state) => state.adverts);
  const { advertListIsLoading } = useSelector((state) => state.adverts);
  const advert_from = useSelector((state) => state.adverts.advertMeta.from);
  // const  advert_to  = useSelector((state) => state.adverts.advertMeta.to);
  const advert_total = useSelector((state) => state.adverts.advertMeta.total);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hiringInListApi(1));
    dispatch(hiringOutListApi(1));
    dispatch(advertListApi(1));
    dispatch(routeTo("account-overview"));
  }, []);

  const hiringInHandler = () => {
    dispatch(routeTo("hiring-in"));
    navigate("/my-account/hiring-in");
  };

  const hiringOutHandler = () => {
    dispatch(routeTo("hiring-out"));
    navigate("/my-account/hiring-out");
  };

  const myAdvertsHandler = () => {
    dispatch(routeTo("my-adverts"));
    navigate("/my-account/my-adverts");
  };

  const selectedAdvertHandler = (obj) => {
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

  // displayHiringInList
  const displayHiringInList =
    hiringInList.length > 0 ? (
      hiringInList.slice(0, 3).map((obj, index) => {
        return (
          <div key={index} className="col-lg-4 col-12 mb-4">
            <div className="card card-acc-overview pointer">
              <img
                className="card-img-top img-card-acc-overv"
                src={obj.item.main_image}
                alt="Card image"
                style={{ width: "100%" }}
              />
              <div className="card-body">
                <h6>
                  <b>{obj.item.name}</b>
                </h6>
                <a href="#" className="a-acc-overv">
                  <b>
                    <i className="fa fa-calendar" aria-hidden="true" />
                  </b>
                  &nbsp;
                </a>
                <span>
                  {changeTwoDatesToFormattedDate(obj.start_date, obj.end_date)}
                </span>
                <span className="a-acc-overv float-right">{`${findNumberOfDaysFromTwoDates(
                  obj.start_date,
                  obj.end_date
                )} days`}</span>
                <div className="dotted-border" />
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-9">
                      <p className="small-hiring-out mb-0">Provided by</p>
                      <h6>
                        <b>{obj.item.provided_by}</b>
                      </h6>
                    </div>
                    <div className="col-3">
                      <div className="rounded-circle circle-btn circle-grey-acc-overv d-inline-block">
                        <i
                          className="fa fa-user-o pt-2 mt-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <>
        {hiringInListIsLoading && <ItemShimmer />}

        {!hiringInListIsLoading && hiringInList.length == 0 && (
          <NoData
            firstMessage="You are not currently hiring any items in."
            anchorMessage="Click Here"
            lastMessage="to search for items to hire."
            navigateTo="/search-landing"
          />
        )}
      </>
    );

  // displayHiringOutList
  const displayHiringOutList =
    hiringOutList.length > 0 ? (
      hiringOutList.slice(0, 3).map((obj, index) => {
        return (
          <div key={index} className="col-lg-4 col-12 mb-4">
            <div className="card card-acc-overview pointer">
              <img
                className="card-img-top img-card-acc-overv"
                src={obj.item.main_image}
                alt="Card image"
                style={{ width: "100%" }}
              />
              <div className="card-body">
                <h6>
                  <b>{obj.item.name}</b>
                </h6>
                <a href="#" className="a-acc-overv">
                  <b>
                    <i className="fa fa-calendar" aria-hidden="true" />
                  </b>
                  &nbsp;
                </a>
                <span>
                  {changeTwoDatesToFormattedDate(obj.start_date, obj.end_date)}
                </span>
                <span className="a-acc-overv float-right">{`${findNumberOfDaysFromTwoDates(
                  obj.start_date,
                  obj.end_date
                )} days`}</span>
                <div className="dotted-border" />
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-9">
                      <p className="small-hiring-out mb-0">Hired by</p>
                      <h6>
                        <b>{obj.hiree.name}</b>
                      </h6>
                    </div>
                    <div className="col-3">
                      <div className="rounded-circle circle-btn circle-grey-acc-overv d-inline-block">
                        <i
                          className="fa fa-user-o pt-2 mt-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="small-hiring-out mb-0">Collection type</p>
                <h6>
                  <b>
                    {obj.collection_type.charAt(0).toUpperCase() +
                      obj.collection_type.slice(1)}
                  </b>
                  &nbsp;&nbsp;
                  <a href="#" className="a-acc-overv">
                    {obj.delivery.post_code.toUpperCase()}
                  </a>
                </h6>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <>
        {hiringOutListIsLoading && <ItemShimmer />}

        {!hiringOutListIsLoading && hiringOutList.length == 0 && (
          <NoData firstMessage="You are not currently hiring any items out." />
        )}
      </>
    );

  // displayAdvertList
  const displayAdvertList =
    advertList.length > 0 ? (
      advertList.slice(0, 3).map((obj, index) => {
        return (
          <div
            key={index}
            className="col-lg-4 col-12 mb-4"
            onClick={selectedAdvertHandler.bind(this, obj)}
          >
            <div className="card card-acc-overview pointer">
              <img
                className="card-img-top img-card-acc-overv"
                src={obj.main_image}
                alt="Card image"
                style={{ width: "100%" }}
              />
              <div className="card-body">
                <h6>
                  <b>{obj.name}</b>
                </h6>
                <a href="#" className="a-acc-overv">
                  <b>
                    <i className="fa fa-calendar" aria-hidden="true" />
                  </b>
                  &nbsp;
                </a>
                {/* <span>13 - 19 Dec</span> */}
                <span>{`Posted ${formatToSentenceDateWithsufix(
                  obj.created_at
                )}`}</span>
                {/* <span className="a-acc-overv float-right">7 Days</span> */}

                <div className="dotted-border" />

                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-9">
                      <p className="small-hiring-out mb-0">Hire price</p>
                      <h6>
                        <b>{`From £${
                          obj.least_price != null ? obj.least_price : ""
                        }`}</b>
                      </h6>

                      {/* <p className="small-hiring-out mb-0">Provided by</p>
                        <h6>
                          <b>_sam</b>
                        </h6> */}
                    </div>

                    {/* <div className="col-3">
                        <div className="rounded-circle circle-btn circle-grey-acc-overv d-inline-block">
                          <i
                            className="fa fa-user-o pt-2 mt-1"
                            aria-hidden="true"
                          />
                        </div>
                      </div> */}
                  </div>
                </div>

                <p className="small-hiring-out mb-0">For Sale</p>
                {/* <p className="small-hiring-out mb-0">Collection type</p> */}

                <h6>
                  <b>{obj.is_for_sale === 1 ? "Yes" : "No"}</b>&nbsp;&nbsp;
                  {/* <a href="#" className="a-acc-overv">
                      EX2 8UB
                    </a> */}
                </h6>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <>
        {advertListIsLoading && <ItemShimmer />}

        {!advertListIsLoading && advertList.length == 0 && (
          <NoData
            firstMessage="You currently have no adverts."
            anchorMessage="Click Here"
            lastMessage="to post one!"
            navigateTo="/post-advert"
          />
        )}
      </>
    );

  return (
    <div className="card card-acc-overv">
      <div className="card-body p-4 m-3">
        <h2 className="title-acc-overv">
          <b>Account Overview</b>
        </h2>

        {/* Hiring In */}
        <div className="row">
          <div className="col-12">
            <h5 className="pt-0">
              <b>Hiring In</b>
            </h5>
          </div>
        </div>
        {/* <div className="col-12 col-md-8">
              <lines className="shine"></lines>
            </div>
            <div className="d-none d-md-block col-4">
              <lines className="shine"></lines>
            </div>
          </div>

          <div className="row pt-3">
            <div className="col-12 col-md-4">
              <box className="shine"></box>
            </div>
            <div className="d-none d-md-block col-4">
              <box className="shine"></box>
            </div>
            <div className="d-none d-md-block col-4">
              <box className="shine"></box>
            </div> */}

        <div className="row">
          <div className="col-8">
            {hiringIn_from != undefined && (
              <p className="light-acc-overv">{`Showing ${hiringIn_from}-${
                hiringInList.length > 2 ? "3" : hiringInList.length
              } of ${hiringIn_total} items`}</p>
            )}
          </div>

          {hiringInList.length > 0 && (
            <div className="col-4">
              <a className="a-acc-overv float-right" onClick={hiringInHandler}>
                <b>View All</b>
              </a>
            </div>
          )}

          {displayHiringInList}
        </div>

        <hr className="mb-4" />

        {/* Hiring Out */}
        <div className="row">
          <div className="col-12">
            <h5 className="pt-0">
              <b>Hiring Out</b>
            </h5>
          </div>

          <div className="col-8">
            {hiringOut_from != undefined && (
              <p className="light-acc-overv">{`Showing ${hiringOut_from}-${
                hiringOutList.length > 2 ? "3" : hiringOutList.length
              } of ${hiringOut_total} items`}</p>
            )}
          </div>

          {hiringOutList.length > 0 && (
            <div className="col-4">
              <a className="a-acc-overv float-right" onClick={hiringOutHandler}>
                <b>View All</b>
              </a>
            </div>
          )}

          {displayHiringOutList}
        </div>

        <hr className="mb-4" />

        {/* My Adverts */}
        <div className="row">
          <div className="col-12">
            <h5 className="pt-0">
              <b>My Adverts</b>
            </h5>
          </div>

          <div className="col-8">
            {advert_from != undefined && (
              <p className="light-acc-overv">{`Showing ${advert_from}-${
                advertList.length > 2 ? "3" : advertList.length
              } of ${advert_total} items`}</p>
            )}
          </div>

          {advertList.length > 0 && (
            <div className="col-4">
              <a className="a-acc-overv float-right" onClick={myAdvertsHandler}>
                <b>View All</b>
              </a>
            </div>
          )}

          {displayAdvertList}
        </div>
      </div>
    </div>
  );
};

export { AccountOverview };
