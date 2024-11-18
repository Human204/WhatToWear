import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Coordinates = {
    latitude: number;
    longitude: number;
};

export type WeatherData = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: 75;
    hourly_units: {
        time: string;
        temperature_2m: string;
        weather_code: string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        weather_code: (number | string)[];
    };
};

export const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌧️",
    55: "🌧️",
    56: "🌧️❄️",
    57: "🌧️❄️",
    61: "🌦️",
    63: "🌧️",
    65: "🌧️",
    66: "🌧️❄️",
    67: "🌧️❄️",
    71: "❄️",
    73: "❄️",
    75: "❄️❄️",
    77: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    85: "❄️🌨️",
    86: "❄️❄️",
    95: "⛈️",
    96: "⛈️🌧️",
    99: "⛈️❄️",
};

async function getCoordinates(city: string) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL + `/api/city?city=${city}`
    );

    return (await response.json()) as Coordinates;
}

async function getWeather({ latitude, longitude }: Coordinates) {
    const response = await fetch(
        import.meta.env.VITE_BASE_API_URL +
            `/api/weather?latitude=${latitude}&longitude=${longitude}`
    );

    return (await response.json()) as WeatherData;
}

export function useWeather(city: string | undefined) {
    return useQuery({
        queryKey: ["weather", city],
        queryFn: async () => await getWeather(await getCoordinates(city!)),
        select(data): WeatherData {
            return {
                ...data,
                hourly: {
                    ...data.hourly,
                    weather_code: data.hourly.weather_code.map(
                        (code) =>
                            weatherIcons[code as keyof typeof weatherIcons]
                    ),
                },
            };
        },
        enabled: false,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    });
}
