"use client";
import "../../styles/settings.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDataType } from "@/app/types/app";
import { X } from "lucide-react";
export default function Settings() {
    const [userData, setUserData] = useState<UserDataType[]>([]);
    const [changeData, setChangeData] = useState<{
        userId: string;
        change: "username" | "email" | "password";
    }>({ userId: "", change: "username" });
    const [inputValue, setInputValue] = useState("");
    const [showChangePopup, setShowChangePopup] = useState(false);
    const router = useRouter();

    const handleChangeUserData = async () => {
        const res = await fetch(`http://localhost:8080/change-user-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: changeData.userId,
                change: changeData.change,
                inputValue,
            }),
        });
        const data: { message: string } = await res.json();
        setShowChangePopup(false);
        alert(data.message);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    useEffect(() => {
        const localeUserData = localStorage.getItem("userData");
        if (!localeUserData) router.push("/");
    });

    useEffect(() => {
        const localeUserData = localStorage.getItem("userData");

        const { userId }: { userId: string; username: string } = JSON.parse(
            localeUserData!
        );

        const getUserData = async () => {
            const res = await fetch(`http://localhost:8080/user-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                }),
            });
            const { data }: { data: UserDataType[] } = await res.json();
            setUserData(data);
        };

        getUserData();
    }, []);

    return (
        <div className="settings_body relative ml-[220px] flex flex-col justify-center">
            <div
                className={`change_data_popup animate__animated fixed inset-0 z-[25] m-auto flex h-[200px] w-fit items-center justify-center gap-2 rounded bg-box_container_color p-4 duration-200 ease-in-out ${
                    showChangePopup
                        ? "animate__fadeInDown opacity-1 visible"
                        : "invisible opacity-0"
                }`}
            >
                <X
                    size={20}
                    color="white"
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={() => {
                        setShowChangePopup(false);
                        setInputValue("");
                    }}
                />

                <input
                    type="text"
                    className="rounded px-4 py-2 text-black"
                    placeholder="change"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    className="rounded bg-blue_color px-4 py-2 outline-none"
                    onClick={handleChangeUserData}
                >
                    Apply
                </button>
            </div>

            <section className="main-content">
                <article className="info-container">
                    <div className="info-box">
                        <h3>Basic Information</h3>
                        <div>
                            <p>Username</p>
                            <p>
                                {userData[0]
                                    ? userData[0].username
                                    : "Username"}
                            </p>
                            <button
                                onClick={() => {
                                    setShowChangePopup(true);
                                    setChangeData({
                                        userId: userData[0].id,
                                        change: "username",
                                    });
                                }}
                            >
                                ✎
                            </button>
                        </div>
                        <div>
                            <p>Email</p>
                            <p>{userData[0] ? userData[0].email : "email"}</p>
                            <button
                                onClick={() => {
                                    setShowChangePopup(true);
                                    setChangeData({
                                        userId: userData[0].id,
                                        change: "email",
                                    });
                                }}
                            >
                                ✎
                            </button>
                        </div>
                    </div>
                    <div className="info-box">
                        <h3>Password</h3>
                        <div>
                            <p>PS</p>
                            <p>************</p>
                            <button
                                onClick={() => {
                                    setShowChangePopup(true);
                                    setChangeData({
                                        userId: userData[0].id,
                                        change: "password",
                                    });
                                }}
                            >
                                ✎
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
}
