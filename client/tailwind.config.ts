import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // foreground: "var(--foreground)",
                background: "var(--background)",
                book_container_color: "var(--book_container_color)",
                box_container_color: "var(--box_container_color)",
                blue_color: "var(--blue_color)",
            },
        },
    },
    plugins: [],
} satisfies Config;
