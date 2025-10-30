import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../lib/axios";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                await api.get("/user/me");
                setIsAuthenticated(true);
            } catch (error: unknown) {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                alert(`Error:${error}`)
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        );
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};