import type { Metadata } from "next/types";
import HallOfFamePage from "./hall-of-fame";

export const metadata: Metadata = {
  title: "JESA 2025 | Hall of Fame",
  description:
    "A prestigious digital gallery showcasing all past JESA winners from 2019 to 2024. This page will feature winner profiles, their achievements, current endeavors, and inspirational quotes. It serves as a testament to the lasting impact of JESA recognition and creates a legacy for future aspirants.",
};

export default function HallOfFame() {
  return <HallOfFamePage />;
}
