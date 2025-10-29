import { useEffect, useState } from "react";
import { Button } from "./Button"
import { useNavigate } from "react-router-dom";
import axios from "axios";

type UserType = {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
}

export const Users = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/bulk?filter=${filter}`)
                .then(response => {
                    setUsers(response.data.user)
                })
                .catch(error => {
                    console.error("Failed to fetch users:", error);
                });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filter]);
    
    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200" onChange={(e) => {
                setFilter(e.target.value)
            }}></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

function User({ user }: { user: UserType }) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                navigate(`/send?id=${user._id}&name=${user.firstName}`);
            }} label={"Send Money"} />
        </div>
    </div>
}