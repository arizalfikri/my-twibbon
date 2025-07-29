import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import EditorPage from "../pages/EditorPage.jsx";
import  Result from "../pages/Result.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
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
        element: < LoginPage/>,
    },
    {
       path: "Register",
        element: < RegisterPage/>
    }
    ],
  },
]);
