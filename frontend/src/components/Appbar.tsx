import api from "../lib/axios";
import { useEffect, useState } from "react"
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

type User = {
    firstName: string,
    lastName: string
}

export const Appbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        api.get("/user/me")
            .then(response => {
                setUser(response.data.user);
            })
            .catch(error => {
                console.error("Failed to fetch user:", error);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
    };

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                Paytm App
            </div>
            <div className="flex items-center">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello, {user?.firstName || "User"}
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user?.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                </div>
                <div className="mr-2 pt-2">
                    <Button
                        disabled={false}
                        label="Logout"
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
};