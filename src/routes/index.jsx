import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/MainTwibone.jsx";
import EditorPage from "../pages/EditorPage.jsx";
import Result from "../pages/Result.jsx";
import RegisterPage from "../pages/SignUp.jsx";
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

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <TwiboneHomepage />,
      },
      {
        path: "Explore",
        element: <ExploreTwibone />,
      },
      {
        path: "EditorPage",
        element: <EditorPage />,
      },
      {
        path: "Result",
        element: <Result />,
      },
      {
        path: "SignIn",
        element: <SignIn />,
      },
      {
        path: "SignUp",
        element: <SignUp />,
      },
      {
        path: ":slug",
        element: <MainTwibone />,
      },

      {
        path: "Create",
        element: <TwiboneCreatePage />,
      },
      {
        path: "DetailProfile",
        element: <DetailProfile />,
      },
      {
        path: "EditProfile",
        element: <EditProfile />,
      },
      {
        path: "Membership",
        element: <MembershipPage />,
      },
      {
        path:"Checkout",
        element:<CheckoutPage/>
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
