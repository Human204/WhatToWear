import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

import "primeicons/primeicons.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "./context/ToastProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <PrimeReactProvider>
                <ToastProvider>
                    <RouterProvider router={router} />
                </ToastProvider>
            </PrimeReactProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);
