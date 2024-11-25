import { useMemo } from "react";
import { useWeather } from "../api/useWeather";
import { useSearch } from "../context/SearchContext";
import { useRecommendation } from "../api/useRecommendation";
import dayjs from "dayjs";
import { Skeleton } from "primereact/skeleton";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

function ChangeView({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function Response() {
    const { search } = useSearch();
    const { data: weatherData } = useWeather(search?.city);
    const transformedWeatherData = useMemo(() => {
        if (!weatherData) return null;

        const unit = weatherData.hourly_units.temperature_2m;
        const time = weatherData.hourly.time;
        const icons = weatherData.hourly.weather_code;
        const temperature = weatherData.hourly.temperature_2m.map(
            (temp) => `${temp} ${unit}`
        );
        const joined = temperature.map((temp, idx) => ({
            temperature: temp,
            time: time[idx],
            icon: icons[idx],
        }));

        return joined;
    }, [weatherData]);
    const { data: response, isFetching: isResponseLoading } = useRecommendation(
        weatherData,
        search ?? undefined
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(400px,1fr),2fr] gap-4 p-3 sm:px-11 sm:py-6 overflow-auto">
            <div className="grid grid-rows-[min-content,1fr] gap-4 overflow-auto">
                <div className="overflow-auto">
                    <div className="flex flex-col text-center text-nowrap">
                        <p className="text-3xl font-bold">
                            {transformedWeatherData?.[0]?.temperature ?? ""}
                        </p>
                    </div>
                    <div className="flex gap-6 self-center w-full overflow-auto">
                        {transformedWeatherData?.map((data, idx) => {
                            const day = dayjs(data.time).format("MM/DD");
                            const time = dayjs(data.time).format("HH:mm");
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col text-center text-nowrap"
                                >
                                    <p className="text-3xl">{data.icon}</p>
                                    <p className="text-xl font-bold">
                                        {data.temperature}
                                    </p>
                                    <div>
                                        <p>{day}</p>
                                        <p>{time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <MapContainer
                    className="w-full"
                    center={[
                        weatherData?.latitude ?? 0,
                        weatherData?.longitude ?? 0,
                    ]}
                    zoom={13}
                    scrollWheelZoom={true}
                >
                    <ChangeView
                        center={[
                            weatherData?.latitude ?? 0,
                            weatherData?.longitude ?? 0,
                        ]}
                        zoom={13}
                    />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={[
                            weatherData?.latitude ?? 0,
                            weatherData?.longitude ?? 0,
                        ]}
                    ></Marker>
                </MapContainer>
            </div>
            {isResponseLoading ? (
                <div>
                    <Skeleton height="2rem" className="mb-2"></Skeleton>
                    <Skeleton className="mb-2"></Skeleton>
                    <Skeleton className="mb-2"></Skeleton>
                    <Skeleton className="mb-2"></Skeleton>
                    <Skeleton className="mb-2"></Skeleton>
                    <Skeleton className="mb-2"></Skeleton>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {
                        <img
                            className="w-full h-auto max-h-96 object-scale-down"
                            src={response?.imageUrl}
                        />
                    }
                    <p className="break-all">
                        {response?.clothingRecommendation.summary}
                    </p>
                    <p>
                        Recommended clothing:{" "}
                        {Object.keys(
                            response?.clothingRecommendation?.clothes ?? {}
                        )
                            .map((key) => {
                                const value =
                                    response?.clothingRecommendation.clothes[
                                        key as
                                            | "hat"
                                            | "top"
                                            | "bottom"
                                            | "shoes"
                                    ];

                                return `${key} - ${value}`;
                            })
                            .join(", ")}
                    </p>
                </div>
            )}
        </div>
    );
}
