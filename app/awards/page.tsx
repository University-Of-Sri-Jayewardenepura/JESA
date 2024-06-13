import { Metadata } from "next/types";
import AwardsPage from "./awards-card";

export const metadata: Metadata = {
  title: "JESA 2024 | Awards",
  description:
    "Official 2024 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
};

export default function HallOfFame() {
  return <AwardsPage />;
}
