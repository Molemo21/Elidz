import type React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Dynamically import Header to reduce initial bundle size and prevent chunk loading issues
const Header = dynamic(() => import("@/components/header").then((mod) => ({ default: mod.Header })), {
  ssr: true,
  loading: () => (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-black shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-32 animate-pulse rounded bg-white/20" />
          <div className="h-9 w-24 animate-pulse rounded bg-white/20" />
        </div>
      </div>
    </header>
  ),
})

// Dynamically import Footer to reduce initial bundle size
const Footer = dynamic(() => import("@/components/footer").then((mod) => ({ default: mod.Footer })), {
  ssr: true,
})

export const metadata: Metadata = {
  title: "ELIDZ-STP Funding Platform | AI-Powered SMME Funding",
  description: "AI-powered platform helping SMMEs discover and apply for funding opportunities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <Header />
        <main className="min-h-[calc(100vh-80px)] pt-20">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
