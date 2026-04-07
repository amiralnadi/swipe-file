"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type OnboardStatus = "idle" | "checking" | "ready" | "not_installed" | "needs_repo" | "error";

export function useOnboard() {
  const { data: session, status } = useSession();
  const [onboardStatus, setOnboardStatus] = useState<OnboardStatus>("idle");

  useEffect(() => {
    if (status !== "authenticated" || !session?.githubUsername) return;
    if (onboardStatus !== "idle") return;

    setOnboardStatus("checking");

    fetch("/api/onboard", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ready") setOnboardStatus("ready");
        else if (data.status === "not_installed") setOnboardStatus("not_installed");
        else if (data.status === "needs_repo") setOnboardStatus("needs_repo");
        else setOnboardStatus("error");
      })
      .catch(() => setOnboardStatus("error"));
  }, [status, session, onboardStatus]);

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || onboardStatus === "checking",
    isReady: onboardStatus === "ready",
    isNotInstalled: onboardStatus === "not_installed",
    isNeedsRepo: onboardStatus === "needs_repo",
    isError: onboardStatus === "error",
    isUnauthenticated: status === "unauthenticated",
  };
}
