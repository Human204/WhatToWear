import { useQuery } from "@tanstack/react-query";

export type City = {
    name: string;
    local_names: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
    state: string;
};

async function getCities(query: string) {
    const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${
            import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
    );

    if (!response.ok) {
        throw new Error("City fetch error");
    }

    return (await response.json()) as City[];
}

export function useCities<TData = City[]>(
    query?: string,
    select?: (data: City[]) => TData
) {
    return useQuery({
        queryKey: ["city", query],
        queryFn: () => getCities(query!),
        select,
        enabled: !!query,
        staleTime: Infinity,
        retry: 0,
        refetchOnWindowFocus: false,
    });
}
