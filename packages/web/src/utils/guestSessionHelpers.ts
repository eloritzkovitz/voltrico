// Checks if a guest session ID exists in localStorage
export function hasGuestSessionId(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("guestSessionId");
}

// Retrieves the guest session ID from localStorage, or null if not set
export function getGuestSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("guestSessionId");
}

// Generates or retrieves a guest session ID stored in localStorage
export function getOrCreateGuestSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("guestSessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("guestSessionId", sessionId);
  }
  return sessionId;
}

// Clears the guest session ID from localStorage
export function clearGuestSessionId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("guestSessionId");
  }
}