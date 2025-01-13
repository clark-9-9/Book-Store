"use client";

import Image from "next/image";
import "./styles/style.css";
// import { redirect } from "next/navigation";

import p1 from "../../public/main/p1.jpg";
import p2 from "../../public/main/p2.jpg";
import p3 from "../../public/main/p3.jpg";
import p4 from "../../public/main/p4.jpg";
import p5 from "../../public/main/p5.jpg";
import p6 from "../../public/main/p6.jpg";
import vector from "../../public/main/Vector_Lighting.svg";
import stretched from "../../public/main/Stretched_Img.png";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Main() {
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) router.push("/main/home");
    });
    return (
        <div className="main_body">
            <header className="navbar">
                <div className="navbar-logo">
                    <Image
                        src={vector}
                        alt=""
                        height={20}
                        width={20}
                        style={{ width: "auto", height: "auto" }}
                    />
                    <p>Book Heaven</p>
                </div>
                <nav className="navbar-links">
                    <Link href="/main/home">Home</Link>
                    <Link href="#about">About Us</Link>
                    <Link href="#work">Our Work</Link>
                </nav>
                <div className="navbar-actions">
                    <Link href={"/account/login"} className="btn-signin">
                        Login
                    </Link>
                    <Link href={"/account/signup"} className="btn-signup">
                        Sign Up
                    </Link>
                </div>
            </header>

            <section className="hero">
                <div className="hero-box">
                    <div className="hero-content">
                        <h1>Explore Our Collection</h1>
                        <p>Discover Your Next Read</p>
                        <div className="hero-buttons">
                            <button className="btn-shop">Shop Now</button>
                            <button className="btn-learn">Learn More</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="why-choose-us">
                <Image
                    className="stretched_image"
                    src={stretched}
                    alt="Storefront"
                    priority
                />

                <div className="why-text">
                    <h2>Why Choose Us?</h2>

                    <div className="features">
                        <div className="feature">
                            <p>Curated Selections</p>
                            <p>
                                Handpicked books tailored to your taste,
                                ensuring your favorite genres are met.
                            </p>
                        </div>
                        <div className="feature">
                            <p>User-Friendly Interface</p>
                            <p>
                                Navigate effortlessly through our extensive
                                library with ease and comfort.
                            </p>
                        </div>
                        <div className="feature">
                            <p>Secure Checkout</p>
                            <p>
                                Enjoy safe and seamless shopping experiences
                                with our secure payment options.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="imagination">
                <div className="imagination-text">
                    <h2>Unleash Your Imagination</h2>
                    <p>
                        Dive into a world of stories and knowledge, where every
                        book opens a new door.
                    </p>
                    <button className="btn-get-started">Get Started</button>
                </div>
                <div className="image-gallery">
                    <Image src={p1} alt="Bookshelf 1" />
                    <Image src={p2} alt="Bookshelf 2" />
                    <Image src={p3} alt="Bookshelf 3" />
                    <Image src={p4} alt="Bookshelf 4" />
                    <Image src={p5} alt="Bookshelf 5" />
                    <Image src={p6} alt="Bookshelf 6" />
                </div>
            </section>

            <section className="Vision">
                <h2>Our Vision</h2>
                <p>
                    To create a vibrant community of readers and foster a love
                    for books across all ages.
                </p>
            </section>

            <footer className="footer">
                <div className="footer-details">
                    <div className="footer-text">Bookstore Team</div>

                    <nav className="footer-links">
                        <a href="#about">About Us</a>
                        <a href="#work">Our Work</a>
                        <a href="#team">@BookstoreTeam</a>
                        <a href="./contact.html">Contact Us</a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
