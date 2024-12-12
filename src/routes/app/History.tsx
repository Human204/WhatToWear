import { useParams } from "react-router-dom";
import { useHistory } from "../../features/recommendations/api/useHistory";
import { useMemo } from "react";
import dayjs from "dayjs";
import { MapContainer } from "react-leaflet/MapContainer";
import { ChangeView } from "../../features/recommendations/components/Response";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Button } from "primereact/button";
import { useRegenerate } from "../../features/recommendations/api/useRecommendation";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";
import {
    getWeatherRange,
    weatherIcons,
} from "../../features/recommendations/api/useWeather";

export default function History() {
    const { historyId } = useParams();
    const { data: history, isFetching } = useHistory();
    const historyItem = history?.find((item) => item.id === +(historyId ?? ""));
    const weatherData = historyItem?.prompt.weatherData;
    const response = historyItem?.response;
    const clothingRecommendation =
        response && "clothingRecommendation" in response
            ? response.clothingRecommendation
            : response;
    const { mutate: regenerate, isPending } = useRegenerate();
    const transformedWeatherData = useMemo(() => {
        if (!historyItem) return null;

        const weatherData = historyItem.prompt.weatherData;
        const { nowIndex, tomorrowMidnightIndex } =
            getWeatherRange(weatherData);

        const unit = weatherData.hourly_units.temperature_2m;
        const time = weatherData.hourly.time.slice(
            nowIndex,
            tomorrowMidnightIndex
        );
        const icons = weatherData.hourly.weather_code.slice(
            nowIndex,
            tomorrowMidnightIndex
        );
        const temperature = weatherData.hourly.temperature_2m
            .slice(nowIndex, tomorrowMidnightIndex)
            .map((temp) => `${temp} ${unit}`);
        const joined = temperature.map((temp, idx) => ({
            temperature: temp,
            time: time[idx],
            icon: weatherIcons[icons[idx] as keyof typeof weatherIcons],
        }));

        return joined;
    }, [historyItem]);

    function handleRegenerate() {
        regenerate(+historyId!);
    }

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
            {isFetching ? (
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
                    <div className="relative">
                        <Button
                            className="absolute top-0 right-0"
                            icon={classNames("pi pi-sync", {
                                spin: isPending,
                            })}
                            severity="contrast"
                            onClick={handleRegenerate}
                            text
                        />
                        <img
                            className="w-full h-auto max-h-96 object-scale-down"
                            src={
                                response && "imageUrl" in response
                                    ? response.imageUrl
                                    : ""
                            }
                        />
                    </div>
                    <p className="break-all">
                        {clothingRecommendation?.summary}
                    </p>
                    <p>
                        historyItem?.recommended clothing:{" "}
                        {Object.keys(clothingRecommendation?.clothes ?? {})
                            .map((key) => {
                                const value =
                                    clothingRecommendation?.clothes[
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
