"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useGuestStore } from "@/store/use-guest-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FloatingParticles } from "@/components/ui/floating-particles";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { guestName } = useGuestStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        router.push("/admin");
      } else if (guestName) {
        router.push("/regalos");
      } else {
        router.push("/login");
      }
    }, 1500); // Added delay for better loading experience

    return () => clearTimeout(timer);
  }, [user, guestName, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20 flex items-center justify-center particles-bg">
      <FloatingParticles />
      <div className="text-center space-y-6 scale-in">
        <div className="inline-flex items-center justify-center w-full h-24 mb-4">
          <Image
            src="/logo-emi.png"
            alt="login"
            width={416}
            height={416}
            style={{
              maxHeight: "100%",
              maxWidth: "416px",
            }}
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground neon-glow">
          Lista de Regalos
        </h1>
        <LoadingSpinner size="lg" text="Cargando aplicación..." />
      </div>
    </div>
  );
}
