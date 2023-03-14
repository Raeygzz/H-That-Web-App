import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./HiringOut.css";
import { HireFilter } from "../../constants";
import {
  changeTwoDatesToFormattedDate,
  findNumberOfDaysFromTwoDates,
} from "../../utils";

import { useSelector, useDispatch } from "react-redux";
// import { advertByIdApi } from "../../toolkit/features/AdvertsSlice";
import {
  hiringOutListApi,
  singleHiringItem,
} from "../../toolkit/features/HireSlice";

const HiringOut = (props) => {
  const {} = props;

  const { hiringOutList } = useSelector((state) => state.hire);
  const { from } = useSelector((state) => state.hire.hiringOutMeta);
  const { to } = useSelector((state) => state.hire.hiringOutMeta);
  const { total } = useSelector((state) => state.hire.hiringOutMeta);
  const { last_page } = useSelector((state) => state.hire.hiringOutMeta);
  const { current_page } = useSelector((state) => state.hire.hiringOutMeta);
  const { hiringOutListApiIncPaginationEnabled } = useSelector(
    (state) => state.hire
  );
  const { hiringOutListApiDecPaginationEnabled } = useSelector(
    (state) => state.hire
  );

  const [hiringOutSort, setHiringOutSort] = useState("");
  const [displayHiringOutList, setDisplayHiringOutList] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // set hiringOutList on to displayHiringOutList
  useEffect(() => {
    if (hiringOutList.length > 0) {
      setDisplayHiringOutList(hiringOutList);
    }

    if (hiringOutList.length < 1) {
      setDisplayHiringOutList([]);
    }
  }, [hiringOutList]);

  // filterTypeHandler
  const filterTypeHandler = (e) => {
    setHiringOutSort(e.target.innerText);

    if (e.target.innerText != "") {
      let arrayForSort = [...hiringOutList];

      if (e.target.innerText === "Ascending (Total Price)") {
        let ascendingSort = arrayForSort.sort(
          (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price)
        );

        // console.log("ascendingSort ==> ", ascendingSort);
        setDisplayHiringOutList(ascendingSort);
      }

      if (e.target.innerText === "Descending (Total Price)") {
        let descendingSort = arrayForSort.sort(
          (a, b) => b.total_price - a.total_price
        );

        // console.log("descendingSort ==> ", descendingSort);
        setDisplayHiringOutList(descendingSort);
      }

      if (e.target.innerText === "Alphabetical Order") {
        let alphabeticalSort = arrayForSort.sort(function (a, b) {
          let firstItem = a.item.name.toLowerCase();
          let secondItem = b.item.name.toLowerCase();

          if (firstItem < secondItem) return -1;
          if (firstItem > secondItem) return 1;
          return 0;
        });

        // console.log("alphabeticalSort ==> ", alphabeticalSort);
        setDisplayHiringOutList(alphabeticalSort);
      }
    }
  };

  const hiringOutSingleSelectHandler = (item) => {
    dispatch(singleHiringItem(item));

    navigate(`/view-advert/${item.item.id}`, {
      state: "HiringOut",
    });

    // let obj = {
    //   navigate: navigate,
    //   from: "HiringOut",
    //   id: item.item.id,
    // };

    // dispatch(advertByIdApi(obj));
  };

  // decPaginationNumberHandler
  const decPaginationNumberHandler = () => {
    if (hiringOutListApiDecPaginationEnabled) {
      dispatch(hiringOutListApi(current_page - 1));
    }
  };

  // paginationNumberHandler
  const paginationNumberHandler = (number) => {
    dispatch(hiringOutListApi(number));
  };

  // incPaginationNumberHandler
  const incPaginationNumberHandler = () => {
    if (hiringOutListApiIncPaginationEnabled) {
      dispatch(hiringOutListApi(current_page + 1));
    }
  };

  const hiringOutListRender =
    displayHiringOutList.length > 0
      ? displayHiringOutList.map((obj, index) => {
          return (
            <div
              key={index}
              onClick={hiringOutSingleSelectHandler.bind(this, obj)}
            >
              <div className="row pointer">
                {/* img */}
                <div className="col-12 col-xl-3 col-md-12">
                  <img
                    src={obj.item.main_image}
                    alt="tractor"
                    className="img-hiring-out"
                  />
                </div>

                {/* text */}
                <div className="col-12 col-xl-9 col-md-12">
                  <h4 className="my-3">
                    <b>{obj.item.name}</b>
                  </h4>

                  <div className="row">
                    <div className="col-6 col-md-4 col-lg-3">
                      <a href="#" className="a-hiring-out">
                        <b>
                          <i className="fa fa-calendar" aria-hidden="true" />
                        </b>
                      </a>
                      &nbsp;{" "}
                      {changeTwoDatesToFormattedDate(
                        obj.start_date,
                        obj.end_date
                      )}
                    </div>

                    <div className="col-4 orange-no-pointer">{`${findNumberOfDaysFromTwoDates(
                      obj.start_date,
                      obj.end_date
                    )} days`}</div>
                  </div>

                  <div className="dotted-border" />

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="rounded-circle circle-btn circle-grey-hiring-out inline-block-hiring-out">
                        <i className="fa fa-user-o" aria-hidden="true" />
                      </div>

                      <div className="inline-block-hiring-out pl-2 ml-1">
                        <span className="small-hiring-out">Hired by</span>
                        <p className="flamabold">{obj.hiree.name}</p>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 pl-5 pl-md-0">
                      <div className="inline-block-hiring-out pl-2 ml-1">
                        <span className="small-hiring-out">
                          Collection type{" "}
                        </span>
                        <br />
                        <p className="flamabold inline-block-hiring-out">
                          {obj.collection_type.charAt(0).toUpperCase() +
                            obj.collection_type.slice(1)}
                        </p>
                        &nbsp;
                        <span className="orange-no-pointer">
                          {obj.delivery.post_code}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
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
    <div className="card card-hiring-out">
      <div className="card-body p-4 m-3">
        {/* Hiring Out */}
        <div className="row">
          <div className="col-lg-8 col-12">
            <h2 className="title-hiring-out mb-3">
              <b>Hiring Out</b>
            </h2>

            {from != undefined && (
              <p className="mb-0">{`Showing ${from}-${to} of ${total} items`}</p>
            )}
          </div>

          <div className="col-lg-4 col-12">
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-default btn-block border py-2 text-left"
                data-toggle="dropdown"
              >
                <i
                  className="fa fa-sort orange-no-pointer"
                  aria-hidden="true"
                />

                <span className="pl-3 grey">
                  {hiringOutSort == null || hiringOutSort == ""
                    ? "Sort"
                    : hiringOutSort}
                </span>
              </button>

              <ul className="dropdown-menu">
                {HireFilter.map((obj, index) => {
                  return (
                    <li key={index} onClick={filterTypeHandler}>
                      <a>{obj.label}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {hiringOutListRender}

        <hr className="my-4" />

        {/* pagination */}
        <nav className="container">
          <ul className="pagination">
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
              className={`page-item ${total < 15 ? "pointer-not-allowed" : ""}`}
              onClick={incPaginationNumberHandler}
            >
              <a className="page-link">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export { HiringOut };
