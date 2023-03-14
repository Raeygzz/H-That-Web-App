import { useEffect, useState } from "react";

import {
  browserName,
  isIE,
  isEdge,
  isOpera,
  isChrome,
  isSafari,
  isFirefox,
  isChromium,
} from "react-device-detect";

const useDeviceDetect = () => {
  const [projectBrowserName, setProjectBrowserName] = useState("");

  useEffect(() => {
    setProjectBrowserName(browserName);
  }, []);

  return {
    projectBrowserName,
    isIE,
    isEdge,
    isOpera,
    isChrome,
    isSafari,
    isFirefox,
    isChromium,
  };
};

export { useDeviceDetect };
