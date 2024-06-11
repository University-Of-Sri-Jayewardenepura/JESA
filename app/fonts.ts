import localFont from "next/font/local";

export const plusjakarta = localFont({
  src: [
    {
      path: "../public/fonts/PlusJakartaSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/PlusJakartaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PlusJakartaSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

export const zodiak = localFont({
  src: [
    {
      path: "../public/fonts/Zodiak-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Zodiak-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});
