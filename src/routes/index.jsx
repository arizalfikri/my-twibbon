import { createBrowserRouter } from "react-router-dom";
import EditorPage from "../pages/EditorPage.jsx";
import Result from "../pages/Result.jsx";
import TwiboneHomepage from "../pages/twiboneHomePage.jsx";
import MainTwibone from "../pages/MainTwibone.jsx";
import TwiboneCreatePage from "../pages/twiboneCreatePage.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import DetailProfile from "../pages/DetailProfile.jsx";
import ExploreTwibone from "../pages/ExploreTwibone.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import NotFound from "../pages/NotfoundPage.jsx";
import MembershipPage from "../pages/MembershipPage.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import SetPassword from "../pages/SetPassword.jsx";
import PrivacyPolicy from "../pages/PrivacyPolice.jsx";
import EwalletPage from "../pages/EwalletPage.jsx";
import QrisPage from "../pages/QrisPage.jsx";
import VirtualAccountPage from "../pages/VirtualAccountPage.jsx";
import PaymentSuccessPage from "../pages/PaymentSuccesPage.jsx";
import PaymentFailedPage from "../pages/PaymentFailedPage.jsx";
import PaymentCanceledPage from "../pages/PaymentCanceledPage.jsx";
import ProfilePublic from "../pages/ProfilePublic.jsx";
import AdsLayout from "../components/layoutpage/AdsLayout.jsx";
import Historypage from "../pages/Historypage.jsx";
import DetailPaymentPage from "../pages/DetailPaymentPage.jsx";
import AdvanceAnalyticsPage from "../pages/AdvanceAnalyticsPage.jsx";

export const router = createBrowserRouter([
  // ========== ROUTE DENGAN LAYOUT ==========
  {
    path: "/",
    element: <AdsLayout />,
    children: [
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "explore", element: <ExploreTwibone /> },

      { path: ":slug", element: <MainTwibone /> },
      { path: ":slug/editorPage", element: <EditorPage /> },

      { path: "result", element: <Result /> },

      { path: "create/frame", element: <TwiboneCreatePage /> },
      { path: "create/background", element: <TwiboneCreatePage /> },

      { path: "detailprofile", element: <DetailProfile /> },
      { path: "editprofile", element: <EditProfile /> },

      { path: "user/:username", element: <ProfilePublic /> },
      { path: "history", element: <Historypage /> },
      { path: "history/detail", element: <DetailPaymentPage /> },
    ],
  },

  // ========== ROUTE TANPA LAYOUT ==========
  {
    path: "/",
    children: [
      { index: true, element: <TwiboneHomepage /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <SetPassword /> },

      { path: "membership", element: <MembershipPage /> },

      { path: "checkout", element: <CheckoutPage /> },
      { path: "checkout/qris/:referer", element: <QrisPage /> },
      { path: "checkout/ewallet/:referer", element: <EwalletPage /> },
      { path: "checkout/va/:referer", element: <VirtualAccountPage /> },

      { path: "payment-success", element: <PaymentSuccessPage /> },
      { path: "payment-failed", element: <PaymentFailedPage /> },
      { path: "payment-cancelled", element: <PaymentCanceledPage /> },

      { path: "analytics", element: <AdvanceAnalyticsPage /> },
    ],
  },

  // ========== 404 / wildcard ==========
  { path: "*", element: <NotFound /> },
]);
