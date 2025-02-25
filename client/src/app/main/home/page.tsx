/* eslint-disable @next/next/no-img-element */
"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import compass from "../../../assets/imgs/compass.svg";
import { Search, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BooksType } from "@/app/types/app";
import LodingBook from "@/components/LoadingBook";
import Book from "@/components/Book";
import { categories } from "@/data/Home";
import Link from "next/link";
import GridBookContainer from "@/components/GridBookContainer";

export default function Home() {
    const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
    const [books, setBooks] = useState<BooksType[]>([]);
    const [bestSeller, setBestSeller] = useState<BooksType[]>([]);

    const searchParams = useSearchParams();
    const limit = searchParams.get("limit") || "50000";
    const router = useRouter();

    useEffect(() => {
        const fetchUserSharedBooks = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/main/home/api/usersSharedBooks?limit=${limit}`
                );
                const {
                    data: { data },
                }: { data: { data: BooksType[] } } = await res.json();

                if (data) {
                    setBooks(data);
                } else {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserSharedBooks();

        const bestSeller = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/main/home/api/bestSellerBooks`
                );
                const {
                    data: { data },
                }: { data: { data: BooksType[] } } = await res.json();

                if (data) {
                    setBestSeller(data);
                } else {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }
            } catch (err) {
                console.log(err);
            }
        };
        bestSeller();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="home_page ml-[220px] flex flex-col justify-center gap-4 p-4">
            <article className="flex w-full flex-col gap-[20px]">
                <div className="relative flex items-center gap-6">
                    <div
                        className="flex cursor-pointer items-center gap-2 rounded-[5px] bg-box_container_color px-[15px] py-[7px] text-[1rem]"
                        onClick={() =>
                            setShowCategoriesPopup(!showCategoriesPopup)
                        }
                    >
                        <Image src={compass} alt="" />
                        <p>Browse</p>
                    </div>

                    <div
                        className={`popup_categories animate__animated absolute left-0 top-12 z-20 bg-book_container_color p-4 transition duration-300 ease-in-out ${showCategoriesPopup ? "animate__fadeInDown opacity-1 visible" : "animate__fadeOut invisible opacity-0"} `}
                    >
                        {categories.map((category, i) => {
                            return (
                                <Link
                                    href={`/main/home/category/${category.id}`}
                                    className="cursor-pointer"
                                    key={i}
                                >
                                    {category.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="relative">
                        <Search
                            className="absolute left-4 top-[50%] translate-y-[-50%] cursor-pointer"
                            size={20}
                            color="rgba(255,255,255,0.5)"
                            onClick={(e) => {
                                const searchTerm = (
                                    e.target as HTMLInputElement
                                ).value;

                                if (searchTerm) {
                                    router.push(
                                        `/main/home/search?searched=${searchTerm}`
                                    );
                                }
                            }}
                        />
                        <input
                            type="text"
                            className="w-[320px] rounded-full border-none bg-box_container_color px-4 py-[7px] pl-[50px] outline-none"
                            placeholder="search"
                            onKeyDown={(e) => {
                                const searchTerm = (
                                    e.target as HTMLInputElement
                                ).value.trim();

                                if (e.key === "Enter") {
                                    if (searchTerm) {
                                        router.push(
                                            `/main/home/search?searched=${searchTerm}`
                                        );
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="slider_container flex min-h-[300px] w-full flex-col gap-5 rounded-[7px] bg-box_container_color px-2 py-6">
                    <h2 className="text-center text-xl font-bold text-white">
                        Top 50 Best Seller Books
                    </h2>

                    <Swiper
                        navigation={true}
                        mousewheel={true}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            1200: {
                                slidesPerView: 2,
                                spaceBetween: 0,
                            },

                            1470: {
                                slidesPerView: 3,
                                spaceBetween: 0,
                            },
                        }}
                        modules={[Navigation, Pagination, Mousewheel]}
                        className="mySwiper h-full w-full"
                    >
                        {bestSeller && bestSeller.length > 0
                            ? bestSeller.map((book) => (
                                  <SwiperSlide key={book._id}>
                                      <div className="book_container flex h-full w-full items-center justify-center px-2">
                                          <Book book={book} />
                                      </div>
                                  </SwiperSlide>
                              ))
                            : Array.from({ length: 4 }, (_, i) => {
                                  return (
                                      <SwiperSlide key={i}>
                                          <div className="book_container flex h-full w-full items-center justify-center px-2">
                                              <LodingBook key={i} />
                                          </div>
                                      </SwiperSlide>
                                  );
                              })}
                    </Swiper>
                </div>
            </article>

            <GridBookContainer books={books} setBooks={setBooks} />
        </section>
    );
}
