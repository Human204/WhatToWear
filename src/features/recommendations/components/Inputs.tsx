import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useSearch } from "../context/SearchContext";

export default function Inputs() {
    const [input, setInput] = useState<{
        city: string;
        favoriteTemperature: string;
        style: string;
    }>({
        city: "",
        favoriteTemperature: "",
        style: "",
    });
    const { setSearch } = useSearch();

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-rows-3 gap-4">
                <InputText
                    type="text"
                    placeholder="City"
                    onChange={(e) =>
                        setInput({ ...input, city: e.target.value })
                    }
                />
                <InputText
                    type="text"
                    name="favoriteTemperature"
                    placeholder="Preferred Temperature"
                    onChange={(e) => {
                        setInput({
                            ...input,
                            favoriteTemperature: e.target.value,
                        });
                    }}
                />
                <InputText
                    type="text"
                    name="style"
                    placeholder="Preferred style"
                    onChange={(e) => {
                        setInput({ ...input, style: e.target.value });
                    }}
                />
            </div>
            <Button
                label="Get Weather Recommendation"
                className="mx-auto"
                onClick={() => setSearch(input)}
            />
        </div>
    );
}
