import { ReactNode } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Protected({ children }: { children: ReactNode }) {
    const auth = useAuth();

    if (auth.isLoading) {
        return (
            <div className="h-dvh grid place-items-center">
                <ProgressSpinner className="w-9 h-9" animationDuration=".5s" />
            </div>
        );
    }

    if (!auth?.user) {
        return <Navigate to="/" replace />;
    }

    return children;
}
