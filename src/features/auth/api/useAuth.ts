import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastProvider";

export type Credentials = {
    username: string;
    email: string;
    password: string;
};

export type User = {
    email: string;
    username: string;
};

async function login(credentials: Omit<Credentials, "email">): Promise<User> {
    const response = await fetch(import.meta.env.VITE_BASE_API_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
}

async function logout() {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + "/logout",
        {
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    return response.json();
}

async function register(credentials: Credentials): Promise<void> {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + "/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(credentials),
        }
    );

    if (!response.ok) {
        throw new Error("Registration failed");
    }
}

async function me(): Promise<User> {
    const response = await fetch(import.meta.env.VITE_BASE_API_URL + "/me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("User not found");
    }

    return response.json();
}

export function useLogin() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: login,
        async onSuccess() {
            toast.current?.show({
                severity: "success",
                summary: "Login successful",
            });

            await queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: logout,
        async onSuccess() {
            toast.current?.show({
                severity: "success",
                summary: "Logged out successfully",
            });

            await queryClient.resetQueries({ queryKey: ["me"] });
        },
    });
}

export function useRegister() {
    const toast = useToast();

    return useMutation({
        mutationFn: register,
        onSuccess() {
            toast.current?.show({
                severity: "success",
                summary: "Registration successful",
            });
        },
    });
}

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: me,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    });
}
