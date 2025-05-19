// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/context/UserProvider"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import { ThemeProvider } from "next-themes"
import { loadEventsData } from "@/lib/loadEventsData"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Aura Events",
  description: "Find amazing events near you.",
}

export default async function RootLayout({ children }) {
  const { users, categories, cities } = await loadEventsData()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar users={users} categories={categories} cities={cities} />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
