import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider>
            {/* <App /> */}
            <RouterProvider router={router} />
        </PrimeReactProvider>
    </StrictMode>
);
