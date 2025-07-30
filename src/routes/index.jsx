import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/MainTwibone.jsx";
import EditorPage from "../pages/EditorPage.jsx";
import Result from "../pages/Result.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import TwiboneHomepage from "../pages/twiboneHomePage.jsx";
import MainTwibone from "../pages/MainTwibone.jsx";
import TwiboneCreatePage from "../pages/twiboneCreatePage.jsx";

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
        path: "Login",
        element: <LoginPage />,
      },
      {
        path: "Register",
        element: <RegisterPage />,
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
