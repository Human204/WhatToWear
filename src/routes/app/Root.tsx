import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

export default function Root() {
    return (
        <div className="grid grid-rows-[auto,1fr] h-dvh">
            <Header />
            <Outlet />
        </div>
    );
}
