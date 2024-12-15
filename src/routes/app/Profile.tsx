import { Button } from "primereact/button";
import { useHistory } from "../../features/recommendations/api/useHistory";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Shape from "../../components/Shape";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { useSavePreferences } from "../../features/profile/api/usePreferences";
import { useMe } from "../../features/auth/api/useAuth";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Profile() {
    const { mutate: savePreferences, isPending } = useSavePreferences();
    const { data: history, isLoading } = useHistory();
    const { data: user } = useMe();
    const navigate = useNavigate();
    const [input, setInput] = useState(
        user?.preferences ?? {
            sex: "",
            favoriteTemperature: "",
            style: "",
        }
    );

    useEffect(() => {
        if (!user?.preferences) return;

        setInput(user.preferences);
    }, [user?.preferences]);

    return (
        <div className="px-11 py-6">
            <div className="w-full max-w-[40rem] mx-auto">
                <div className="flex items-center justify-center">
                    <Shape width={30} height={30} fillColor="purple" />
                    <h1 className="text-2xl font-bold text-center">
                        My profile
                    </h1>
                </div>
                <div>
                    <h2 className="text-xl text-center font-semibold mb-1">
                        Preferences
                    </h2>
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={(event) => {
                            event.preventDefault();

                            savePreferences(input);
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <label htmlFor="sex">Sex</label>
                            <Dropdown
                                inputId="sex"
                                type="text"
                                placeholder="Sex"
                                options={["Male", "Female", "Other"]}
                                value={input.sex}
                                onChange={(e) => {
                                    setInput({
                                        ...input,
                                        sex: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="temperature">
                                Preferred temperature
                            </label>
                            <Dropdown
                                inputId="temperature"
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
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="style">Preferred style</label>
                            <Dropdown
                                inputId="style"
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
                                    setInput({
                                        ...input,
                                        style: e.target.value,
                                    });
                                }}
                                filter
                            />
                        </div>
                        <Button
                            label="Save"
                            className="ml-auto"
                            severity="contrast"
                            loading={isPending}
                        />
                    </form>
                </div>
                <div>
                    <h2 className="text-xl text-center font-semibold mb-1">
                        History
                    </h2>
                    <div className="flex flex-col gap-1">
                        {history?.map((item) => (
                            <Button
                                severity="contrast"
                                className="w-full"
                                key={item.id}
                                label={`Clothing for ${dayjs(
                                    item.created_at
                                ).format("YYYY-MM-DD")} in ${
                                    item.prompt.userPreferences.city
                                }`}
                                onClick={() => {
                                    navigate("/history/" + item.id);
                                }}
                                outlined
                            />
                        ))}
                        {isLoading && <ProgressSpinner className="w-9 h-9" />}
                        {history?.length === 0 && (
                            <p className="text-xl text-center">
                                Your history is empty :(
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
