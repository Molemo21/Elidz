"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { mockNotifications } from "@/lib/mock-data"

export function Header() {
  const { user, logout, isAdmin, loading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [showHeaderLogo, setShowHeaderLogo] = useState(false)
  
  const isHomePage = pathname === "/"

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
    // Check if splash is showing
    const splashShown = sessionStorage.getItem("splashShown")
    setShowSplash(splashShown !== "true")
    setShowHeaderLogo(splashShown === "true") // Show logo immediately if splash already shown

    // Listen for splash zoom start - show header logo during zoom
    const handleSplashZoomStart = () => {
      setShowHeaderLogo(true)
      setShowSplash(false) // Allow header to show during zoom
    }

    // Listen for splash completion
    const handleSplashComplete = () => {
      setShowSplash(false)
      setShowHeaderLogo(true)
    }

    window.addEventListener("splashZoomStart", handleSplashZoomStart)
    window.addEventListener("splashComplete", handleSplashComplete)

    return () => {
      window.removeEventListener("splashZoomStart", handleSplashZoomStart)
      window.removeEventListener("splashComplete", handleSplashComplete)
    }
  }, [])

  // Show loading skeleton only during initial load, not during subsequent auth checks
  // Once we have a user, don't show loading again to prevent flickering
  const showLoading = !mounted || (loading && !user)
  
  // Ensure user has required properties before rendering user menu
  // Add null safety checks to prevent runtime errors
  const hasValidUser = Boolean(user && user.name && user.email && user.id)

  // Handle scroll effect for transparent header on home page
  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true) // Always show solid background on other pages
      return
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const headerClasses = isHomePage && !scrolled
    ? "fixed top-0 left-0 right-0 z-[9999] bg-transparent backdrop-blur-sm transition-all duration-300"
    : "fixed top-0 left-0 right-0 z-[9999] bg-black shadow-lg transition-all duration-300"

  // Hide header during initial splash breathing phase only
  if (showSplash && isHomePage && !showHeaderLogo) {
    return null
  }

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ELIDZ-STP Logo */}
          <Link 
            href="/" 
            className={`flex items-center hover:opacity-80 transition-opacity duration-1000 ${
              showHeaderLogo ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image 
              src="/home.png" 
              alt="ELIDZ-STP" 
              width={150} 
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {showLoading ? (
              <div className="h-9 w-24 animate-pulse rounded bg-white/40 border border-white/20" />
            ) : hasValidUser ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="text-sm font-medium !text-white hover:!text-orange-500 transition-colors"
                >
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </Link>
                <Link 
                  href="/opportunities" 
                  className="text-sm font-medium !text-white hover:!text-orange-500 transition-colors"
                >
                  Opportunities
                </Link>

                {/* Notifications */}
                <NotificationBell
                  notifications={mockNotifications}
                  unreadCount={mockNotifications.filter((n) => !n.read).length}
                  onMarkAsRead={(id) => {
                    // TODO: Implement mark as read functionality
                    console.log("Mark as read:", id)
                  }}
                  onMarkAllAsRead={() => {
                    // TODO: Implement mark all as read functionality
                    console.log("Mark all as read")
                  }}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 !text-white hover:!bg-white/10 hover:!text-white !border-0 [&_svg]:!text-white"
                    >
                      <User className="h-4 w-4" />
                      {user?.name || "User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.name || "User"}</span>
                        <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login" className="inline-block">
                <Button 
                  size="sm" 
                  className="!bg-orange-500 !text-white hover:!bg-orange-600 !border-0 !font-medium"
                  style={{ backgroundColor: '#f97316', color: 'white' }}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
