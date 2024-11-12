import { useState } from "react";
import { useRegister } from "../api/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

type Props = {
    successHandler: (index: number) => void;
};

export default function RegisterForm({ successHandler }: Props) {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { mutate, isPending } = useRegister();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutate(
            { email, username, password },
            {
                onSuccess() {
                    setEmail("");
                    setUsername("");
                    setPassword("");
                    successHandler(0);
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputText
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
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
                label="Register"
                disabled={!email && !username && !password}
                loading={isPending}
            />
        </form>
    );
}
