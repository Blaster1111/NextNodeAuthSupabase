'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  // 🔥 Call backend /user API with backendAccessToken
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = (session as any)?.backendAccessToken; // Adjust this if stored differently
        if (!token) {
          console.warn("No backendAccessToken found");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Backend /user API response:", data);
      } catch (err) {
        console.error("Error calling backend /user API:", err);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, session]);

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">
                {session?.user?.name}
              </CardTitle>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={() => signOut()}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
