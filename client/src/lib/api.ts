import { LogEntry, ReviewRecord, UserProfile } from "@/types";

export async function fetchMe(): Promise<UserProfile | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchReviews(): Promise<ReviewRecord[]> {
  try {
    const res = await fetch("/api/reviews", { credentials: "include" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchReviewDetail(id: string): Promise<ReviewRecord | null> {
  try {
    const res = await fetch(`/api/reviews/${id}`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLogs(
  service: "main-server" | "client-server" | "rag-server",
  limit = 50
): Promise<LogEntry[]> {
  try {
    const res = await fetch(`/api-logs/${service}-logs?limit=${limit}`, { credentials: "include" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
