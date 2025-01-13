"use client";

import { CollectionType } from "@/app/types/app";
import { Box, Modal } from "@mui/material";
import { CirclePlus, CircleX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NumberOfBooksInCollectionType {
    id: string;
    count: number;
}

export default function Collections() {
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [showAddCollectionPopup, setShowAddCollectionPopup] = useState(false);
    const [numOfBooksInCollection, setNumOfBooksInCollection] = useState<
        NumberOfBooksInCollectionType[]
    >([]);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) router.push("/");
    });

    const addCollection = async () => {
        const userData = localStorage.getItem("userData");

        if (userData) {
            const response = await fetch(
                "http://localhost:8080/add-collection",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: JSON.parse(userData).userId,
                        name: inputValue,
                    }),
                }
            );

            await response.json();
            setShowAddCollectionPopup(false);
            setInputValue("");
            window.location.reload();
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("userData")!;

        const getCollections = async () => {
            const response = await fetch(
                "http://localhost:8080/get-collections",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: JSON.parse(userData).userId,
                    }),
                }
            );

            const {
                data,
                numOfBooksInCollection,
            }: {
                data: CollectionType[];
                numOfBooksInCollection: NumberOfBooksInCollectionType[];
            } = await response.json();
            setCollections(data);
            setNumOfBooksInCollection(numOfBooksInCollection);
        };

        getCollections();
    }, []);

    return (
        <section className="relative ml-[220px] flex h-[100vh] flex-col items-center justify-center p-4">
            <Modal
                open={showAddCollectionPopup}
                onClose={() => setShowAddCollectionPopup(false)}
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        id="add_collection_popup"
                        sx={{
                            padding: "1rem",
                            maxWidth: "500px",
                            backgroundColor: "var(--box_container_color)",
                            borderRadius: "5px",
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <X
                                size={20}
                                color="white"
                                className="cursor-pointer"
                                onClick={() => {
                                    setShowAddCollectionPopup(false);
                                    setInputValue("");
                                }}
                            />

                            <input
                                type="text"
                                className="rounded px-4 py-2 text-black"
                                placeholder="add"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        addCollection();
                                        setShowAddCollectionPopup(false);
                                        setInputValue("");
                                        window.location.reload();
                                    }
                                }}
                            />
                            <button
                                className="rounded bg-blue_color px-4 py-2 outline-none"
                                onClick={addCollection}
                            >
                                Add
                            </button>
                        </div>
                    </Box>
                </Box>
            </Modal>

            <article className="h-full w-full rounded-[10px] bg-box_container_color p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Book Collections</h3>

                    <div className="flex gap-2">
                        <button
                            className="flex items-center justify-center gap-2 rounded border-none bg-blue_color p-2 px-3 outline-none duration-200 ease-in-out hover:opacity-50"
                            onClick={() => setShowAddCollectionPopup(true)}
                        >
                            <p>Add</p>
                            <CirclePlus />
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 rounded border-none bg-red-500 p-2 px-3 outline-none duration-200 ease-in-out hover:opacity-50"
                            onClick={() => setShowAddCollectionPopup(true)}
                        >
                            <p>Delete</p>
                            <CircleX />
                        </button>
                    </div>
                </div>

                <hr className="mt-4 border-white border-opacity-20" />

                <div className="book_collections_grid_container mt-4">
                    {collections.map((collection) => {
                        return (
                            <div
                                className="collection flex cursor-pointer gap-4 rounded px-4 py-2 duration-200 ease-in-out"
                                key={collection.id}
                                onClick={() => {
                                    router.push(
                                        `/main/bookmarks/${collection.collection_name}/${collection.id}`
                                    );
                                }}
                            >
                                <div className="h-[50px] min-w-[50px] truncate rounded bg-white"></div>

                                <div className="flex w-full flex-col gap-1">
                                    <p className="w-full max-w-[140px] font-bold">
                                        {collection.collection_name}
                                    </p>
                                    <p className="opacity-80">
                                        {numOfBooksInCollection.map((coll) => {
                                            return (
                                                collection.id == coll.id &&
                                                coll.count
                                            );
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </article>
        </section>
    );
}
