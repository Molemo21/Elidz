"use client"

import Image from "next/image"
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type AdminTab = "dashboard" | "users" | "analytics" | "settings"

const navigation: { name: string; tab: AdminTab; icon: typeof LayoutDashboard }[] = [
  { name: "Dashboard", tab: "dashboard", icon: LayoutDashboard },
  { name: "User Management", tab: "users", icon: Users },
  { name: "Analytics", tab: "analytics", icon: BarChart3 },
  { name: "Settings", tab: "settings", icon: Settings },
]

interface AdminSidebarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false)
    await logout()
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl transition-transform duration-300",
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-white/20 px-4">
            <button
              onClick={() => {
                onTabChange("dashboard")
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/home.png"
                alt="ELIDZ-STP"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = activeTab === item.tab
              const Icon = item.icon

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onTabChange(item.tab)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-left",
                    isActive
                      ? "bg-orange-500/20 text-white border border-orange-400/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-white/20 p-4">
            <Button
              onClick={handleLogoutClick}
              variant="ghost"
              className="w-full justify-start gap-3 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="border-white/20 bg-gray-900/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to logout? You will need to sign in again to access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

