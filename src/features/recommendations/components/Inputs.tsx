import { Button } from "primereact/button";
import { useCallback, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { Dropdown } from "primereact/dropdown";
import { City, useCities } from "../api/useCities";
import { useDebounce } from "primereact/hooks";
import { AutoComplete } from "primereact/autocomplete";

export default function Inputs() {
    const transformCities = useCallback((cities: City[]) => {
        return cities.map((city) => `${city.name}, ${city.country}`);
    }, []);
    const [input, setInput] = useState<{
        favoriteTemperature?: string;
        style?: string;
    }>({});
    const [city, debouncedCity, setCity] = useDebounce("", 750);
    const { data: cities } = useCities(debouncedCity, transformCities);
    const { setSearch } = useSearch();

    return (
        <form
            className="flex flex-col gap-2 w-full max-w-96"
            onSubmit={(event) => {
                event.preventDefault();
            }}
        >
            <div className="grid grid-rows-3 gap-4">
                <AutoComplete
                    inputClassName="w-full"
                    placeholder="City"
                    value={city}
                    suggestions={cities}
                    completeMethod={() => {}}
                    onChange={(event) => {
                        setCity(event.value);
                    }}
                    forceSelection
                />
                <Dropdown
                    type="text"
                    name="favoriteTemperature"
                    placeholder="Preferred Temperature"
                    options={[
                        "Very cold",
                        "Cold",
                        "Neutral",
                        "Hot",
                        "Very hot",
                    ]}
                    value={input.favoriteTemperature}
                    onChange={(e) => {
                        setInput({
                            ...input,
                            favoriteTemperature: e.target.value,
                        });
                    }}
                />
                <Dropdown
                    type="text"
                    name="style"
                    placeholder="Preferred style"
                    options={[
                        "Sport",
                        "Streetwear",
                        "Vintage",
                        "Renaissance",
                        "Business formal",
                        "Goth",
                        "Punk",
                        "Summer chic",
                        "Winter cozy",
                        "E-girl",
                        "E-boy",
                        "Smart casual",
                    ]}
                    value={input.style}
                    onChange={(e) => {
                        setInput({ ...input, style: e.target.value });
                    }}
                    filter
                />
            </div>
            <Button
                label="Get Weather Recommendation"
                className="mx-auto"
                onClick={() => {
                    const cityName = city.split(",")[0];

                    if (!cityName) return;

                    setSearch({ ...input, city: cityName });
                }}
                disabled={!debouncedCity}
            />
        </form>
    );
}
