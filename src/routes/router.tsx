import { createBrowserRouter } from "react-router-dom";
import Home from "@pages/Home";
import Histories from "@pages/Histories";
import Login from "@pages/Login/Login";
import WelcomeBack from "@pages/WelcomeBack";
import Success from "@pages/Success/Success";
import Verify from "@pages/Verify";
import SignUp from "@pages/SignUp/SignUp";
import MainLayout from "@layout/MainLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/welcome-back",
                element: <WelcomeBack />,
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/histories",
                element: <Histories />,
            },
            {
                path: "/success",
                element: <Success />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/verify",
        element: <Verify />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
]);

export default router;
