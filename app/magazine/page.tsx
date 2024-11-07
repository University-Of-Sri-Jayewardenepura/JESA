import { Metadata } from "next/types";
import Magazine from "./magazine";

export const metadata: Metadata = {
  title: "JESA 2024 | Magazine",
  description:
    "Showcasing months of dedicated work culminating in the grand JESA Awards Ceremony. This magazine highlights the meticulous planning, the inspiring stories, and the unforgettable moments that made the event a resounding success. A tribute to the collective effort and passion that brought the JESA vision to life.",
};

export default function HallOfFame() {
  return <Magazine />;
}
