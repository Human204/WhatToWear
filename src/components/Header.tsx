import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <Menubar
            className="px-11 py-3"
            start={() => (
                <NavLink
                    to="/"
                    className="mr-6 text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-400 text-transparent bg-clip-text"
                >
                    WhatToWear
                </NavLink>
            )}
            model={[
                {
                    label: "Today",
                    command() {
                        navigate("/");
                    },
                },
                {
                    label: "Trip planner",
                    command() {
                        navigate("/planner");
                    },
                },
            ]}
            end={() => (
                <div className="flex gap-4">
                    <Button label="Sign in" size="small" outlined />
                    <Button label="Sign up" size="small" />
                </div>
            )}
        />
    );
}
