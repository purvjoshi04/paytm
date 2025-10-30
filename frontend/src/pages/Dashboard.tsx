import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import api from "../lib/axios"

export const Dashboard = () => {
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/account/balance")
            .then(response => {
                setBalance(response.data.balance);
            })
            .catch(error => {
                console.error("Failed to fetch balance:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance} loading={loading} />
                <Users />
            </div>
        </div>
    );
}