import { Button } from "primereact/button";
import { useHistory } from "../../features/recommendations/api/useHistory";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function Profile() {
    const { data: history } = useHistory();
    const navigate = useNavigate();

    return (
        <div className="px-11 py-6">
            <div className="flex flex-col gap-4 w-full max-w-[40rem] mx-auto">
                {history?.map((item) => (
                    <Button
                        key={item.id}
                        label={dayjs(item.created_at).format(
                            "YYYY-MM-DD HH:mm"
                        )}
                        onClick={() => {
                            navigate("/history/" + item.id);
                        }}
                        severity="contrast"
                        outlined
                    />
                ))}
            </div>
        </div>
    );
}
