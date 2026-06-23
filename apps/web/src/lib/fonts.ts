import localFont from "next/font/local"

const appFont = localFont({
  variable: "--font-sans",
  src: [
    {
      path: "./fonts/300.otf",
      weight: "300",
      style: "normal"
    },
    {
      path: "./fonts/400.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/500.otf",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/600.otf",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/700.otf",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/800.otf",
      weight: "800",
      style: "normal"
    },
  ]
})

export default appFont