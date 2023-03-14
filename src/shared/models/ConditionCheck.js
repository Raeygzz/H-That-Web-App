import Store from "../../toolkit/Store";
import { presentModal } from "../../toolkit/features/ModalSlice";

const conditionCheck = (
  navigate,
  userEmail,
  hasPrimaryAddress,
  hasBusinessProfile
) => {
  // console.log("navigate ==> ", navigate);
  // console.log("userEmail ==> ", userEmail);
  // console.log("hasPrimaryAddress ==> ", hasPrimaryAddress);
  // console.log("hasBusinessProfile ==> ", hasBusinessProfile);

  if (
    userEmail != null &&
    hasPrimaryAddress === 1 &&
    hasBusinessProfile === 1
  ) {
    navigate("/post-advert");
    return;
  }

  if (userEmail === null) {
    let modalConfig = {
      title: "Wait!",
      shouldRunFunction: true,
      functionHandler: "navigateToUserDetailScreen",
      message: `Please fill in the email address first and other required fields from User Detail Screen under User Settings.`,
    };

    Store.dispatch(presentModal(modalConfig));
    return;
  }

  if (hasPrimaryAddress != 1) {
    navigate("/onboarding-user-address");
    return;
  }

  if (hasBusinessProfile != 1) {
    let modalConfig = {
      title: "Wait!",
      shouldRunFunction: true,
      functionHandler: "navigateToBusinessProfileScreen",
      message: `Please take a moment to fill in your Trading Account Details to create your first advert.`,
    };

    Store.dispatch(presentModal(modalConfig));
    return;
  }
};

export { conditionCheck };
