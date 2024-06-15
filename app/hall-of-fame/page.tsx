import { Metadata } from "next/types";
import HallOfFamePage from "./hall-of-fame";

export const metadata: Metadata = {
  title: "JESA 2024 | Hall of Fame",
  description:
    "Enshrining the remarkable achievements of JESA's most illustrious undergraduates. This prestigious honor roll celebrates the epitome of excellence, recognizing shining talents who have inspired with their brilliance and passion. A beacon of inspiration for future generations.",
};

export default function HallOfFame() {
  return <HallOfFamePage />;
}
