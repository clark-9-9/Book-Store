import type { Metadata } from "next";
import "./globals.css";
import "animate.css";

export const metadata: Metadata = {
    title: "Book Store",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <section>{children}</section>
            </body>
        </html>
    );
}
