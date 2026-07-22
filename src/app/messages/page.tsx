"use client";

import { useSession } from "@/lib/session";
import { messagesPath } from "@/lib/accountData";
import MessagingApp from "@/components/messaging/MessagingApp";

export default function MessagesPage() {
  const session = useSession();

  if (session === undefined) return null;

  if (!session || session.role !== "admin") {
    if (typeof window !== "undefined") {
      window.location.href = session ? messagesPath(session.role) : "/";
    }
    return null;
  }

  return <MessagingApp role="admin" />;
}
