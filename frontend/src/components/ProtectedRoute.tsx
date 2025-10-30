import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../lib/axios";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
            } catch (error) {
                console.error("Authentication failed:", error);
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
};