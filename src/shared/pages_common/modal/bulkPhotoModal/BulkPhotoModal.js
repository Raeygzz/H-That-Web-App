import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import "./BulkPhotoModal.css";

import { useSelector, useDispatch } from "react-redux";
import {
  showBulkPhotoModal,
  setBulkMainImage,
  BulkPhotosFunction,
  bulkRemoveAll,
  BulkTotalFunction,
} from "../../../../toolkit/features/BulkUploadSlice";

// toast for 3 sec
const ToastFor3Sec = {
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
};

const BulkPhotoModal = (props) => {
  const { advertIndex } = props;

  const { bulkPhotos } = useSelector((state) => state.bulkUpload);
  const { bulkMainImage } = useSelector((state) => state.bulkUpload);
  const { bulkPhotosCount } = useSelector((state) => state.bulkUpload);

  const [images, setImages] = useState([]);
  const [bulkCount, setBulkCount] = useState("");
  const [bulkImages, setBulkImages] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [acceptedFilesCount, setAcceptedFilesCount] = useState("");

  const dispatch = useDispatch();

  // console.log("bulkPhotos ==> ", bulkPhotos);
  // console.log("advertIndex ==> ", advertIndex);

  useEffect(() => {
    if (
      advertIndex != null &&
      bulkPhotosCount.length > 0 &&
      bulkPhotos.length > 0
    ) {
      let particularBulkPhotosCount = bulkPhotosCount.find((ele) => {
        return ele.advertIndex === advertIndex;
      });
      // console.log("particularBulkPhotosCount ==> ", particularBulkPhotosCount);

      let particularBulkPhotos = bulkPhotos.find((ele) => {
        return ele.advertIndex === advertIndex;
      });
      // console.log("particularBulkPhotos ==> ", particularBulkPhotos);

      if (
        particularBulkPhotosCount.bulkPhotosCount ===
        particularBulkPhotos.bulkPhotos.length
      ) {
        setImages(particularBulkPhotos.bulkPhotos);
      }
    }
  }, [advertIndex, bulkPhotosCount, bulkPhotos]);

  // cancelHandler
  const cancelHandler = () => {
    dispatch(showBulkPhotoModal(false));
    dispatch(bulkRemoveAll());
    document.getElementById("file-input").value = "";
  };

  // addHandler
  const addHandler = (e) => {
    e.preventDefault();

    // console.log("advertIndex ==> ", advertIndex);
    // console.log("bulkPhotosCount ==> ", bulkPhotosCount);

    let particularBulkPhotosCount =
      bulkPhotosCount.length > 0
        ? bulkPhotosCount.find((ele) => {
            return ele.advertIndex === advertIndex;
          })
        : undefined;
    // console.log("particularBulkPhotosCount ==> ", particularBulkPhotosCount);

    let count =
      particularBulkPhotosCount !== undefined
        ? particularBulkPhotosCount.bulkPhotosCount + e.target.files.length
        : e.target.files.length;

    // console.log("BulkPhotoModal-count ==> ", count);

    setBulkImages([]);
    setBulkCount(count);
    setAcceptedFilesCount(e.target.files.length);

    if (count > 5) {
      toast("Only five photos are allowed to add in gallery.", ToastFor3Sec);

      document.getElementById("file-input").value = "";
      return;
    }

    if (count > 0 && count < 6) {
      for (let i = 0; i < e.target.files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);

        reader.onload = function () {
          setBulkImages((prevArray) => [...prevArray, reader.result]);

          document.getElementById("file-input").value = "";
        };

        reader.onerror = function (error) {
          console.log("Error ==> ", error);
        };
      }

      dispatch(
        BulkTotalFunction({
          advertIndex: advertIndex,
          bulkPhotosCount: count,
          bulkTotal: bulkPhotosCount,
        })
      );
    }
  };

  // console.log("BulkPhotoModal-bulkCount ==> ", bulkCount);
  // console.log("BulkPhotoModal-bulkImages ==> ", bulkImages);
  useEffect(() => {
    if (acceptedFilesCount != "" && bulkImages.length > 0) {
      if (acceptedFilesCount === bulkImages.length) {
        dispatch(
          BulkPhotosFunction({
            advertIndex: advertIndex,
            bulkImages: bulkImages,
            bulkPhotos: bulkPhotos,
          })
        );
      }
    }
  }, [acceptedFilesCount, bulkCount, bulkImages]);

  // savePhotoHandler
  const savePhotoHandler = () => {
    let particularBulkMainImage =
      bulkMainImage.length > 0
        ? bulkMainImage.find((ele) => {
            return ele.advertIndex === advertIndex;
          })
        : undefined;

    // console.log("particularBulkMainImage ==> ", particularBulkMainImage);

    if (particularBulkMainImage === undefined) {
      dispatch(
        setBulkMainImage({
          advertIndex: advertIndex,
          bulkMainImage: images[0],
        })
      );
    }

    dispatch(showBulkPhotoModal(false));
  };

  // clearImagesHandler
  const clearImagesHandler = () => {
    setPreviewPhoto("");
    dispatch(bulkRemoveAll());
  };

  // particularBulkMainImage
  let particularBulkMainImage =
    bulkMainImage.length > 0
      ? bulkMainImage.find((ele) => {
          return ele.advertIndex === advertIndex;
        })
      : undefined;

  // images in row
  const imagesInRow =
    images.length > 0
      ? images.map((obj, index) => {
          return (
            <div key={index} className="col p-0 px-1">
              {obj != particularBulkMainImage?.bulkMainImage && (
                <a
                  className="text-over"
                  onClick={(e) => {
                    e.preventDefault();

                    setPreviewPhoto(obj);
                    dispatch(
                      setBulkMainImage({
                        advertIndex: advertIndex,
                        bulkMainImage: obj,
                      })
                    );
                  }}
                >
                  Set Main Image
                </a>
              )}

              <div
                className="image-upload"
                onClick={() => setPreviewPhoto(obj)}
              >
                <img className="added-image-2" src={obj} />

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
              {previewPhoto != "" && (
                <img className="added-image-1" src={previewPhoto} />
              )}

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

                <a className="clear py-2 mt-2" onClick={clearImagesHandler}>
                  Clear Images
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BulkPhotoModal };
