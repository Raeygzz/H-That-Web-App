import React, { useState, useEffect } from "react";

import { FaArrowLeft, FaPoundSign } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";

import "./SearchResult.css";
import { getObjectLength } from "../../utils";
import { NoData } from "../../components/common";
import { Distance, SearchResultSort } from "../../constants";

import { useSelector, useDispatch } from "react-redux";
// import { hireItemByIdApi } from "../../toolkit/features/HireSlice";
import { subCategoriesApi } from "../../toolkit/features/CategoriesSlice";
// import { calendarUnavailableDateListApi } from "../../toolkit/features/CalendarSlice";
import {
  // searchItemApi,
  nearMeApi,
  filterSearchItemApi,
} from "../../toolkit/features/SearchLandingSlice";

const SearchResult = (props) => {
  const {} = props;

  const { items } = useSelector((state) => state.searchLanding);
  const { loadedApiName } = useSelector((state) => state.searchLanding);
  const { categoriesPickerList } = useSelector((state) => state.categories);
  const { subCategoriesPickerList } = useSelector((state) => state.categories);
  const { to } = useSelector((state) => state.searchLanding.itemsMeta);
  const { from } = useSelector((state) => state.searchLanding.itemsMeta);
  const { total } = useSelector((state) => state.searchLanding.itemsMeta);
  const { last_page } = useSelector((state) => state.searchLanding.itemsMeta);
  const { current_page } = useSelector(
    (state) => state.searchLanding.itemsMeta
  );
  // const { searchItemApiIncPaginationEnabled } = useSelector((state) => state.searchLanding);
  // const { searchItemApiDecPaginationEnabled } = useSelector((state) => state.searchLanding);
  const { nearMeApiIncPaginationEnabled } = useSelector(
    (state) => state.searchLanding
  );
  const { nearMeApiDecPaginationEnabled } = useSelector(
    (state) => state.searchLanding
  );
  const { filterSearchItemApiIncPaginationEnabled } = useSelector(
    (state) => state.searchLanding
  );
  const { filterSearchItemApiDecPaginationEnabled } = useSelector(
    (state) => state.searchLanding
  );

  const [radioButtonGroup, setRadioButtonGroup] = useState("all");

  const [sort, setSort] = useState();

  const [searchItem, setSearchItem] = useState("");

  const [postcode, setPostcode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [miles, setMiles] = useState("");
  const [displayMiles, setDisplayMiles] = useState("");

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  // localstorage search data
  useEffect(() => {
    if (state != null) {
      const localStorageSearchData = JSON.parse(
        localStorage.getItem("searchData")
      );

      if (getObjectLength(localStorageSearchData) != 0) {
        setSearchItem(localStorageSearchData.keyword);
        setPostcode(localStorageSearchData.post_code);
        setLatitude(localStorageSearchData.latitude);
        setLongitude(localStorageSearchData.longitude);
        setMiles(
          localStorageSearchData.distance != null
            ? localStorageSearchData.distance
            : "Unlimited"
        );
        setDisplayMiles(
          localStorageSearchData.distance != null
            ? localStorageSearchData.distance
            : state != "searchNearMe"
            ? "Unlimited"
            : "30"
        );
      }
    }

    // disable Update Search if comming from nearMe
    if (state == "searchNearMe") {
      setIsDisabled(true);
    }
  }, [state]);

  // run sub category api everytime category is changed
  useEffect(() => {
    if (category != "" && category != "--Select--") {
      // let selectedCategoryId = categoriesPickerList.filter(
      //   (obj) => obj.label == category
      // );

      dispatch(subCategoriesApi(category));
    }
  }, [category]);

  // call api when radioButtonGroup changes
  useEffect(() => {
    if (radioButtonGroup != "" && searchItem != "") {
      setDisplayMiles(miles);

      let obj = {
        page: 1,
        navigate: navigate,
        keyword: searchItem,
        category_id: category,
        sub_category_id: subCategory,
        distance: miles === "Unlimited" ? null : parseInt(miles),
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sort === "Price (lowest first)" ? "price" : "distance",
        latitude: latitude,
        longitude: longitude,
        item_type: radioButtonGroup,
      };

      dispatch(filterSearchItemApi(obj));
    }
  }, [radioButtonGroup, searchItem]);

  // sortHandler
  const sortHandler = (e) => {
    e.preventDefault();

    setDisplayMiles(miles);
    setSort(e.target.innerText);

    // let selectedCategoryId = "";
    // let selectedSubCategoryId = "";

    // if (category != "") {
    //   selectedCategoryId = categoriesPickerList.filter(
    //     (obj) => obj.label == category
    //   );
    // }

    // if (subCategory != "") {
    //   selectedSubCategoryId = subCategoriesPickerList.filter(
    //     (obj) => obj.label == subCategory
    //   );
    // }

    let sortObj = {
      page: 1,
      navigate: navigate,
      keyword: searchItem,
      category_id: category,
      sub_category_id: subCategory,
      // category_id: selectedCategoryId[0]?.value || "",
      // sub_category_id: selectedSubCategoryId[0]?.value || "",
      distance: miles === "Unlimited" ? null : parseInt(miles),
      min_price: minPrice,
      max_price: maxPrice,
      sort_by:
        e.target.innerText !== "Distance (nearest first)"
          ? "price"
          : "distance",
      latitude: latitude,
      longitude: longitude,
      item_type: radioButtonGroup,
    };

    dispatch(filterSearchItemApi(sortObj));
  };

  // filterSearchHandler
  const filterSearchHandler = (e) => {
    e.preventDefault();

    // let selectedCategoryId = "";
    // let selectedSubCategoryId = "";

    // if (category != "") {
    //   selectedCategoryId = categoriesPickerList.filter(
    //     (obj) => obj.label == category
    //   );
    // }

    // if (subCategory != "") {
    //   selectedSubCategoryId = subCategoriesPickerList.filter(
    //     (obj) => obj.label == subCategory
    //   );
    // }

    let obj = {
      page: 1,
      navigate: navigate,
      keyword: searchItem,
      category_id: category,
      sub_category_id: subCategory,
      // category_id: selectedCategoryId[0]?.value || "",
      // sub_category_id: selectedSubCategoryId[0]?.value || "",
      distance: miles === "Unlimited" ? null : parseInt(miles),
      min_price: minPrice,
      max_price: maxPrice,
      sort_by: sort === "Price (lowest first)" ? "price" : "distance",
      latitude: latitude,
      longitude: longitude,
      item_type: radioButtonGroup,
    };

    setDisplayMiles(miles);
    dispatch(filterSearchItemApi(obj));
  };

  const selectedItemHandler = (item) => {
    // console.log("item ==> ", item);

    // let obj = {
    //   id: item.id,
    //   navigate: navigate,
    // };

    if (
      (item.is_for_hire === 1 && item.is_for_sale === 1) ||
      (item.is_for_hire === 1 && item.is_for_sale === 0)
    ) {
      // obj.routeTo = "hire";

      // dispatch(hireItemByIdApi(obj));
      // dispatch(calendarUnavailableDateListApi(item.id));

      navigate(`/hire/${item.id}`, {
        state: item.distance,
      });
    }

    if (item.is_for_hire === 0 && item.is_for_sale === 1) {
      // obj.routeTo = "buy";

      // dispatch(hireItemByIdApi(obj));
      // dispatch(hireItemByIdApi(item.id));

      navigate(`/buy/${item.id}`, {
        state: item.distance,
      });
    }
  };

  // paginationNumberHandler
  const paginationNumberHandler = (number) => {
    // // for search
    // if (loadedApiName === "searchItem") {
    //   let obj = {
    //     page: number,
    //     navigate: navigate,
    //     keyword: searchItem,
    //     post_code: postcode,
    //     latitude: latitude,
    //     longitude: longitude,
    //     distance: miles,
    //   };

    //   dispatch(searchItemApi(obj));
    // }

    // for search near me
    if (loadedApiName === "nearMe") {
      let obj = {
        page: number,
        navigate: navigate,
        latitude: latitude,
        longitude: longitude,
        // latitude: 50.695874,
        // longitude: -3.537021,
        // latitude: 50.70038,
        // longitude: -3.4822,
        // latitude: 50.700367,
        // longitude: -3.482253,
      };

      dispatch(nearMeApi(obj));
    }

    // for filter search
    if (loadedApiName === "filterSearchItem") {
      // let selectedCategoryId = "";
      // let selectedSubCategoryId = "";

      // if (category != "") {
      //   selectedCategoryId = categoriesPickerList.filter(
      //     (obj) => obj.label == category
      //   );
      // }

      // if (subCategory != "") {
      //   selectedSubCategoryId = subCategoriesPickerList.filter(
      //     (obj) => obj.label == subCategory
      //   );
      // }

      let obj = {
        page: number,
        navigate: navigate,
        keyword: searchItem,
        category_id: category,
        sub_category_id: subCategory,
        // category_id: selectedCategoryId[0]?.value || "",
        // sub_category_id: selectedSubCategoryId[0]?.value || "",
        distance: miles === "Unlimited" ? null : parseInt(miles),
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sort === "Price (lowest first)" ? "price" : "distance",
        latitude: latitude,
        longitude: longitude,
        item_type: radioButtonGroup,
      };

      dispatch(filterSearchItemApi(obj));
    }
  };

  // incPaginationNumberHandler
  const incPaginationNumberHandler = () => {
    // //  searchItemApiIncPaginationEnabled
    // if (searchItemApiIncPaginationEnabled) {
    //   let obj = {
    //     page: current_page + 1,
    //     navigate: navigate,
    //     keyword: searchItem,
    //     post_code: postcode,
    //     latitude: latitude,
    //     longitude: longitude,
    //     distance: miles,
    //   };

    //   dispatch(searchItemApi(obj));
    // }

    // nearMeApiIncPaginationEnabled
    if (nearMeApiIncPaginationEnabled) {
      let obj = {
        page: current_page + 1,
        navigate: navigate,
        // latitude: 50.695874,
        // longitude: -3.537021,
        // latitude: 50.70038,
        // longitude: -3.4822,
        // latitude: 50.700367,
        // longitude: -3.482253,
        latitude: latitude,
        longitude: longitude,
      };

      dispatch(nearMeApi(obj));
    }

    // filterSearchItemApiIncPaginationEnabled
    if (filterSearchItemApiIncPaginationEnabled) {
      // let selectedCategoryId = "";
      // let selectedSubCategoryId = "";

      // if (category != "") {
      //   selectedCategoryId = categoriesPickerList.filter(
      //     (obj) => obj.label == category
      //   );
      // }

      // if (subCategory != "") {
      //   selectedSubCategoryId = subCategoriesPickerList.filter(
      //     (obj) => obj.label == subCategory
      //   );
      // }

      let obj = {
        page: current_page + 1,
        navigate: navigate,
        keyword: searchItem,
        category_id: category,
        sub_category_id: subCategory,
        // category_id: selectedCategoryId[0]?.value || "",
        // sub_category_id: selectedSubCategoryId[0]?.value || "",
        distance: miles === "Unlimited" ? null : parseInt(miles),
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sort === "Price (lowest first)" ? "price" : "distance",
        latitude: latitude,
        longitude: longitude,
        item_type: radioButtonGroup,
      };

      dispatch(filterSearchItemApi(obj));
    }
  };

  // decPaginationNumberHandler
  const decPaginationNumberHandler = () => {
    // //  searchItemApiDecPaginationEnabled
    // if (searchItemApiDecPaginationEnabled) {
    //   let obj = {
    //     page: current_page - 1,
    //     navigate: navigate,
    //     keyword: searchItem,
    //     post_code: postcode,
    //     latitude: latitude,
    //     longitude: longitude,
    //     distance: miles,
    //   };

    //   dispatch(searchItemApi(obj));
    // }

    // nearMeApiDecPaginationEnabled
    if (nearMeApiDecPaginationEnabled) {
      let obj = {
        page: current_page - 1,
        navigate: navigate,
        // latitude: 50.695874,
        // longitude: -3.537021,
        // latitude: 50.70038,
        // longitude: -3.4822,
        // latitude: 50.700367,
        // longitude: -3.482253,
        latitude: latitude,
        longitude: longitude,
      };

      dispatch(nearMeApi(obj));
    }

    // filterSearchItemApiDecPaginationEnabled
    if (filterSearchItemApiDecPaginationEnabled) {
      // let selectedCategoryId = "";
      // let selectedSubCategoryId = "";

      // if (category != "") {
      //   selectedCategoryId = categoriesPickerList.filter(
      //     (obj) => obj.label == category
      //   );
      // }

      // if (subCategory != "") {
      //   selectedSubCategoryId = subCategoriesPickerList.filter(
      //     (obj) => obj.label == subCategory
      //   );
      // }

      let obj = {
        page: current_page - 1,
        navigate: navigate,
        keyword: searchItem,
        category_id: category,
        sub_category_id: subCategory,
        // category_id: selectedCategoryId[0]?.value || "",
        // sub_category_id: selectedSubCategoryId[0]?.value || "",
        distance: miles === "Unlimited" ? null : parseInt(miles),
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sort === "Price (lowest first)" ? "price" : "distance",
        latitude: latitude,
        longitude: longitude,
        item_type: radioButtonGroup,
      };

      dispatch(filterSearchItemApi(obj));
    }
  };

  const renderSearchedItemList =
    items.length > 0 ? (
      items.map((obj, index) => {
        return (
          <div key={index} onClick={selectedItemHandler.bind(this, obj)}>
            <hr className="my-4" />

            <div className="container">
              <div className="row pointer">
                <div className="col-12 col-xl-3 col-lg-5 col-md-12">
                  <img
                    src={obj.main_image}
                    alt="tractor"
                    className="img-search-result"
                  />
                </div>

                <div className="col-12 col-xl-9 col-lg-7 col-md-12">
                  <h4 className="orange my-4">
                    <b>{obj.name}</b>
                  </h4>

                  {(radioButtonGroup === "all" ||
                    radioButtonGroup === "hire") && (
                    <p className="grey mb-2">
                      {/* hire */}
                      {obj.least_price != null && (
                        <>
                          Hire from{" "}
                          <b className="mr-xl-5 pr-xl-5 ml-2 size">{`£${
                            obj.least_price != null ? obj.least_price : ""
                          }`}</b>
                          <br className="d-xl-none" />
                        </>
                      )}

                      {/* buy */}
                      {obj.selling_price != null && (
                        <>
                          <i
                            className="fa fa-tag big-tag ml-xl-5 ml-0"
                            aria-hidden="true"
                          ></i>
                          &nbsp; Buy for
                          <b className="mr-xl-5 pr-xl-5 ml-2 size">{`£${
                            obj.selling_price != null ? obj.selling_price : ""
                          }`}</b>
                        </>
                      )}
                    </p>
                  )}

                  {/* <br className="d-xl-none" />   */}

                  {radioButtonGroup === "buy" && (
                    <p className="grey mb-2">
                      {/* buy */}
                      {obj.selling_price != null && (
                        <>
                          <i
                            className="fa fa-tag big-tag ml-xl-5 ml-0"
                            aria-hidden="true"
                          ></i>
                          Buy for
                          <b className="mr-xl-5 pr-xl-5 ml-2 size">{`£${
                            obj.selling_price != null ? obj.selling_price : ""
                          }`}</b>
                        </>
                      )}

                      {/* hire */}
                      {obj.least_price != null && (
                        <>
                          Hire from{" "}
                          <b className="mr-xl-5 pr-xl-5 ml-2 size">{`£${
                            obj.least_price != null ? obj.least_price : ""
                          }`}</b>
                          <br className="d-xl-none" />
                        </>
                      )}
                    </p>
                  )}

                  <p className="grey">
                    <i className="fa fa-map-pin" aria-hidden="true"></i>
                    &ensp;
                    {/* <b className="ml-xl-5 pl-xl-5 mr-2 size"> */}
                    {obj.distance}&nbsp;
                    {/* </b>{" "} */}
                    miles away
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <NoData firstMessage="There are no listings that match your search. Please change your search criteria and try again." />
    );

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

  // total count
  const itemPaginationTo = to ?? 0;
  const itemPaginationFrom = from ?? 1;
  const totalItemCount = itemPaginationTo - itemPaginationFrom + 1;

  // localstorage search data
  const localStorageSearchData = JSON.parse(localStorage.getItem("searchData"));

  // // distance
  // const storedDistance = localStorageSearchData.distance;
  // const displayTotalDistance =
  //   storedDistance != null
  //     ? storedDistance
  //     : state != "searchNearMe"
  //     ? "Unlimited"
  //     : "30";

  // post code
  const storedPostcode = localStorageSearchData.post_code;
  const displayPostcode = storedPostcode != "" ? storedPostcode : "_";

  // item name
  const storedItemName = localStorageSearchData.keyword;
  const displayItemName = storedItemName != "" ? storedItemName : "_";
  return (
    <div className="searchResultWrapper">
      <div className="container body-height">
        <Link className="back py-2 pt-5" to="/search-landing">
          <FaArrowLeft /> Back to Search Landing
          {/* <i className="fas fa-arrow-left" /> Back  */}
        </Link>

        <div className="row pb-5">
          {/* filters */}
          <div className="col-12 col-xl-3 col-md-5 pt-4">
            <h5 className="flamabold">
              <b className="searchResultBold">Filters</b>
            </h5>

            <hr className="my-4" />

            {/* radio buttons */}
            <input
              type="radio"
              id="all"
              name="filter"
              value={radioButtonGroup}
              defaultChecked
              onChange={(e) => setRadioButtonGroup("all")}
            />

            <label htmlFor="all">All</label>

            <br />

            <input
              type="radio"
              id="forhire"
              name="filter"
              value={radioButtonGroup}
              onChange={(e) => setRadioButtonGroup("hire")}
            />

            <label htmlFor="forhire">For Hire</label>

            <br />

            <input
              type="radio"
              id="forsale"
              name="filter"
              value={radioButtonGroup}
              onChange={(e) => setRadioButtonGroup("buy")}
            />

            <label htmlFor="forsale">For Sale</label>

            <hr className="my-4" />

            {/* location */}
            <h6 className="flamabold">Location</h6>
            <div className="form-input">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-6">
                    <input
                      type="loc"
                      className="input-search-result mr-1 placeholder disabled"
                      placeholder="EX2 8FF"
                      value={postcode}
                      onChange={(e) => setSearchItem(e.target.value)}
                      readOnly
                    />
                  </div>

                  <div className="col-6">
                    <div className="select">
                      <select
                        //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-search-result"
                        value={miles}
                        onChange={(e) => {
                          setMiles(e.target.value);
                        }}
                        required
                      >
                        {Distance.length > 0
                          ? Distance.map((obj, index) => {
                              return (
                                <option key={index} value={obj.value}>
                                  {obj.label}
                                </option>
                              );
                            })
                          : []}
                      </select>

                      {/* <button
                        className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-search-result"
                        type="button"
                        data-toggle="dropdown"
                      >
                        {miles == null || miles == "" ? "Unlimited" : miles}
                        <span className="caret"></span>
                      </button>

                      <ul className="dropdown-menu">
                        {Distance.map((obj, index) => {
                          return (
                            <li
                              key={index}
                              onClick={(e) => setMiles(e.target.innerText)}
                            >
                              <a href="#">{obj.label}</a>
                            </li>
                          );
                        })}
                      </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* category */}
            <h6 className="flamabold">Category</h6>

            <div className="form-input">
              <div className="select mb-3">
                {/* <button
                  className="btn btn-primary dropdown-toggle dropdown-btn  dropdown-btn-search-result"
                  type="button"
                  data-toggle="dropdown"
                >
                  {category != "" ? category : "—Select—"}
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  {categoriesPickerList.map((obj, index) => {
                    return (
                      <li
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setCategory(e.target.innerText);
                          setSubCategory("");
                        }}
                      >
                        <a href="#">{obj.label}</a>
                      </li>
                    );
                  })}
                </ul> */}

                <select
                  //className="btn btn-primary dropdown-toggle dropdown-btn dropdown-btn-search-result"
                  value={category}
                  onChange={(e) => {
                    e.preventDefault();
                    setCategory(e.target.value);
                    setSubCategory("");
                  }}
                  required
                >
                  {categoriesPickerList.length > 0
                    ? categoriesPickerList.map((obj, index) => {
                        return (
                          <option key={index} value={obj.value}>
                            {obj.label}
                          </option>
                        );
                      })
                    : []}
                </select>
              </div>

              <div className="select">
                {/* <button
                  className="btn btn-primary dropdown-toggle dropdown-btn  dropdown-btn-search-result"
                  type="button"
                  data-toggle="dropdown"
                >
                  {subCategory != "" ? subCategory : "—Select—"}
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  {subCategoriesPickerList.map((obj, index) => {
                    return (
                      <li
                        key={index}
                        onClick={(e) => setSubCategory(e.target.innerText)}
                      >
                        <a href="#">{obj.label}</a>
                      </li>
                    );
                  })}
                </ul> */}

                <select
                  //className="btn btn-primary dropdown-toggle dropdown-btn  dropdown-btn-search-result"
                  value={subCategory}
                  onChange={(e) => {
                    setSubCategory(e.target.value);
                  }}
                  required
                >
                  {subCategoriesPickerList.map((obj, index) => {
                    return (
                      <option key={index} value={obj.value}>
                        {obj.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <hr className="my-4" />

            {/* price range */}
            <h6 className="flamabold">
              Price Range{" "}
              <span
                style={{ fontFamily: "flama", fontSize: "14px", color: "#777" }}
              >
                per day
              </span>
            </h6>

            <div className="form-input">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-5 pr-0">
                    <FaPoundSign className="pound-icon" />

                    <input
                      type="text"
                      className="input-search-result mr-0 pl-4"
                      placeholder="No min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>

                  <div className="col-2 text-center">
                    <span className="flamabold ver-center-to">to</span>
                  </div>

                  <div className="col-5 pl-0">
                    <FaPoundSign className="pound-icon1" />

                    <input
                      type="text"
                      className="input-search-result mr-0 pl-4"
                      placeholder="No max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <button
              type="submit"
              className="btn btn-block text-uppercase btn-search-result"
              disabled={isDisabled}
              onClick={filterSearchHandler}
            >
              <span className="search-btn-txt">Update Search</span>
            </button>
          </div>

          {/* digger */}
          <div className="col-12 col-xl-9 col-md-7 pt-4 digger">
            {/* top sort */}
            <div className="container">
              <div className="row">
                <div className="col-12 col-xl-8 col-md-12">
                  <p className="mb-0">
                    <b>{totalItemCount != NaN ? totalItemCount : "_"}</b>{" "}
                    results found within{" "}
                    <b>{`${
                      displayMiles
                      // displayTotalDistance
                    } miles`}</b>{" "}
                    of <b>{displayPostcode}</b> for
                  </p>

                  <h2>
                    <b>{displayItemName}</b>
                  </h2>
                </div>

                <div className="col-12 col-xl-4 col-md-12 px-0 py-2">
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle dropdown-btn  dropdown-btn-search-result"
                      type="button"
                      data-toggle="dropdown"
                      disabled={isDisabled}
                    >
                      <i
                        className="fa fa-sort orange-no-pointer"
                        aria-hidden="true"
                      />

                      <span className="pl-3 grey">
                        {sort == null || sort == "" ? "Sort" : sort}
                      </span>
                    </button>

                    <ul className="dropdown-menu">
                      {SearchResultSort.map((obj, index) => {
                        return (
                          <li key={index} onClick={sortHandler}>
                            <a>{obj.label}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/*<button
                    type="button"
                    className="btn btn-default btn-block border py-2 text-left"
                  >
                    <i className="fa fa-sort orange-no-pointer" aria-hidden="true" />
                    <span className="pl-3 grey">Sort</span>
                  </button> */}
                </div>
              </div>
            </div>

            {renderSearchedItemList}

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
                  className={`page-item disabled ${
                    total < 15 ? "pointer-not-allowed" : ""
                  }`}
                  onClick={incPaginationNumberHandler}
                >
                  <span className="page-link">Next</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchResult };
