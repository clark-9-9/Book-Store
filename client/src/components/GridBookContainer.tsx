import { BooksType } from "@/app/types/app";
import { Checkbox } from "@mui/material";
import { ChevronDown, Star } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingBook from "./LoadingBook";
import Book from "./Book";
import { ratings } from "@/data/Home";

function GridBookContainer({
    books,
}: {
    books: BooksType[];
    setBooks?: React.Dispatch<React.SetStateAction<BooksType[]>>;
}) {
    const [showPricePopup, setShowPricePopup] = useState(false);
    const [showRatingPopup, setShowRatingPopup] = useState(false);

    const [checkedBooks, setCheckedBooks] = useState<BooksType[]>([]);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [tempMinPrice, setTempMinPrice] = useState("");
    const [tempMaxPrice, setTempMaxPrice] = useState("");
    const [size, setSize] = useState(20);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 500
            ) {
                // Load 10 more items
                setSize((prevSize) => prevSize + 20);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (
    //             window.innerHeight + window.scrollY >=
    //             document.body.offsetHeight - 500
    //         ) {
    //             // Load 10 more items
    //             setSize((prevSize) => prevSize + 20);
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    return (
        <article className="flex flex-col gap-8">
            <div className="flex gap-4">
                {/* <div className="flex cursor-pointer items-center justify-center rounded-[5px] bg-box_container_color px-[12px] py-[4px]">
                    <p>Reset</p>
                </div> */}

                <div className="relative z-[12] rounded-[5px] bg-box_container_color px-[12px] py-[4px]">
                    <div
                        className="flex h-full w-full cursor-pointer items-center justify-center gap-2"
                        onClick={() => {
                            setShowPricePopup((prev) => {
                                setShowRatingPopup(false);
                                return !prev;
                            });
                        }}
                    >
                        <p>Price</p>
                        <ChevronDown size={14} />
                    </div>

                    <div
                        className={`popup_price_container absolute left-0 top-[calc(100%+10px)] flex flex-col gap-4 rounded bg-box_container_color p-4 duration-200 ease-in-out ${!showPricePopup ? "invisible top-[calc(100%)] opacity-0" : "opacity-1 visible top-[calc(100%+10px)]"} `}
                    >
                        <div>
                            <label id="min" htmlFor="min_price">
                                min : $
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={1000}
                                className="w-[60px] pl-2 font-bold text-black"
                                value={tempMinPrice}
                                onChange={(e) =>
                                    setTempMinPrice(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label id="max" htmlFor="min_price">
                                max : $
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={1000}
                                className="w-[60px] pl-2 font-bold text-black"
                                value={tempMaxPrice}
                                onChange={(e) =>
                                    setTempMaxPrice(e.target.value)
                                }
                            />
                        </div>

                        <button
                            className="rounded bg-blue_color p-1"
                            onClick={() => {
                                setMinPrice(tempMinPrice);
                                setMaxPrice(tempMaxPrice);
                            }}
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div className="relative z-[12] rounded-[5px] bg-box_container_color px-[12px] py-[4px]">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-2"
                        onClick={() => {
                            setShowRatingPopup((prev) => {
                                setShowPricePopup(false);
                                return !prev;
                            });
                        }}
                    >
                        <p>Rating</p>
                        <ChevronDown size={14} />
                    </div>

                    <div
                        className={`popup_rating_container visible absolute left-0 top-[calc(100%+10px)] flex flex-col gap-4 rounded bg-box_container_color px-4 py-2 duration-200 ease-in-out ${!showRatingPopup ? "invisible top-[calc(100%)] opacity-0" : "opacity-1 visible top-[calc(100%+10px)]"}`}
                    >
                        {ratings.map((rating, i) => {
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-1"
                                >
                                    <Checkbox
                                        // checked={rating.stauts}
                                        style={{
                                            color: "var(--blue_color)",
                                            borderRadius: "4px",
                                            padding: "4px",
                                        }}
                                        size="small"
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
                                                setCheckedBooks(
                                                    (prevCheckedBooks) => {
                                                        const filteredBooks =
                                                            books.filter(
                                                                (book) =>
                                                                    rating.rate ===
                                                                    Math.floor(
                                                                        book.stars
                                                                    )
                                                            );
                                                        return [
                                                            ...prevCheckedBooks,
                                                            ...filteredBooks,
                                                        ];
                                                    }
                                                );
                                            } else {
                                                setCheckedBooks(
                                                    (prevCheckedBooks) =>
                                                        prevCheckedBooks.filter(
                                                            (book) =>
                                                                Math.floor(
                                                                    book.stars
                                                                ) !==
                                                                rating.rate
                                                        )
                                                );
                                            }
                                        }}
                                    />

                                    {Array.from({ length: 5 }, (_, ii) => {
                                        return (
                                            <Star
                                                key={ii}
                                                size={16}
                                                fill={i > ii ? "white" : ""}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid_book_container">
                {(() => {
                    if (checkedBooks.length > 0) {
                        return checkedBooks && checkedBooks.length > 0
                            ? checkedBooks
                                  .sort((a, b) => a.stars - b.stars)
                                  .slice(0, size)
                                  .map((book) => {
                                      if (minPrice && maxPrice) {
                                          if (
                                              book.price >= +minPrice &&
                                              book.price <= +maxPrice
                                          ) {
                                              return (
                                                  <Book
                                                      book={book}
                                                      key={book._id}
                                                  />
                                              );
                                          }
                                      } else {
                                          return (
                                              <Book
                                                  book={book}
                                                  key={book._id}
                                              />
                                          );
                                      }
                                  })
                            : Array.from({ length: 4 }, (_, i) => {
                                  return <LoadingBook key={i} />;
                              });
                    } else {
                        return books && books.length > 0
                            ? books
                                  .slice(0, size)
                                  //   .sort((a, b) => a.stars - b.stars)
                                  .map((book) => {
                                      if (minPrice && maxPrice) {
                                          if (
                                              book.price >= +minPrice &&
                                              book.price <= +maxPrice
                                          ) {
                                              return (
                                                  <Book
                                                      book={book}
                                                      key={book._id}
                                                  />
                                              );
                                          }
                                      } else {
                                          return (
                                              <Book
                                                  book={book}
                                                  key={book._id}
                                              />
                                          );
                                      }
                                  })
                            : Array.from({ length: 4 }, (_, i) => {
                                  return <LoadingBook key={i} />;
                              });
                    }
                })()}
            </div>
        </article>
    );
}

export default GridBookContainer;
