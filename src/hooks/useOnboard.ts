import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * On first login, ensures the user's swipe-file repo exists.
 * Creates it if not. Returns onboarding status.
 */
export function useOnboard() {
  const { data: session, status } = useSession();
  const [onboardStatus, setOnboardStatus] = useState<"idle" | "checking" | "ready" | "creating" | "error">("idle");

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    if (onboardStatus !== "idle") return;

    setOnboardStatus("checking");

    fetch("/api/onboard", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ready" || data.status === "created") {
          setOnboardStatus("ready");
        } else {
          setOnboardStatus("error");
        }
      })
      .catch(() => setOnboardStatus("error"));
  }, [status, session, onboardStatus]);

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || onboardStatus === "checking" || onboardStatus === "creating",
    isReady: onboardStatus === "ready",
    isError: onboardStatus === "error",
    isUnauthenticated: status === "unauthenticated",
  };
}
