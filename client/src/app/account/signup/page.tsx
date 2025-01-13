"use client";
import Link from "next/link";
import "../../styles/signup.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) router.push("/main/home");
    });

    const handleUserSignup = async (e) => {
        e.preventDefault();

        const bodyRequest = {
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
        };

        const response = await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyRequest),
        });
        const data = await response.json();
        console.log(data);

        if (data.error) {
            alert(data.error);
            return;
        } else {
            alert(data.message);
            router.push("/account/login");
        }
    };

    return (
        <div className="signup_body">
            <div className="form-container">
                <h2>Sign up</h2>
                <form>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="email">Username</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Enter Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="**********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Link href={"/account/login"} className="text-sky-500">
                        Login
                    </Link>

                    <button
                        type="submit"
                        className="btn"
                        onClick={handleUserSignup}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
