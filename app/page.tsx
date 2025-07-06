import Footer from "@/components/footer";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div>
    <main className="flex min-h-screen min-w-[340px] flex-col bg-background font-sans text-white antialiased">
      <header className="fixed left-0 right-0 z-50 h-14 bg-background px-safe pt-safe lg:h-16 top-9">
     <Nav />
      </header>

    </main>
      <Footer />
    </div>
  );
}
