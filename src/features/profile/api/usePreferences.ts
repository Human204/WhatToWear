import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastProvider";

async function savePreferences(preferences: Record<string, string>) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + "/api/user/preferences",
        {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ preferences }),
        }
    );

    if (!response.ok) {
        throw new Error("City fetch error");
    }
}

export function useSavePreferences() {
    const toast = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: savePreferences,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.current?.show({
                severity: "success",
                summary: "Preferences saved",
            });
        },
    });
}
