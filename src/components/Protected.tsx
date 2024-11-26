import { ReactNode } from "react";
import { useAuth } from "../context/AuthProvider";

export default function Protected({ children }: { children: ReactNode }) {
    const auth = useAuth();

    if (!auth?.user) return null;

    return children;
}
