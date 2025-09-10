"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/primitives/dropdown-menu";
import { Badge } from "@/components/ui/primitives/badge";
import { ScrollArea } from "@/components/ui/primitives/scroll-area";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc-client";

type NotificationFromDB = {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata: unknown;
  clubManagerId: string;
  clubId: string;
  isRead: boolean;
  createdAt: Date;
};

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  clubManagerId: string;
  clubId: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Queries
  const notificationsQuery = trpc.notifications.getAll.useQuery(undefined, {
    enabled: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCountQuery = trpc.notifications.getUnreadCount.useQuery(
    undefined,
    {
      enabled: true,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );

  // Mutations
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
      unreadCountQuery.refetch();
    },
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Toutes les notifications marquées comme lues");
    },
  });

  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(
        notificationsQuery.data.map((n: NotificationFromDB) => ({
          ...n,
          createdAt: n.createdAt.toString(),
          metadata: n.metadata as Record<string, unknown> | null,
        }))
      );
    }
  }, [notificationsQuery.data]);

  useEffect(() => {
    if (unreadCountQuery.data !== undefined) {
      setUnreadCount(unreadCountQuery.data);
    }
  }, [unreadCountQuery.data]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate({ id: notificationId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ATHLETE_ADDED":
        return "👤";
      case "ATHLETE_UPDATED":
        return "✏️";
      case "ATHLETE_DELETED":
        return "🗑️";
      case "INSURANCE_UPDATED":
        return "🛡️";
      case "PAYMENT_MADE":
        return "💳";
      default:
        return "📢";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Tout marquer lu
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  !notification.isRead && handleMarkAsRead(notification.id)
                }
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-2 flex-1">
                    <span className="text-lg mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium truncate ${
                            !notification.isRead
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground justify-center">
              <Button variant="ghost" size="sm" className="text-xs">
                Voir toutes les notifications
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
