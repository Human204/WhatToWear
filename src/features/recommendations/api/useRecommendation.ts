import { useQuery } from "@tanstack/react-query";
import { WeatherData } from "./useWeather";

export type Preferences = {
    favoriteTemperature: string;
    style: string;
};

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
            body: JSON.stringify({
                weatherData,
                userPreferences,
            }),
        }
    );

    return (await response.json()) as string;
}

export function useRecommendation(
    weatherData: WeatherData | undefined,
    userPreferences: Preferences
) {
    return useQuery({
        queryKey: [
            "recommendation",
            weatherData?.latitude,
            weatherData?.longitude,
        ],
        queryFn: () => getRecommendation(weatherData!, userPreferences),
        enabled: weatherData != null,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    });
}
