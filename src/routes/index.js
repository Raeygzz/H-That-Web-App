import React, { useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";

import { VerifyAuthRoute, ProtectedRoute } from "../guard";

import {
  Login,
  Signup,
  ForgotPassword,
  PageNotFound,
  OnboardingUserAddress,
  SearchLanding,
  SearchResult,
  Hire,
  HireConfirm,
  PaymentConfirmation,
  Buy,
  BuyEnquire,
  ViewAdvert,
  MyAdverts,
  PostAdvert,
  EditAdvert,
  ViewHire,
  MyAccount,
  AccountOverview,
  HiringIn,
  HiringOut,
  HireCalendar,
  UserSettings,
  EditUserDetail,
  SavedAddresses,
  AddAddress,
  AddCard,
  BulkUpload,
} from "../pages";

import { useSelector, useDispatch } from "react-redux";
import { getClientSecretApi } from "../toolkit/features/CardSlice";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
// console.log("stripePromise ==> ", stripePromise);

const MainRoute = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const { clientSecret } = useSelector((state) => state.card);
  // console.log("clientSecret ==> ", clientSecret);

  const dispatch = useDispatch();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (accessToken != "") {
      dispatch(getClientSecretApi());
    }
  }, [accessToken]);

  const options = {
    // passing the client secret obtained in step 2
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <VerifyAuthRoute>
            <Login />
          </VerifyAuthRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <VerifyAuthRoute>
            <Signup />
          </VerifyAuthRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <VerifyAuthRoute>
            <ForgotPassword />
          </VerifyAuthRoute>
        }
      />

      <Route
        path="/onboarding-user-address"
        element={
          <ProtectedRoute>
            <OnboardingUserAddress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search-landing"
        element={
          <ProtectedRoute>
            <SearchLanding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search-result"
        element={
          <ProtectedRoute>
            <SearchResult />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hire/:id"
        element={
          <ProtectedRoute>
            <Hire />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buy/:id"
        element={
          <ProtectedRoute>
            <Buy />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buy-enquire"
        element={
          <ProtectedRoute>
            <BuyEnquire />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hire-confirm"
        element={
          <ProtectedRoute>
            <HireConfirm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-confirmation"
        element={
          <ProtectedRoute>
            <PaymentConfirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-advert/:id"
        element={
          <ProtectedRoute>
            <ViewAdvert />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-hire/:itemId/:calendarId"
        element={
          <ProtectedRoute>
            <ViewHire />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post-advert"
        element={
          <ProtectedRoute>
            <PostAdvert />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-advert"
        element={
          <ProtectedRoute>
            <EditAdvert />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-account"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      >
        <Route
          path="account-overview"
          element={
            <ProtectedRoute>
              <AccountOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="hiring-in"
          element={
            <ProtectedRoute>
              <HiringIn />
            </ProtectedRoute>
          }
        />

        <Route
          path="hiring-out"
          element={
            <ProtectedRoute>
              <HiringOut />
            </ProtectedRoute>
          }
        />

        <Route
          path="my-adverts"
          element={
            <ProtectedRoute>
              <MyAdverts />
            </ProtectedRoute>
          }
        />

        <Route
          path="bulk-upload"
          element={
            <ProtectedRoute>
              <BulkUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="hire-calendar"
          element={
            <ProtectedRoute>
              <HireCalendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="user-settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="saved-addresses"
          element={
            <ProtectedRoute>
              <SavedAddresses />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/edit-user-detail"
        element={
          <ProtectedRoute>
            <EditUserDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/address"
        element={
          <ProtectedRoute>
            <AddAddress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-card"
        element={
          clientSecret && (
            <ProtectedRoute>
              <Elements stripe={stripePromise} options={options}>
                <AddCard />
              </Elements>
            </ProtectedRoute>
          )
        }
      />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default MainRoute;
