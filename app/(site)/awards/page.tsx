import type { Metadata } from "next/types";
import AwardsPage from "./awards-card";

export const metadata: Metadata = {
  title: "JESA 2026 | Awards",
  description:
    "The JESA Awards highlight the remarkable talents and outstanding achievements of undergraduates from the University of Sri Jayewardenepura and beyond.",
};

export default function HallOfFame() {
  return <AwardsPage />;
}
