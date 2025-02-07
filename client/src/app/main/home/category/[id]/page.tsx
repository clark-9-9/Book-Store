"use client";

import { BooksType } from "@/app/types/app";
import GridBookContainer from "@/components/GridBookContainer";
import { categories } from "@/data/Home";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Category() {
    const params = useParams<{ id: string }>();
    const [books, setBooks] = useState<BooksType[]>([]);
    const searchParams = useSearchParams();
    const limit = searchParams.get("limit") || "50000";

    useEffect(() => {
        const category = categories.find(
            (category) => category.id === params.id
        );

        const fetchCategory = async () => {
            const res = await fetch(
                `http://localhost:8080/category/${category!.name}?limit=${limit}`
            );
            const { data }: { data: BooksType[] } = await res.json();
            setBooks(data);
        };
        fetchCategory();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="home_page ml-[220px] flex flex-col justify-center gap-4 p-4">
            <h2 className="text-xl font-bold text-white">
                {(() => {
                    const category = categories.find(
                        (category) => category.id === params.id
                    );
                    return category!.name;
                })()}
            </h2>

            <hr className="border-white border-opacity-20" />

            <GridBookContainer books={books} setBooks={setBooks} />
        </div>
    );
}
