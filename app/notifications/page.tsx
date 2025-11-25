"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import {
  Sparkles,
  FileCheck,
  CheckCircle2,
  Bell,
  BellOff,
  CheckCheck,
  ArrowLeft,
} from "lucide-react"
import { mockNotifications } from "@/lib/mock-data"
import type { Notification } from "@/lib/db-schema"

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "match":
      return <Sparkles className="h-5 w-5 text-primary" />
    case "application_completed":
      return <FileCheck className="h-5 w-5 text-chart-2" />
    case "status_update":
      return <CheckCircle2 className="h-5 w-5 text-success" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "match":
      return "bg-primary/10 text-primary border-primary/20"
    case "application_completed":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20"
    case "status_update":
      return "bg-success/10 text-success border-success/20"
    default:
      return "bg-muted"
  }
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all")

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    redirect("/login")
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter)

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case "match":
        return "/opportunities"
      case "application_completed":
        return "/applications"
      case "status_update":
        return "/applications"
      default:
        return "/dashboard"
    }
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your funding opportunities and applications</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" className="gap-2">
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="match">
              <Sparkles className="h-4 w-4 mr-2" />
              Matches ({notifications.filter((n) => n.type === "match").length})
            </TabsTrigger>
            <TabsTrigger value="application_completed">
              <FileCheck className="h-4 w-4 mr-2" />
              Applications ({notifications.filter((n) => n.type === "application_completed").length})
            </TabsTrigger>
            <TabsTrigger value="status_update">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Updates ({notifications.filter((n) => n.type === "status_update").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Link key={notification.id} href={getNotificationLink(notification)}>
                  <Card
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      !notification.read ? "border-primary/50 bg-primary/5" : ""
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 p-3 rounded-lg border ${getNotificationColor(
                            notification.type,
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg">{notification.title}</CardTitle>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                            )}
                          </div>
                          <CardDescription className="mb-3">
                            {notification.message}
                          </CardDescription>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.created_at, {
                                addSuffix: true,
                              })}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getNotificationColor(notification.type)}`}
                            >
                              {notification.type.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BellOff className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <CardTitle className="mb-2">No Notifications</CardTitle>
                  <CardDescription>
                    {filter === "all"
                      ? "You're all caught up! No notifications yet."
                      : `No ${filter.replace("_", " ")} notifications found.`}
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

