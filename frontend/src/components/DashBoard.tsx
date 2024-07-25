import React, { useEffect, useState } from "react"
import { Appbar } from "./Appbar"
import { Balance } from "./Balance"
import { Users } from "./Users"
import axios from "axios"

export const Dashboard = () => {
    const [balance, setBalance] = useState("0");
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    },
                });
                setBalance(response.data.balance.toFixed(2));
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };
        fetchBalance();
    }, []);
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}