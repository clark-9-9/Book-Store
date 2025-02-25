import Sidebar from "@/components/Sidebar";
import "../globals.css";
import "animate.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="main_pages_container">
            <Sidebar />
            {children}
        </section>
    );
}
