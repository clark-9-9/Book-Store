"use client";
import { BooksType } from "@/app/types/app";
import GridBookContainer from "@/components/GridBookContainer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [books, setBooks] = useState<BooksType[]>([]);
    const params = useParams<{ info: string[] }>();
    const collection_name = params.info[0];
    const collection_id = params.info[1];
    const router = useRouter();

    useEffect(() => {
        const localeUserData = localStorage.getItem("userData");
        if (!localeUserData) router.push("/");
    });

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const getBooksFromTheCollection = async () => {
                const response = await fetch(
                    "http://localhost:8080/get-collection-saved-books",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: JSON.parse(userData).userId,
                            collectionId: collection_id,
                        }),
                    }
                );

                const { data }: { data: BooksType[] } = await response.json();
                setBooks(data);
            };
            getBooksFromTheCollection();
        }
    }, []);

    return (
        <div className="home_page ml-[220px] flex flex-col justify-center gap-4 p-4">
            <h2 className="text-xl font-bold text-white">
                {collection_name && decodeURIComponent(collection_name)}
            </h2>

            <hr />

            <GridBookContainer books={books} setBooks={setBooks} />
        </div>
    );
}
