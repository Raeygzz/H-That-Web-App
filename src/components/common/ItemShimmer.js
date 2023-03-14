import React from "react";

import { ShimmerTitle, ShimmerThumbnail } from "react-shimmer-effects";

const ItemShimmer = (props) => {
  const {} = props;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-12">
          <ShimmerTitle line={1} variant="secondary" />
        </div>

        <div className="col-md-4 d-none d-sm-block">
          <ShimmerTitle line={1} variant="secondary" />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 col-12">
          <ShimmerThumbnail rounded />
        </div>

        <div className="col-4 d-none d-sm-block">
          <ShimmerThumbnail rounded />
        </div>

        <div className="col-4 d-none d-sm-block">
          <ShimmerThumbnail rounded />
        </div>
      </div>
    </div>
  );
};

export { ItemShimmer };
