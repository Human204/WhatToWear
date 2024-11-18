import React, { useMemo, useState } from "react";
import {
    Preferences,
    useRecommendation,
} from "../../features/recommendations/api/useRecommendation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useWeather } from "../../features/recommendations/api/useWeather";
import dayjs from "dayjs";
import { Skeleton } from "primereact/skeleton";

export default function Today() {
    const [city, setCity] = useState<string>("");
    const [preferences, setPreferences] = useState<Preferences>({
        favoriteTemperature: "",
        style: "",
    });
    const {
        data: weatherData,
        isFetching: isWeatherLoading,
        refetch,
    } = useWeather(city);
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
        preferences
    );

    function handlePreferenceChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPreferences({
            ...preferences,
            [e.target.name]: e.target.value,
        });
    }

    function handleGetRecommendation() {
        refetch();
    }

    return (
        <div className="flex flex-col gap-2 h-full px-11 py-6 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-4">
                    <InputText
                        type="text"
                        placeholder="City"
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <InputText
                        type="text"
                        name="favoriteTemperature"
                        placeholder="Preferred Temperature"
                        onChange={handlePreferenceChange}
                    />
                    <InputText
                        type="text"
                        name="style"
                        placeholder="Preferred style"
                        onChange={handlePreferenceChange}
                    />
                </div>
                <Button
                    label="Get Weather Recommendation"
                    className="mx-auto"
                    onClick={handleGetRecommendation}
                    loading={isResponseLoading || isWeatherLoading}
                />
            </div>
            <div className="grid grid-rows-2 justify-center gap-4 max-w-[96ch] mx-auto">
                <div className="flex gap-6 overflow-y-auto">
                    {transformedWeatherData?.map((data) => {
                        const day = dayjs(data.time).format("MM/DD");
                        const time = dayjs(data.time).format("HH:mm");
                        return (
                            <div className="grid grid-rows-3 text-center text-nowrap">
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
                    response && (
                        <p className="break-all">{JSON.stringify(response)}</p>
                    )
                )}
            </div>
        </div>
    );
}
