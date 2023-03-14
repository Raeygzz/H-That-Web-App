import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import "./PhotoModal.css";

import { useSelector, useDispatch } from "react-redux";
import { showPhotoModal } from "../../../../toolkit/features/AdvertsSlice";
import {
  addMainImage,
  addPhotos,
  setCount,
  deleteAll,
  storePhotosApi,
  deletePhotoByIdApi,
  deleteOne,
  photoDeleteSuccess,
} from "../../../../toolkit/features/AdvertPhotosSlice";

const PhotoModal = (props) => {
  const { screen, advertId } = props;

  const { photos } = useSelector((state) => state.advertPhotos);
  const { mainImage } = useSelector((state) => state.advertPhotos);
  const { photosCount } = useSelector((state) => state.advertPhotos);
  const { deletePhotoSuccess } = useSelector((state) => state.advertPhotos);

  const [previewPhoto, setPreviewPhoto] = useState("");
  const [selectedPhotoIdForDeletion, setSelectedPhotoIdForDeletion] =
    useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (deletePhotoSuccess) {
      photos.filter((obj, index) => {
        if (selectedPhotoIdForDeletion === obj.id) {
          if (index > -1) {
            dispatch(deleteOne(index));
          }
        }
      });

      dispatch(setCount(photosCount - 1));
      dispatch(photoDeleteSuccess(false));
    }
  }, [deletePhotoSuccess]);

  // cancelHandler
  const cancelHandler = () => {
    dispatch(showPhotoModal(false));

    if (screen === "POSTADVERT") {
      dispatch(deleteAll());
      document.getElementById("file-input").value = "";
    }
  };

  // addHandler
  const addHandler = (e) => {
    e.preventDefault();

    if (photosCount + e.target.files.length > 5) {
      toast("Only five photos are allowed to add in gallery.", {
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

      document.getElementById("file-input").value = "";
      return;
    }

    if (photosCount + e.target.files.length == 1) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = function () {
        dispatch(setCount(photosCount + 1));
        dispatch(addMainImage(reader.result));
        dispatch(addPhotos(reader.result));
        document.getElementById("file-input").value = "";
      };

      reader.onerror = function (error) {
        console.log("Error ==> ", error);
      };
    }

    if (
      photosCount + e.target.files.length > 1 &&
      photosCount + e.target.files.length < 6
    ) {
      for (let i = 0; i < e.target.files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);

        reader.onload = function () {
          dispatch(addPhotos(reader.result));
          document.getElementById("file-input").value = "";
        };

        reader.onerror = function (error) {
          console.log("Error ==> ", error);
        };
      }

      dispatch(setCount(photosCount + e.target.files.length));
      dispatch(showPhotoModal(true));
    }
  };

  // removePhotoByIdHandler
  const removePhotoByIdHandler = (photo) => {
    // console.log("photo ==> ", photo);

    if (photo?.id) {
      setSelectedPhotoIdForDeletion(photo.id);

      let obj = {
        advertId: advertId,
        photoId: photo.id,
      };

      dispatch(deletePhotoByIdApi(obj));
      return;
    }

    photos.filter((obj, index) => {
      if (typeof obj === "string") {
        if (photo === obj) {
          if (index > -1) {
            dispatch(deleteOne(index));
          }
        }
      }
    });

    dispatch(setCount(photosCount - 1));
  };

  // savePhotoHandler
  const savePhotoHandler = () => {
    if (mainImage == "") {
      dispatch(addMainImage(photos[0]));
    }

    if (screen === "EDITADVERT") {
      let photosTempArr = photos.filter((obj, index) => {
        if (obj?.id === undefined) {
          return obj;
        }
      });

      if (photosTempArr.length > 0) {
        let obj = {
          id: advertId,
          photos: photosTempArr,
        };

        dispatch(storePhotosApi(obj));
      }
    }

    dispatch(showPhotoModal(false));
  };

  // clearImagesHandler
  const clearImagesHandler = () => {
    setPreviewPhoto("");
    dispatch(deleteAll());
  };

  const imagesInRow =
    photos.length > 0
      ? photos.map((obj, index) => {
          return (
            <div key={index} className="col p-0 px-1">
              {screen === "POSTADVERT" && obj != mainImage && (
                <a
                  className="text-over"
                  onClick={() => {
                    setPreviewPhoto(obj);
                    dispatch(addMainImage(obj));
                  }}
                >
                  Set Main Image
                </a>
              )}

              <div
                className="image-upload"
                onClick={() =>
                  setPreviewPhoto(
                    screen === "POSTADVERT" ? obj : obj?.photo ? obj.photo : obj
                  )
                }
              >
                {/* for post advert */}
                {screen === "POSTADVERT" && (
                  <img className="added-image-2" src={obj} />
                )}

                {/* for edit advert */}
                {screen === "EDITADVERT" && (
                  <>
                    <label htmlFor="file-input">
                      <img
                        className="added-image-edit"
                        src={obj?.photo ? obj.photo : obj}
                      />
                      <div
                        className="icon-position2 p-3 pointer"
                        onClick={removePhotoByIdHandler.bind(this, obj)}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </div>
                    </label>
                  </>
                )}
                <div
                  className="input-image-2"
                  id="file-input"
                  type="file"
                  name="file"
                />
              </div>
            </div>
          );
        })
      : null;
  return (
    <div className="overlay">
      <div className="card card-post-overlay" role="alert">
        <div className="card-header header-advert">
          <div className="container">
            <div className="row">
              <div className="col-4 p-0">
                <a href="#" className="a-advert" onClick={cancelHandler}>
                  Cancel
                </a>
              </div>
              <div className="col-4 p-0 pl-2 center-photos">
                <span className="card-title">
                  <b>Photos</b>
                </span>
              </div>
              <div className="col-4 p-0">
                <input
                  className="float-right a-advert1"
                  type="file"
                  multiple
                  accept="image/*"
                  id="file-input2"
                  name="file2"
                  onChange={addHandler}
                />

                <label className="a-advert2" htmlFor="file-input2">
                  Add
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body ">
          <div className="form-input">
            <div className="image-upload">
              {/* <label htmlFor="file-input"> */}
              {previewPhoto != "" && (
                <img className="added-image-1" src={previewPhoto} />
              )}
              {/* </label> */}

              {previewPhoto == "" && (
                <div className="preview-text"> Preview Photos </div>
              )}
              <div className="input-image-1" id="file-input" />
            </div>
          </div>

          {/* smol */}
          <div className="container">
            <div className="row d-flex justify-content-center gx-1">
              {imagesInRow}
            </div>
          </div>

          {/* button */}
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-5 p-0 pt-5">
                <button
                  type="button"
                  className="btn btn-post-overlay"
                  onClick={savePhotoHandler}
                >
                  <b className="b-btn-post-overlay">SAVE PHOTOS</b>
                </button>

                {screen === "POSTADVERT" && (
                  <a
                    className="clear py-2 mt-2"
                    href="#"
                    onClick={clearImagesHandler}
                  >
                    Clear Images
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PhotoModal };
