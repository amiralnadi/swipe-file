"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.githubUsername) {
      router.replace(`/${session.githubUsername}`);
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );
}
