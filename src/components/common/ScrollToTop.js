import { useEffect } from "react";

import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  // // watchScroll
  // const watchScroll = () => {
  //   console.log("window ==> ", window);
  //   console.log("window.scrollY ==> ", window.scrollY);

  //   if (window.scrollY > 400) {
  //     console.log("400 GREATER THAN");
  //   } else {
  //     console.log("400 LESSER THAN");
  //   }
  // };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // window.addEventListener("scroll", watchScroll);

    // return () => window.removeEventListener("scroll", watchScroll);
  }, [pathname]);

  return children;
};

export { ScrollToTop };
