/* eslint-disable @next/next/no-img-element */
import { BooksType, CollectionType, SavedBooksType } from "@/app/types/app";
import { Box, Checkbox, Modal } from "@mui/material";
import { BookmarkIcon, ShoppingCart, Star, X } from "lucide-react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

interface UserDataType {
    userId: string;
    userName: string;
}

function Book({ book }: { book: BooksType }) {
    const [userData, setUserData] = useState<UserDataType | null>(null);

    const [isBookSaved, setIsBookSaved] = useState<boolean>(false);
    const [showCollectionsPopup, setShowCollectionsPopup] =
        useState<boolean>(false);
    const [showCheckedCollectionsPopup, setShowCheckedCollectionsPopup] =
        useState<boolean>(false);

    const [reload, setReload] = useState(false);
    const [clickSaveBook, setClickSaveBook] = useState(false);
    const [savedBooks, setSavedBooks] = useState<SavedBooksType[]>([]);

    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [getCheckedCollections, setGetCheckedCollections] = useState<
        CollectionType[]
    >([]);
    const [addBookToCheckedCollection, setAddBookToCheckedCollection] =
        useState<string[]>([]);
    const [addCheckedCollection, setCheckedCollection] = useState<string[]>([]);

    const handleAddBookToCollection = async () => {
        const response = await fetch("http://localhost:8080/save-book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userData?.userId,
                collectionsId: addBookToCheckedCollection,
                bookId: book._id,
            }),
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            setReload(true);
            setShowCollectionsPopup(false);
            setClickSaveBook(true);
            handleGetSavedBookCollections();
        }
    };

    const handleRemoveBookToCollection = async () => {
        const response = await fetch(
            "http://localhost:8080/remove-book-from-collections",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userData?.userId,
                    collectionsId: addCheckedCollection,
                    bookId: book._id,
                }),
            }
        );

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            setReload(true);
            setShowCheckedCollectionsPopup(false);
            handleGetSavedBookCollections();

            // Check if the book is completely removed from all collections
            const updatedSavedBooks = savedBooks.filter(
                (savedBook) =>
                    savedBook.book_id !== book._id ||
                    !addCheckedCollection.includes(savedBook.collection_id)
            );
            setSavedBooks(updatedSavedBooks);

            // Update isBookSaved based on whether the book exists in any collection
            const bookStillExists = updatedSavedBooks.some(
                (savedBook) => savedBook.book_id === book._id
            );
            setIsBookSaved(bookStillExists);
            setClickSaveBook(bookStillExists);
        }
    };

    useEffect(() => {
        if (reload) {
            setReload(false); // reset the state
        }
    }, [reload]);

    useEffect(() => {
        const data = localStorage.getItem("userData");
        setUserData(JSON.parse(data!));
    }, []);

    // fetch books in a collection
    useEffect(() => {
        const userData = localStorage.getItem("userData");

        if (userData) {
            const getBooksFromTheCollection = async () => {
                const response = await fetch(
                    "http://localhost:8080/get-saved-books",
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

                const { data }: { data: SavedBooksType[] } =
                    await response.json();
                setSavedBooks(data);
            };

            getBooksFromTheCollection();
        }
    }, []);

    // get collections
    useEffect(() => {
        const userData = localStorage.getItem("userData");

        if (userData) {
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

                const { data }: { data: CollectionType[] } =
                    await response.json();
                setCollections(data);
            };
            getCollections();
        }
    }, []);

    // get-saved-book-collections
    const handleGetSavedBookCollections = () => {
        const userData = localStorage.getItem("userData");

        if (userData) {
            const getSavedBookCollections = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:8080/get-saved-book-collections",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: JSON.parse(userData).userId,
                                bookId: book._id,
                            }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }

                    const { data }: { data: CollectionType[] } =
                        await response.json();
                    setGetCheckedCollections(data);
                } catch (error) {
                    console.error(
                        "Error fetching saved book collections:",
                        error
                    );
                }
            };

            getSavedBookCollections();
        }
    };

    useEffect(() => {
        handleGetSavedBookCollections();
    }, []);
    // is Booked Saved
    useEffect(() => {
        const checkIfBookIsSaved = () => {
            for (const collection of savedBooks) {
                if (collection.book_id === book._id) {
                    setIsBookSaved(true);
                    return;
                }
            }
            setIsBookSaved(false);
        };

        checkIfBookIsSaved();
    }, [savedBooks, book]);

    return (
        <Fragment>
            <Modal
                open={showCollectionsPopup}
                onClose={() => setShowCollectionsPopup(false)}
            >
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            padding: "1rem",
                            backgroundColor: "var(--box_container_color) ",
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "400px",
                            overflowY: "scroll",
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => {
                                        if (collections.length === 0) {
                                            alert(
                                                "Please create a collection first"
                                            );
                                        } else {
                                            handleAddBookToCollection();
                                        }
                                    }}
                                    className="rounded border-none bg-blue_color px-4 py-2 text-white outline-none"
                                >
                                    Save
                                </button>

                                <X
                                    size={20}
                                    color="white"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setShowCollectionsPopup(false);
                                        setAddBookToCheckedCollection([]);
                                    }}
                                />
                            </div>
                            {collections.length !== 0 &&
                                collections.map((collection) => {
                                    return (
                                        <div
                                            key={collection.id}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="collection flex h-full w-full cursor-pointer gap-4 rounded px-4 py-2 duration-200 ease-in-out">
                                                <div className="h-[50px] min-w-[50px] truncate rounded bg-white"></div>

                                                <div className="flex w-full items-center">
                                                    <p className="w-full max-w-[140px] font-bold">
                                                        {
                                                            collection.collection_name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Checkbox
                                                style={{
                                                    color: "var(--blue_color)",
                                                    borderRadius: "4px",
                                                    padding: "4px",
                                                }}
                                                onChange={(e) => {
                                                    const checked = (
                                                        e.target as HTMLInputElement
                                                    ).checked;

                                                    if (checked) {
                                                        setAddBookToCheckedCollection(
                                                            (prev) => {
                                                                if (
                                                                    !prev.includes(
                                                                        collection.id
                                                                    )
                                                                ) {
                                                                    return [
                                                                        ...prev,
                                                                        collection.id,
                                                                    ];
                                                                }
                                                                return prev;
                                                            }
                                                        );
                                                    } else {
                                                        setAddBookToCheckedCollection(
                                                            (prev) => {
                                                                return prev.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        collection.id
                                                                );
                                                            }
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={showCheckedCollectionsPopup}
                onClose={() => setShowCheckedCollectionsPopup(false)}
            >
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            padding: "1rem",
                            backgroundColor: "var(--box_container_color) ",
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "400px",
                            overflowY: "scroll",
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => {
                                        if (
                                            getCheckedCollections.length === 0
                                        ) {
                                            alert(
                                                "Please create a collection first"
                                            );
                                        } else {
                                            handleRemoveBookToCollection();
                                        }
                                    }}
                                    className="rounded border-none bg-blue_color px-4 py-2 text-white outline-none"
                                >
                                    Save
                                </button>

                                <X
                                    size={20}
                                    color="white"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setShowCheckedCollectionsPopup(false);
                                        setAddBookToCheckedCollection([]);
                                    }}
                                />
                            </div>
                            {getCheckedCollections.length !== 0 &&
                                getCheckedCollections.map((collection) => {
                                    return (
                                        <div
                                            key={collection.id}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="collection flex h-full w-full cursor-pointer gap-4 rounded px-4 py-2 duration-200 ease-in-out">
                                                <div className="h-[50px] min-w-[50px] truncate rounded bg-white"></div>

                                                <div className="flex w-full items-center">
                                                    <p className="w-full max-w-[140px] font-bold">
                                                        {
                                                            collection.collection_name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Checkbox
                                                style={{
                                                    color: "var(--blue_color)",
                                                    borderRadius: "4px",
                                                    padding: "4px",
                                                }}
                                                onChange={(e) => {
                                                    const checked = (
                                                        e.target as HTMLInputElement
                                                    ).checked;

                                                    if (checked) {
                                                        setCheckedCollection(
                                                            (prev) => {
                                                                if (
                                                                    !prev.includes(
                                                                        collection.id
                                                                    )
                                                                ) {
                                                                    return [
                                                                        ...prev,
                                                                        collection.id,
                                                                    ];
                                                                }
                                                                return prev;
                                                            }
                                                        );
                                                    } else {
                                                        setCheckedCollection(
                                                            (prev) => {
                                                                return prev.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        collection.id
                                                                );
                                                            }
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </Box>
                </Box>
            </Modal>

            <div className="book_component relative flex w-full justify-center gap-[20px] rounded-[7px] bg-book_container_color px-[18px] py-[20px] text-white">
                <p className="popup_title absolute left-0 right-0 top-[-40px] z-[10] max-h-[70px] overflow-y-scroll rounded bg-[rgba(0,0,0,0.4)] px-2 py-2">
                    {book.title} by {book.author}
                </p>

                <Image
                    src={book.img_url}
                    alt=""
                    className="h-[140px] w-[106px]"
                    width={106}
                    height={140}
                    priority
                />

                <div className="flex flex-col justify-between py-2">
                    <div className="flex gap-[60px]">
                        <div className="flex flex-col gap-2">
                            <span className="relative flex w-full flex-col">
                                <p className="title_text relative w-full min-w-[150px] max-w-[150px] text-[15px]">
                                    {book.title}
                                </p>
                                <p className="author_text min-w-[150px] max-w-[170px] text-[14px] opacity-50">
                                    by {book.author}
                                </p>
                            </span>

                            <span className="ratings flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        size={14}
                                        fill={
                                            Math.floor(book.stars) >= i + 1
                                                ? "white"
                                                : "none"
                                        }
                                        key={i}
                                    />
                                ))}
                            </span>
                        </div>

                        <Checkbox
                            checked={isBookSaved ? isBookSaved : clickSaveBook}
                            icon={
                                <BookmarkBorderIcon
                                    style={{ color: "var(--blue_color)" }}
                                />
                            }
                            checkedIcon={
                                <BookmarkIcon fill="var(--blue_color)" />
                            }
                            className="h-max w-max"
                            onClick={(e) => {
                                if (!userData) {
                                    alert("Please login to save books");
                                    return;
                                } else {
                                    const checked = (
                                        e.target as HTMLInputElement
                                    ).checked;

                                    if (!checked) {
                                        setShowCollectionsPopup(false);
                                        setShowCheckedCollectionsPopup(true);
                                    } else {
                                        setShowCollectionsPopup(true);
                                        setShowCheckedCollectionsPopup(false);
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link
                            href={book.product_url}
                            target="_blank"
                            className="cart_btn flex w-max items-center justify-center gap-3 rounded-[5px] bg-blue_color px-[16px] py-[8px] text-[12px]"
                        >
                            <ShoppingCart size={18} />
                            <p>Add to Cart</p>
                        </Link>

                        <p className="font-bold">{book.price}$</p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Book;
