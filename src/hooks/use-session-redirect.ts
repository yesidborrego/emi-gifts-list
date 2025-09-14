"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useGuestStore } from "@/store/use-guest-store";

const GUEST_LAST_PATH_KEY = "guest-last-path";
const ADMIN_LAST_PATH_KEY = "admin-last-path";

export function useSessionRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  const { session, isLoading: isAuthLoading } = useAuthStore();
  const { guestName, isLoading: isGuestLoading } = useGuestStore();

  useEffect(() => {
    if (isAuthLoading || isGuestLoading) return;

    const guestLastPath = localStorage.getItem(GUEST_LAST_PATH_KEY);
    const adminLastPath = localStorage.getItem(ADMIN_LAST_PATH_KEY);

    if (session && adminLastPath) {
      if (pathname !== adminLastPath) {
        router.replace(adminLastPath);
      }
    } else if (guestName && guestLastPath) {
      if (pathname !== guestLastPath) {
        router.replace(guestLastPath);
      }
    } else if (pathname.startsWith("/regalos") && !guestName) {
      router.replace("/login");
    }
  }, [session, guestName, isAuthLoading, isGuestLoading, pathname, router]);

  useEffect(() => {
    if (pathname.startsWith("/admin") && session) {
      localStorage.setItem(ADMIN_LAST_PATH_KEY, pathname);
    } else if (pathname.startsWith("/regalos") && guestName) {
      localStorage.setItem(GUEST_LAST_PATH_KEY, pathname);
    }
  }, [pathname, session, guestName]);
}

export function SessionRedirect() {
  useSessionRedirect();
  return null;
}
