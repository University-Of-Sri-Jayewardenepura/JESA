"use client"
import { useRouter } from "next/navigation";
import RegistrationForm2026 from "./registration-form-2026";
import { useEffect } from "react";

const Page = () => {
	const router = useRouter()
	useEffect(()=>{router.push("/register")},[router])
	return (
		<section className="register-form relative overflow-x-hidden pt-28 sm:pt-32 md:pt-36 lg:pt-40">
			{/* <RegistrationForm2026 /> */}
		</section>
	);
};

export default Page;
