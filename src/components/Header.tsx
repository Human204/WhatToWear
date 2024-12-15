import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Menubar } from "primereact/menubar";
import { useCallback, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm";
import { TabPanel, TabView } from "primereact/tabview";
import RegisterForm from "../features/auth/components/RegisterForm";
import { useAuth } from "../context/AuthProvider";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useLogout } from "../features/auth/api/useAuth";

export default function Header() {
    const { user } = useAuth();
    const { mutate: logout } = useLogout();
    const menuRef = useRef<Menu>(null);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const hideHandler = useCallback(() => {
        setVisible(false);
    }, []);
    const changeTab = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);
    const model: MenuItem[] = [
        {
            label: "Profile",
            icon: "pi pi-user",
            command() {
                navigate("/profile");
            },
        },
        {
            label: "Admin panel",
            icon: "pi pi-objects-column",
            visible: user?.role === "admin",
            command() {
                navigate("/admin");
            },
        },
        {
            separator: true,
        },
        {
            label: "Log out",
            icon: "pi pi-sign-out",
            command() {
                logout();
            },
        },
    ];

    return (
        <>
            <Menu model={model} ref={menuRef} popup />
            <Dialog
                header={activeIndex ? "Register" : "Sign in"}
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
                <Divider className="m-0">or</Divider>
                <div className="flex flex-col items-center">
                    <Button
                        label="Continue with Google"
                        className="text-black"
                        icon="pi pi-google"
                        onClick={() => {
                            window.open(
                                `${
                                    import.meta.env.VITE_BASE_API_URL
                                }/auth/google`,
                                "_self"
                            );
                        }}
                        text
                    />
                    <Button
                        label="Continue with Facebook"
                        className="text-black"
                        icon="pi pi-facebook"
                        onClick={() => {
                            window.open(
                                `${
                                    import.meta.env.VITE_BASE_API_URL
                                }/auth/facebook`,
                                "_self"
                            );
                        }}
                        text
                    />
                </div>
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
                                onClick={() => {
                                    setVisible(true);
                                    setActiveIndex(0);
                                }}
                                outlined
                            />
                            <Button
                                label="Sign up"
                                size="small"
                                onClick={() => {
                                    setVisible(true);
                                    setActiveIndex(1);
                                }}
                            />
                        </div>
                    ) : (
                        <Button
                            className="p-0"
                            severity="secondary"
                            onClick={(event) => {
                                menuRef.current?.toggle(event);
                            }}
                            text
                        >
                            <Avatar
                                className="text-black"
                                label={user.username.slice(0, 1)}
                            />
                        </Button>
                    )
                }
            />
        </>
    );
}
