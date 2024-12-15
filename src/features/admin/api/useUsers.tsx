import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type User = {
    id: number;
    username: string;
    email: string;
};

async function getUsers(): Promise<User[]> {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + "/admin/users",
        {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        }
    );

    if (!response.ok) {
        throw new Error("Users fetch error");
    }

    return response.json();
}

async function deleteUser(id: number) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + `/admin/users/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        }
    );

    if (!response.ok) {
        throw new Error("User delete error");
    }
}

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        staleTime: 1_000 * 60 * 5,
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess(_, id) {
            queryClient.setQueryData(["users"], (oldUsers: User[]) => {
                return oldUsers.filter((u) => u.id !== id);
            });
        },
    });
}
