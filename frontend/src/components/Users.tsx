import { useEffect, useState } from "react";
import { Button } from "./Button"
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
}

export const Users = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearching(true);

            api.get(`/user/bulk?filter=${filter}`)
                .then(response => {
                    setUsers(response.data.user || []);
                })
                .catch(error => {
                    console.error("Failed to fetch users:", error);
                })
                .finally(() => {
                    setLoading(false);
                    setSearching(false);
                });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="text-gray-500">Loading users...</div>
            </div>
        );
    }

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2 relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                    onChange={(e) => {
                        setFilter(e.target.value)
                    }}
                />
                {searching && (
                    <div className="absolute right-2 top-2">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    </div>
                )}
            </div>
            <div>
                {users.length === 0 && !searching && (
                    <div className="text-gray-500 py-4">No users found</div>
                )}
                {users.map(user => <User key={user._id} user={user} />)}
            </div>
        </>
    )
}

function User({ user }: { user: UserType }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between py-2">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0].toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button
                    onClick={() => {
                        navigate(`/send?id=${user._id}&name=${user.firstName}`);
                    }}
                    disabled={false}
                    label="Send Money"
                />
            </div>
        </div>
    )
}