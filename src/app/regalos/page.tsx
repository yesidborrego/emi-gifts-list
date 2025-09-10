"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuestStore } from "@/store/use-guest-store";
import { GiftList } from "@/components/Gift/Molecules/GiftList";
import { UserHeader } from "@/components/user-header";

export default function RegalosPage() {
  const router = useRouter();
  const { guestName } = useGuestStore();

  useEffect(() => {
    if (!guestName) {
      router.push("/login");
    }
  }, [guestName, router]);

  if (!guestName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <UserHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="slide-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Lista de Regalos
            </h1>
            <p className="text-muted-foreground text-balance">
              Selecciona los regalos que te gustaría obsequiar. Puedes elegir
              varios productos según disponibilidad.
            </p>
          </div>
          <GiftList />
        </div>
      </main>
    </div>
  );
}
