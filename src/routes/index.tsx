import { createBrowserRouter } from "react-router-dom";
import Root from "./app/Root";
import Today from "./app/Today";
import Planner from "./app/Planner";
import Error from "./app/Error";

export default createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Today />,
            },
            {
                path: "/planner",
                element: <Planner />,
            },
        ],
    },
]);
