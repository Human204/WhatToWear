import { createBrowserRouter } from "react-router-dom";
import Root from "./app/Root";
import Today from "./app/Today";
import Planner from "./app/Planner";
import Error from "./app/Error";
import { AuthProvider } from "../context/AuthProvider";

export default createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <Root />
            </AuthProvider>
        ),
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Today />,
            },
            {
                path: "/planner",
                element: <Planner />,
            },
        ],
    },
]);
