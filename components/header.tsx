"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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

export function Header() {
  const { user, logout, isAdmin, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading skeleton only during initial load, not during subsequent auth checks
  // Once we have a user, don't show loading again to prevent flickering
  const showLoading = !mounted || (loading && !user)
  
  // Ensure user has required properties before rendering user menu
  // Add null safety checks to prevent runtime errors
  const hasValidUser = Boolean(user && user.name && user.email && user.id)

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-black shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-end">
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
