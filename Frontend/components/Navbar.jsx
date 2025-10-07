'use client'; // This component uses client-side hooks

import {Button } from "./ui/button"
import { Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/Context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <span className="text-2xl font-bold text-foreground">RedGold</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/donor-dashboard">
                <Button variant="ghost">Donor Dashboard</Button>
              </Link>
              <Link href="/receiver-dashboard">
                <Button variant="ghost">Receiver Dashboard</Button>
              </Link>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Signup</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

