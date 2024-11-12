import { Toast } from "primereact/toast";
import { useContext, createContext, useRef, RefObject } from "react";

export const ToastContext = createContext<RefObject<Toast> | undefined>(
    undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const toast = useRef<Toast>(null);

    return (
        <ToastContext.Provider value={toast}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}
