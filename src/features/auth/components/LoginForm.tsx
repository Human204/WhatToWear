import { useState } from "react";
import { useLogin } from "../api/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

type Props = {
    successHandler: () => void;
};

export default function LoginForm({ successHandler }: Props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { mutate, isPending } = useLogin();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutate(
            { username, password },
            {
                onSuccess() {
                    setUsername("");
                    setPassword("");
                    successHandler();
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputText
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Password
                placeholder="Password"
                inputClassName="w-full"
                pt={{ iconField: { root: { className: "w-full" } } }}
                feedback={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
            />
            <Button
                type="submit"
                label="Login"
                disabled={!username && !password}
                loading={isPending}
            />
        </form>
    );
}
