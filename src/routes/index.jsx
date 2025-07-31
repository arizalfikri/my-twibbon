import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/MainTwibone.jsx";
import EditorPage from "../pages/EditorPage.jsx";
import Result from "../pages/Result.jsx";
import TwiboneHomepage from "../pages/twiboneHomePage.jsx";
import MainTwibone from "../pages/MainTwibone.jsx";
import TwiboneCreatePage from "../pages/twiboneCreatePage.jsx";
import SignIn from "../pages/SignIn.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <TwiboneHomepage />,
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
        path: "Main",
        element: <MainTwibone />,
      },
      {
        path: "Create",
        element: <TwiboneCreatePage />,
      },
    ],
  },
]);
