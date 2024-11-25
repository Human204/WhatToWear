import { createBrowserRouter } from "react-router-dom";
import Root from "./app/Root";
import Today from "./app/Today";
import Planner from "./app/Planner";
import Error from "./app/Error";
import { AuthProvider } from "../context/AuthProvider";
import { SearchProvider } from "../features/recommendations/context/SearchContext";

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
                element: (
                    <SearchProvider>
                        <Today />
                    </SearchProvider>
                ),
            },
            {
                path: "/planner",
                element: <Planner />,
            },
        ],
    },
]);
