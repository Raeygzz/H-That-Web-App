import React from "react";

import { ShimmerTitle } from "react-shimmer-effects";

const StripeConnectShimmer = (props) => {
  const {} = props;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-12">
          <ShimmerTitle line={1} variant="primary" />
        </div>
      </div>
    </div>
  );
};

export { StripeConnectShimmer };
