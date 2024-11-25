import Inputs from "../../features/recommendations/components/Inputs";
import { useSearch } from "../../features/recommendations/context/SearchContext";
import Response from "../../features/recommendations/components/Response";

export default function Today() {
    const { search } = useSearch();

    return (
        <>
            {!search ? (
                <div className="grid place-items-center">
                    <Inputs />
                </div>
            ) : (
                <Response />
            )}
        </>
    );
}
