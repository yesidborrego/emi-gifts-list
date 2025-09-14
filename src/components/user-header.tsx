"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGuestStore } from "@/store/use-guest-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { fetchLogout } from "@/services/apiAuth.service";

export function UserHeader() {
  const { user: adminUser, signOut: adminSignOut } = useAuthStore();
  const { guestName, clearGuestName } = useGuestStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onLogout = async () => {
    await fetchLogout();
  };

  const handleLogout = async () => {
    if (adminUser) {
      onLogout();
      adminSignOut();
      useAuthStore.persist.clearStorage();
      localStorage.removeItem("admin-last-path");
      router.push("/login-admin");
    } else {
      clearGuestName();
      useGuestStore.persist.clearStorage();
      localStorage.removeItem("guest-last-path");
      router.push("/login");
    }
  };

  const displayName = guestName || adminUser?.name;
  const role = adminUser ? "Administrador" : "Visitante";

  if (!isMounted) {
    return null;
  }

  return (
    <Card className="slide-in-up m-4 border-0 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-emi.png"
            alt="Emiliana"
            width={80}
            height={24}
            className="object-contain"
          />
          <div>
            <h2 className="font-semibold text-card-foreground">
              Hola, {displayName}
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                variant={adminUser ? "default" : "secondary"}
                className="text-xs"
              >
                {role}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-white cursor-pointer"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </Card>
  );
}
