"use client";

import { BooksType } from "@/app/types/app";
import GridBookContainer from "@/components/GridBookContainer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
    const [books, setBooks] = useState<BooksType[]>([]);
    const [notFound, setNotFound] = useState(false);

    const searchParams = useSearchParams();
    const searched = searchParams.get("searched");
    const limit = searchParams.get("limit");

    useEffect(() => {
        const fetchSearchedBooks = async () => {
            const res = await fetch(
                `http://localhost:8080/search-books?searched=${searched}&limit=${limit ? limit : ""}`
            );
            const { data }: { data: BooksType[] } = await res.json();
            setBooks(data);
            if (data.length === 0) setNotFound(true);
        };
        fetchSearchedBooks();
    }, []);
    return (
        <div className="home_page ml-[220px] flex flex-col justify-center gap-4 p-4">
            <h2 className="text-xl font-bold text-white">
                Searched Results for: {searched}
                <p>{notFound && " No books found"}</p>
            </h2>
            <hr className="border-white border-opacity-20" />
            <GridBookContainer books={books} setBooks={setBooks} />
        </div>
    );
}
