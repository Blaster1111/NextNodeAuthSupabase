'use client';

import { useSession } from "next-auth/react";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoginButton />
      </main>
    );
  }

  return null;
}
