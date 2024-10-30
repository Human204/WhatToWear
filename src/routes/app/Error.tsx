import { NavLink, useRouteError } from "react-router-dom";

export default function Error() {
    const error = useRouteError();

    return (
        <div className="grid place-items-center h-dvh ">
            <div className="text-center">
                <p className="text-2xl font-bold">
                    {(error as Error)?.message ||
                        (error as { statusText?: string })?.statusText}
                </p>
                <NavLink to="/" className="text-blue-700 hover:underline">
                    Go to home page
                </NavLink>
            </div>
        </div>
    );
}
