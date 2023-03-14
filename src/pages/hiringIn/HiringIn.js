import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./HiringIn.css";
import { HireFilter } from "../../constants";
import {
  changeTwoDatesToFormattedDate,
  findNumberOfDaysFromTwoDates,
} from "../../utils";

import { useSelector, useDispatch } from "react-redux";
import { hiringInListApi } from "../../toolkit/features/HireSlice";

const HiringIn = (props) => {
  const {} = props;

  const { hiringInList } = useSelector((state) => state.hire);
  const { from } = useSelector((state) => state.hire.hiringInMeta);
  const { to } = useSelector((state) => state.hire.hiringInMeta);
  const { total } = useSelector((state) => state.hire.hiringInMeta);
  const { last_page } = useSelector((state) => state.hire.hiringInMeta);
  const { current_page } = useSelector((state) => state.hire.hiringInMeta);
  const { hiringInListApiIncPaginationEnabled } = useSelector(
    (state) => state.hire
  );
  const { hiringInListApiDecPaginationEnabled } = useSelector(
    (state) => state.hire
  );

  const [hiringInSort, setHiringInSort] = useState("");
  const [displayHiringInList, setDisplayHiringInList] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // set hiringInList on to displayHiringInList
  useEffect(() => {
    if (hiringInList.length > 0) {
      setDisplayHiringInList(hiringInList);
    }

    if (hiringInList.length < 1) {
      setDisplayHiringInList([]);
    }
  }, [hiringInList]);

  // filterTypeHandler
  const filterTypeHandler = (e) => {
    setHiringInSort(e.target.innerText);

    if (e.target.innerText != "") {
      let arrayForSort = [...hiringInList];

      if (e.target.innerText === "Ascending (Total Price)") {
        let ascendingSort = arrayForSort.sort(
          (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price)
        );

        // console.log("ascendingSort ==> ", ascendingSort);
        setDisplayHiringInList(ascendingSort);
      }

      if (e.target.innerText === "Descending (Total Price)") {
        let descendingSort = arrayForSort.sort(
          (a, b) => b.total_price - a.total_price
        );

        // console.log("descendingSort ==> ", descendingSort);
        setDisplayHiringInList(descendingSort);
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
        setDisplayHiringInList(alphabeticalSort);
      }
    }
  };

  // hiringInSingleSelectHandler
  const hiringInSingleSelectHandler = (item) => {
    // console.log("item ==> ", item);

    navigate(`/view-hire/${item.id}/${item.item.id}`);
  };

  // decPaginationNumberHandler
  const decPaginationNumberHandler = () => {
    if (hiringInListApiDecPaginationEnabled) {
      dispatch(hiringInListApi(current_page - 1));
    }
  };

  // paginationNumberHandler
  const paginationNumberHandler = (number) => {
    dispatch(hiringInListApi(number));
  };

  // incPaginationNumberHandler
  const incPaginationNumberHandler = () => {
    if (hiringInListApiIncPaginationEnabled) {
      dispatch(hiringInListApi(current_page + 1));
    }
  };

  const hiringInListRender =
    displayHiringInList.length > 0
      ? displayHiringInList.map((obj, index) => {
          return (
            <div
              key={index}
              onClick={hiringInSingleSelectHandler.bind(this, obj)}
            >
              <div className="row pointer">
                {/* img */}
                <div className="col-12 col-xl-3 col-md-12">
                  <img src={obj.item.main_image} className="img-hiring-in" />
                </div>

                {/* text */}
                <div className="col-12 col-xl-9 col-md-12">
                  <h4 className="my-3">
                    <b>{obj.item.name}</b>
                  </h4>

                  <div className="row">
                    <div className="col-6 col-md-4 col-lg-3">
                      <a className="a-hiring-in">
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

                  <div className="rounded-circle circle-btn circle-grey-hiring-in inline-block-hiring-in">
                    <i className="fa fa-user-o" aria-hidden="true" />
                  </div>

                  <div className="inline-block-hiring-in pl-2 ml-1">
                    <span className="small-hiring-in">provided by </span>
                    <p className="flamabold">{obj.item.provided_by}</p>
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
    <div className="card card-hiring-in">
      <div className="card-body p-4 m-3">
        <div className="row">
          <div className="col-lg-8 col-12">
            <h2 className="title-hiring-in mb-3">
              <b>Hiring In</b>
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
                  {hiringInSort == null || hiringInSort == ""
                    ? "Sort"
                    : hiringInSort}
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

        {hiringInListRender}

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

export { HiringIn };
