import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { PasswordInput } from "../components/PasswordInput"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import api from "../lib/axios"

export const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignin = async () => {
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/user/signin", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Signin failed:", error);

            let errorMessage = "Signin failed. Please try again.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label="Sign in" />
                    <SubHeading label="Enter your credentials to access your account" />

                    <InputBox
                        placeholder="johndoe@gmail.com"
                        label="Email"
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />

                    <PasswordInput
                        placeholder="Example@123"
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="pt-4">
                        <Button
                            label={loading ? "Signing in..." : "Sign in"}
                            disabled={loading}
                            onClick={handleSignin}
                        />
                    </div>

                    <BottomWarning
                        label="Don't have an account?"
                        link="Sign up"
                        to="/signup"
                    />
                </div>
            </div>
        </div>
    )
}