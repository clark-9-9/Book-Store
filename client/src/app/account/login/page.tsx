"use client";

import { useEffect, useState } from "react";
import "../../styles/login.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) router.push("/main/home");
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUserLogin = async (e: any) => {
        e.preventDefault();

        const bodyRequest = {
            email,
            password,
        };

        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyRequest),
        });
        const data = await response.json();
        if (data.error) {
            alert(data.error);
            return;
        } else {
            localStorage.setItem("userData", JSON.stringify(data));
            router.push("/main/home");
        }
    };

    return (
        <div className="login_body">
            <div className="form-container">
                <h2>Sign in</h2>
                <form>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="password">Enter Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="**********"
                        required
                    />

                    <Link href={"/account/signup"} className="text-sky-500">
                        Signup
                    </Link>

                    <button
                        type="submit"
                        className="btn"
                        onClick={(e) => handleUserLogin(e)}
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
