import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Menubar } from "primereact/menubar";
import { useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm";
import { TabPanel, TabView } from "primereact/tabview";
import RegisterForm from "../features/auth/components/RegisterForm";
import { useAuth } from "../context/AuthProvider";

export default function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const hideHandler = useCallback(() => {
        setVisible(false);
    }, []);

    const changeTab = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    return (
        <>
            <Dialog
                header="Sign in"
                className="w-full max-w-[30rem]"
                onHide={() => {
                    setVisible(false);
                }}
                visible={visible}
                resizable={false}
                draggable={false}
            >
                <TabView
                    panelContainerClassName="px-0"
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                >
                    <TabPanel header="Login">
                        <LoginForm successHandler={hideHandler} />
                    </TabPanel>
                    <TabPanel header="Register">
                        <RegisterForm successHandler={changeTab} />
                    </TabPanel>
                </TabView>
            </Dialog>
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
                end={() =>
                    !user ? (
                        <div className="flex gap-4">
                            <Button
                                label="Sign in"
                                size="small"
                                onClick={() => setVisible(true)}
                                outlined
                            />
                            <Button label="Sign up" size="small" />
                        </div>
                    ) : (
                        user.username
                    )
                }
            />
        </>
    );
}
