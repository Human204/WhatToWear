import { Button } from "primereact/button";

export default function App() {
    return (
        <div>
            <Button
                label="nespausti"
                onClick={() => {
                    alert("kam paspaudei");
                }}
            />
        </div>
    );
}
