import axios from "axios";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get("id");
    const name = searchParams.get("name");

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            await api.post("/account/transfer", {
                to: id,
                amount: Number(amount)
            });

            alert(`Successfully transferred ₹${amount} to ${name}`);
            navigate("/dashboard");
        } catch (error) {
            console.error("Transfer failed:", error);
            let errorMessage = "Transfer failed. Please try again.";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {name?.[0]?.toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>

                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Amount (in ₹)
                                </label>
                                <input
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleTransfer}
                                disabled={loading}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Initiate Transfer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};