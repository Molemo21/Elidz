"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  FileCheck,
  CheckCircle2,
  Bell,
  BellOff,
  CheckCheck,
} from "lucide-react"
import type { Notification } from "@/lib/db-schema"

interface NotificationCenterProps {
  notifications: Notification[]
  onClose: () => void
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "match":
      return <Sparkles className="h-4 w-4 text-primary" />
    case "application_completed":
      return <FileCheck className="h-4 w-4 text-chart-2" />
    case "status_update":
      return <CheckCircle2 className="h-4 w-4 text-success" />
    default:
      return <Bell className="h-4 w-4" />
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

export function NotificationCenter({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter)

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id)
  }

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.()
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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="h-8 text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-3 border-b border-border">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs h-7"
        >
          All
        </Button>
        <Button
          variant={filter === "match" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("match")}
          className="text-xs h-7"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Matches
        </Button>
        <Button
          variant={filter === "application_completed" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("application_completed")}
          className="text-xs h-7"
        >
          <FileCheck className="h-3 w-3 mr-1" />
          Applications
        </Button>
        <Button
          variant={filter === "status_update" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("status_update")}
          className="text-xs h-7"
        >
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Updates
        </Button>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={getNotificationLink(notification)}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(notification.id)
                  }
                  onClose()
                }}
                className="block"
              >
                <div
                  className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg border ${getNotificationColor(
                        notification.type,
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={`text-sm font-semibold ${
                            !notification.read
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.created_at, {
                            addSuffix: true,
                          })}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getNotificationColor(
                            notification.type,
                          )}`}
                        >
                          {notification.type.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <BellOff className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground text-center">
              {filter === "all"
                ? "No notifications yet"
                : `No ${filter.replace("_", " ")} notifications`}
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Link href="/notifications">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={onClose}
          >
            View All Notifications
          </Button>
        </Link>
      </div>
    </div>
  )
}

