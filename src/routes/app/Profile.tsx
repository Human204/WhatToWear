import { Button } from "primereact/button";
import { useHistory } from "../../features/recommendations/api/useHistory";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Shape from "../../components/Shape";

export default function Profile() {
    const { data: history } = useHistory();
    const navigate = useNavigate();

    return (
        <div className="px-11 py-6">
            <div className="flex flex-col gap-4 items-center w-full max-w-[40rem] mx-auto">
                <div className="flex items-center justify-center">
                    <Shape width={30} height={30} fillColor="purple" />
                    <h1 className="text-2xl font-bold text-center">
                        My profile
                    </h1>
                </div>
                {history?.map((item) => (
                    <Button
                        severity="contrast"
                        className="w-full"
                        key={item.id}
                        label={`Clothing for ${dayjs(item.created_at).format(
                            "YYYY-MM-DD"
                        )} in ${item.prompt.userPreferences.city}`}
                        onClick={() => {
                            navigate("/history/" + item.id);
                        }}
                        outlined
                    />
                ))}
                {history?.length === 0 && (
                    <p className="text-xl">Your profile is empty :(</p>
                )}
            </div>
        </div>
    );
}
