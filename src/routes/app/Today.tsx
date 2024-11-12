import React, { useMemo, useState } from "react";
import {
    Preferences,
    useRecommendation,
} from "../../features/recommendations/api/useRecommendation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useWeather } from "../../features/recommendations/api/useWeather";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
        const time = [...weatherData.hourly.time];
        const temperature = weatherData.hourly.temperature_2m.map(
            (temp) => `${temp} ${unit}`
        );
        const joined = temperature.map((temp, idx) => ({
            temperature: temp,
            time: time[idx],
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
            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                {transformedWeatherData && (
                    <DataTable
                        className="overflow-y-auto"
                        scrollHeight="flex"
                        value={transformedWeatherData}
                        loading={isWeatherLoading}
                        scrollable
                    >
                        <Column
                            field="time"
                            header="Laikas"
                            body={({
                                time,
                            }: {
                                temperature: number;
                                time: string;
                            }) => dayjs(time).format("YYYY-MM-DD HH:mm:ss")}
                        ></Column>
                        <Column
                            field="temperature"
                            header="Temperatūra"
                        ></Column>
                    </DataTable>
                )}
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
                        <p className="w-full max-w-[96ch] mx-auto">
                            {response}
                        </p>
                    )
                )}
            </div>
        </div>
    );
}
