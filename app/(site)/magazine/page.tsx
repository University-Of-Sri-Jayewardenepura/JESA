import type { Metadata } from "next/types";
import MagazineFlip from "./magazine-flip";

export const metadata: Metadata = {
  title: "JESA 2026 | Magazine",
  description:
    "A digital magazine showcasing past JESA winners and their achievements and stories of their success including quotes from our partners and academic staff.",
};

export default function Magazine() {
  return <MagazineFlip />;
}
