import Sidebar from "@/components/Sidebar";
import "../globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="main_pages_container">
            <Sidebar />
            {children}
        </section>
    );
}
