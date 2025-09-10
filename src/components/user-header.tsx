"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/use-auth-store";
import { useGuestStore } from "@/store/use-guest-store";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function UserHeader() {
  const { user, signOut } = useAuthStore();
  const { guestName, clearGuestName } = useGuestStore();
  const { adminName } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    if (user) {
      await signOut();
    } else {
      clearGuestName();
    }
    router.push("/login");
  };

  const displayName = guestName || adminName;
  // user?.user_metadata?.full_name ?? user?.email ?? guestName;
  console.log({ displayName });
  const role = user ? "Administrador" : "Visitante";

  if (!displayName) {
    return null;
  }

  return (
    <Card className="m-4 p-4 bg-card/95 backdrop-blur-sm border-0 shadow-lg slide-in-up">
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
                variant={user ? "default" : "secondary"}
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
            className="text-muted-foreground hover:text-white"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </Card>
  );
}
