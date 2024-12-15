import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WeatherData } from "./useWeather";
import { ClothingRecommendation, History } from "./useHistory";

export type Preferences = {
    city: string;
    favoriteTemperature?: string;
    style?: string;
};

async function regenerate(id: number) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + "/api/chatgpt/regenerate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
            body: JSON.stringify({ id }),
        }
    );

    return (await response.text()) as string;
}

async function getRecommendation(
    weatherData: WeatherData,
    userPreferences: Preferences
) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + "/api/chatgpt",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
            body: JSON.stringify({
                weatherData,
                userPreferences,
            }),
        }
    );

    return (await response.json()) as {
        clothingRecommendation: ClothingRecommendation;
        imageUrl: string;
    };
}

async function rateGeneration({ id, rating }: { id: number; rating: number }) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + `/api/rate/${id}/${rating}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        }
    );

    if (!response.ok) {
        throw new Error("Generation rate error");
    }
}

export function useRegenerate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: regenerate,
        async onSuccess() {
            console.log("Success");
            await queryClient.invalidateQueries({ queryKey: ["history"] });
        },
    });
}

export function useRecommendation(
    weatherData: WeatherData | undefined,
    userPreferences: Preferences | null | undefined
) {
    return useQuery({
        queryKey: [
            "recommendation",
            weatherData?.latitude,
            weatherData?.longitude,
        ],
        queryFn: () => getRecommendation(weatherData!, userPreferences!),
        enabled: weatherData != null && userPreferences != null,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    });
}

export function useRateGeneration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rateGeneration,
        onSuccess(_, { id, rating }) {
            queryClient.setQueryData(["history"], (oldHistory: History[]) => {
                return oldHistory.map((h) => {
                    if (h.id !== id) return h;

                    return {
                        ...h,
                        rating,
                    };
                });
            });
        },
    });
}
