"use client";
import { useEffect } from "react";
import { useToast } from "../components/Toast";
import { useRouter } from "next/navigation";

export function SessionExpiredListener() {
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    function onSessionExpired() {
      showToast("Session expired. Please log in again.", "error");
      setTimeout(() => {
        router.replace("/auth/login?session=expired");
      }, 1500);
    }
    window.addEventListener("session-expired-toast", onSessionExpired);
    return () => window.removeEventListener("session-expired-toast", onSessionExpired);
  }, [showToast, router]);

  return null;
}
