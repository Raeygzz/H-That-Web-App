import React from "react";

// import ReactTooltip from "react-tooltip";
import { FaShare } from "react-icons/fa";
import { RWebShare } from "react-web-share";
// import {
//   EmailShareButton,
//   FacebookShareButton,
//   HatenaShareButton,
//   InstapaperShareButton,
//   LineShareButton,
//   LinkedinShareButton,
//   LivejournalShareButton,
//   MailruShareButton,
//   OKShareButton,
//   PinterestShareButton,
//   PocketShareButton,
//   RedditShareButton,
//   TelegramShareButton,
//   TumblrShareButton,
//   TwitterShareButton,
//   ViberShareButton,
//   VKShareButton,
//   WhatsappShareButton,
//   WorkplaceShareButton,
//   EmailIcon,
//   FacebookIcon,
//   FacebookMessengerIcon,
//   HatenaIcon,
//   InstapaperIcon,
//   LineIcon,
//   LinkedinIcon,
//   LivejournalIcon,
//   MailruIcon,
//   OKIcon,
//   PinterestIcon,
//   PocketIcon,
//   RedditIcon,
//   TelegramIcon,
//   TumblrIcon,
//   TwitterIcon,
//   ViberIcon,
//   VKIcon,
//   WeiboIcon,
//   WhatsappIcon,
//   WorkplaceIcon,
// } from "react-share";

import "./SocialShare.css";

const SocialShare = (props) => {
  const { socialShare } = props;
  // console.log("socialShare ==> ", socialShare);

  return (
    <>
      <div className="rounded-circle pt-1 circle-btn1 circle-orange pointer inline-block float-right">
        <RWebShare
          data={{
            url: socialShare.url,
            title: socialShare.title,
            text: socialShare.text,
          }}
          onClick={() => console.log("shared successfully!")}
        >
          <FaShare />
        </RWebShare>
      </div>

      {/* <div className="rounded-circle circle-btn1 circle-orange circle-btn-hire tooltip-css">
        <FaShare />

        <span className="tooltiptext">
          <FacebookShareButton url={socialShare.url} title={socialShare.title}>
            <FacebookMessengerIcon style={{ opacity: "0.5" }} size={18} />
          </FacebookShareButton>

          <LinkedinShareButton url={socialShare.url} title={socialShare.title}>
            <LinkedinIcon style={{ opacity: "0.5" }} size={18} />
          </LinkedinShareButton>

          <EmailShareButton
            url={socialShare.url}
            subject={socialShare.title}
            body={
              "Download the app from the App store or get it on Google play" +
              "\n" +
              process.env.REACT_APP_HT_IOS +
              "\n" +
              process.env.REACT_APP_HT_ANDROID
            }
          >
            <EmailIcon style={{ opacity: "0.5" }} size={18} />
          </EmailShareButton>
        </span>
      </div> */}

      {/* <a
        className="rounded-circle circle-btn1 circle-orange"
        data-for="registerTip"
        onClick={shareButtonHandler}
      >
        <FaShare />
      </a>

      <ReactTooltip
        id="registerTip"
        place="top"
        effect="solid"
        clickable={true}
        type="dark"
      >
        <FacebookShareButton url={socialShare.url} title={socialShare.title}>
          <FacebookMessengerIcon style={{ opacity: "0.5" }} size={18} />
        </FacebookShareButton>
      </ReactTooltip> */}
    </>
  );
};

export { SocialShare };
