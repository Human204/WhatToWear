import { createBrowserRouter } from "react-router-dom";
import Root from "./app/Root";
import Today from "./app/Today";
import Planner from "./app/Planner";
import Error from "./app/Error";
import { AuthProvider } from "../context/AuthProvider";
import { SearchProvider } from "../features/recommendations/context/SearchContext";
import Protected from "../components/Protected";
import Profile from "./app/Profile";
import History from "./app/History";
import Admin from "./app/Admin";

const routes = createBrowserRouter([
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
            {
                path: "/profile",
                element: (
                    <Protected>
                        <Profile />
                    </Protected>
                ),
            },
            {
                path: "/history/:historyId",
                element: (
                    <Protected>
                        <History />
                    </Protected>
                ),
            },
            {
                path: "/admin",
                element: (
                    <Protected adminOnly>
                        <Admin />
                    </Protected>
                ),
            },
        ],
    },
]);

export default routes;
