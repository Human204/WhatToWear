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
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
    };
};

async function getCoordinates(city: string) {
    const response = await fetch(`http://localhost:5000/api/city?city=${city}`);

    return (await response.json()) as Coordinates;
}

async function getWeather({ latitude, longitude }: Coordinates) {
    const response = await fetch(
        `http://localhost:5000/api/weather?latitude=${latitude}&longitude=${longitude}`
    );

    return (await response.json()) as WeatherData;
}

export function useWeather(city: string | undefined) {
    return useQuery({
        queryKey: ["weather", city],
        queryFn: async () => await getWeather(await getCoordinates(city!)),
        enabled: false,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    });
}
