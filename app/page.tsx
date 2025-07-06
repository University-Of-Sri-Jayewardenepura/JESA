import Announcement from "@/components/annoucement";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div>
      <main
        className="flex min-h-screen min-w-[340px] flex-col font-sans text-slate-200 antialiased"
        style={{ background: "var(--background-gradient)" }}
      >
        <header className="fixed left-0 right-0 z-50 bg-background px-safe pt-safe lg:h-16 top-9 flex justify-center px-5">
          <Announcement />
          <Nav />
        </header>
      </main>
      <Footer />
    </div>
  );
}
