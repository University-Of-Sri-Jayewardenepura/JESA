// import Announcement from "@/components/annoucement";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main
			className="flex min-w-[340px] flex-col overflow-hidden font-sans text-slate-200 antialiased"
			style={{ background: "var(--background-gradient)" }}
		>
			<header className="fixed top-0 right-0 left-0 z-50 flex justify-center bg-background px-5 px-safe pt-safe lg:h-16">
				{/* <Announcement /> */}
				<Nav />
			</header>
			<div className="min-h-screen">{children}</div>
			<Footer />
		</main>
	);
}
