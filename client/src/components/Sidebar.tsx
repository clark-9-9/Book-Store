"use client";

import { Bookmark, House, LayoutGrid, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import header_book from "../assets/imgs/book_header.svg";
import { useEffect, useState } from "react";

const sidebarLinks = [
    {
        icon: <House />,
        label: "Home",
        href: "/main/home",
    },
    {
        icon: <LayoutGrid />,
        label: "Dashboard",
        href: "/main/dashboard",
    },
    {
        icon: <Bookmark />,
        label: "Bookmarks",
        href: "/main/bookmarks",
    },
    {
        icon: <Settings />,
        label: "Settings",
        href: "/main/settings",
    },
    {
        icon: <LogOut />,
        label: "Logout",
        // href: "/",
    },
];

function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState<string | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("userData");
        setUserData(data);

        // if no user loged in this causes the main page redirect to homepage
        // if (!data) {
        //     router.push("/");
        // }
    }, [router]);
    return (
        <aside className="sidebar fixed bottom-0 top-0 z-30 w-[220px] px-[15px] py-[32px]">
            <Image src={header_book} alt="" priority />

            <article className="sidebar_links mt-[50px] flex flex-col gap-4">
                {sidebarLinks.map((link, index) => {
                    const isActive = pathname.startsWith(link.href!);

                    return (
                        <Link
                            href={
                                link.label === "Logout"
                                    ? "/"
                                    : ["Bookmarks", "Settings"].includes(
                                            link.label
                                        )
                                      ? userData
                                          ? link.href || ""
                                          : ""
                                      : link.href || ""
                            }
                            onClick={() => {
                                if (link.label === "Logout") {
                                    localStorage.removeItem("userData");
                                    router.push("/");
                                }

                                if (
                                    link.label === "Bookmarks" ||
                                    link.label === "Settings"
                                ) {
                                    if (!userData)
                                        alert(
                                            "Please login to access this page"
                                        );
                                }
                            }}
                            key={index}
                            className={`flex items-center gap-4 rounded-[7px] px-[12px] py-[8px] text-[13px] hover:bg-[var(--book-container-color)] ${
                                isActive
                                    ? "bg-box_container_color text-white"
                                    : ""
                            }`}
                        >
                            {link.icon}
                            {(() => {
                                return link.label === "Logout" && !userData
                                    ? "Go Back"
                                    : link.label;
                            })()}
                        </Link>
                    );
                })}
            </article>
        </aside>
    );
}

export default Sidebar;
